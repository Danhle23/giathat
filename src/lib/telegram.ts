import { getRealDeals } from "./catalog";
import { shopee } from "./shopee/provider";
import { vnd } from "./format";

/**
 * Posts today's genuine deals to a Telegram channel.
 *
 * Reuses the per-product OG "deal card" as the photo and attaches the
 * affiliate link (sub-id = "telegram") as an inline button, so every click
 * from the channel is attributable for commission.
 *
 * Configure via env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, NEXT_PUBLIC_SITE_URL.
 */
export async function postDealsToTelegram(limit = 3) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

  // Safety switch: keep the bot quiet until you flip TELEGRAM_BOT_ENABLED=true
  // (turn it on only AFTER the Shopee campaign is approved so links work).
  if (process.env.TELEGRAM_BOT_ENABLED !== "true") {
    return { ok: false, reason: "bot_disabled", posted: 0 };
  }

  if (!token || !chatId) {
    return { ok: false, reason: "missing_config", posted: 0 };
  }

  const deals = (await getRealDeals()).slice(0, limit);
  const results: unknown[] = [];

  for (const { product, realDiscount } of deals) {
    const drop = Math.round(realDiscount * 100);
    const buyUrl = product.affLink ?? shopee.affiliateLink(product, "telegram");
    const productUrl = `${site}/san-pham/${product.id}`;
    const photo = `${site}/san-pham/${product.id}/opengraph-image`;

    const caption =
      `✅ <b>DEAL THẬT</b>\n` +
      `${escapeHtml(product.name)}\n` +
      `💰 <b>${vnd(product.currentPrice)}</b>` +
      (product.listedPrice > product.currentPrice ? ` <s>${vnd(product.listedPrice)}</s>` : "") +
      `\n📉 Rẻ hơn thật ${drop}% so với giá thường ngày` +
      `\n\n#GiaThat #SanDeal #Shopee`;

    const keyboard = {
      inline_keyboard: [
        [{ text: "🛒 Mua ngay trên Shopee", url: buyUrl }],
        [{ text: "📊 Xem lịch sử giá", url: productUrl }],
      ],
    };

    // Prefer a rich photo post; fall back to text if Telegram can't fetch it.
    let res = await tg(token, "sendPhoto", {
      chat_id: chatId,
      photo,
      caption,
      parse_mode: "HTML",
      reply_markup: keyboard,
    });

    if (!res?.ok) {
      res = await tg(token, "sendMessage", {
        chat_id: chatId,
        text: `${caption}\n${productUrl}`,
        parse_mode: "HTML",
        reply_markup: keyboard,
        disable_web_page_preview: false,
      });
    }
    results.push(res);
  }

  return { ok: true, posted: deals.length, results };
}

async function tg(token: string, method: string, body: unknown) {
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return (await r.json()) as { ok?: boolean; description?: string };
  } catch (e) {
    return { ok: false, description: String(e) };
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
