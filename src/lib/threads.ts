import { getRealDeals } from "./catalog";
import { shopee } from "./shopee/provider";
import { vnd } from "./format";

/**
 * Posts today's genuine deals to Threads (Meta) via the official Threads
 * Graph API. Mirrors the Telegram bot: one image post per deal, using the
 * per-product OG "deal card" as the image and the affiliate link (sub-id =
 * "threads") in the text so clicks are attributable for commission.
 *
 * Publishing is a 2-step flow per Meta docs:
 *   1) POST /{user-id}/threads        -> create a media container (returns id)
 *   2) POST /{user-id}/threads_publish -> publish that container
 *
 * Configure via env:
 *   THREADS_ENABLED=true        (safety switch, default off)
 *   THREADS_USER_ID=<id>        (your Threads account id)
 *   THREADS_TOKEN=<long-lived>  (access token w/ threads_content_publish)
 *   NEXT_PUBLIC_SITE_URL=<https://giathat.vercel.app>
 *
 * Notes:
 * - image_url must be a PUBLIC url (our OG image route works).
 * - Meta recommends a short delay between create and publish so the image is
 *   fetched server-side; we wait ~3s.
 */

const GRAPH = "https://graph.threads.net/v1.0";

export async function postDealsToThreads(limit = 3) {
  // Threads Graph API accepts the alias "me" for the authenticated user, so a
  // token alone is enough; THREADS_USER_ID is an optional override.
  const userId = process.env.THREADS_USER_ID || "me";
  const token = process.env.THREADS_TOKEN;
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

  // Safety switch: stay quiet until THREADS_ENABLED=true (flip on only AFTER
  // the Shopee campaign is approved so the buy links actually work).
  if (process.env.THREADS_ENABLED !== "true") {
    return { ok: false, reason: "disabled", posted: 0 };
  }
  if (!token) {
    return { ok: false, reason: "missing_config", posted: 0 };
  }

  const deals = (await getRealDeals()).slice(0, limit);
  const results: unknown[] = [];

  for (const { product, realDiscount } of deals) {
    const drop = Math.round(realDiscount * 100);
    const buyUrl = product.affLink ?? shopee.affiliateLink(product, "threads");
    const productUrl = `${site}/san-pham/${product.id}`;
    const imageUrl = `${site}/san-pham/${product.id}/opengraph-image`;

    const text =
      `✅ DEAL THẬT — ${product.name}\n` +
      `💰 ${vnd(product.currentPrice)}` +
      (product.listedPrice > product.currentPrice ? ` (giá thường ${vnd(product.listedPrice)})` : "") +
      `\n📉 Rẻ hơn thật ${drop}% so với giá thường ngày\n` +
      `\n🛒 Mua: ${buyUrl}` +
      `\n📊 Lịch sử giá: ${productUrl}` +
      `\n\n#GiaThat #SanDeal #Shopee #LamDep`;

    const res = await publishImagePost(userId, token, imageUrl, text);
    results.push(res);
  }

  return { ok: true, posted: deals.length, results };
}

/** Publish a single text post (no image) to Threads. */
export async function publishTextPost(text: string) {
  const userId = process.env.THREADS_USER_ID || "me";
  const token = process.env.THREADS_TOKEN;
  if (process.env.THREADS_ENABLED !== "true") return { ok: false, reason: "disabled" };
  if (!token) return { ok: false, reason: "missing_config" };

  const creation = await graph(`${GRAPH}/${userId}/threads`, {
    media_type: "TEXT",
    text,
    access_token: token,
  });
  if (!creation?.id) return { ok: false, step: "create", error: creation };
  return publishContainer(userId, token, creation.id);
}

/**
 * Manual, secret-gated TEST post. Ignores THREADS_ENABLED on purpose so we can
 * verify the token works before the daily job is switched on. Posts a single
 * safe intro thread that links ONLY to the site homepage (which works) — never
 * an affiliate link (those still 404 until the campaign is approved).
 */
export async function postTestThread(custom?: string) {
  const userId = process.env.THREADS_USER_ID || "me";
  const token = process.env.THREADS_TOKEN;
  if (!token) return { ok: false, reason: "missing_config" };

  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://giathat.vercel.app").replace(/\/$/, "");
  const text =
    custom ??
    `🔎 Soi Giá — tra lịch sử giá mỹ phẩm Shopee, bắt "giảm giá ảo" trước khi mua.\n` +
      `Xem giá thật từng ngày để biết deal nào xịn, deal nào ảo.\n` +
      `👉 ${site}\n\n#GiaThat #SanDeal #Shopee #LamDep`;

  const creation = await graph(`${GRAPH}/${userId}/threads`, {
    media_type: "TEXT",
    text,
    access_token: token,
  });
  if (!creation?.id) return { ok: false, step: "create", error: creation };
  const res = await publishContainer(userId, token, creation.id);
  return { ...res, text };
}

async function publishImagePost(userId: string, token: string, imageUrl: string, text: string) {
  // 1) create container
  const creation = await graph(`${GRAPH}/${userId}/threads`, {
    media_type: "IMAGE",
    image_url: imageUrl,
    text,
    access_token: token,
  });
  if (!creation?.id) {
    // fall back to a text-only post if the image can't be used
    const textCreation = await graph(`${GRAPH}/${userId}/threads`, {
      media_type: "TEXT",
      text,
      access_token: token,
    });
    if (!textCreation?.id) return { ok: false, step: "create", error: creation };
    return publishContainer(userId, token, textCreation.id);
  }

  // 2) give Meta a moment to fetch the image, then publish
  await sleep(3000);
  return publishContainer(userId, token, creation.id);
}

async function publishContainer(userId: string, token: string, creationId: string) {
  const res = await graph(`${GRAPH}/${userId}/threads_publish`, {
    creation_id: creationId,
    access_token: token,
  });
  return res?.id ? { ok: true, id: res.id } : { ok: false, step: "publish", error: res };
}

/**
 * Refresh a long-lived Threads token (valid ~60 days). Call periodically
 * (e.g. monthly cron) so the token never expires. Returns the new token —
 * you still need to persist it back into THREADS_TOKEN (Vercel env).
 */
export async function refreshThreadsToken(): Promise<string | null> {
  const token = process.env.THREADS_TOKEN;
  if (!token) return null;
  const url =
    `${GRAPH}/refresh_access_token?grant_type=th_refresh_token&access_token=${encodeURIComponent(token)}`;
  try {
    const r = await fetch(url);
    const j = (await r.json()) as { access_token?: string };
    return j.access_token ?? null;
  } catch {
    return null;
  }
}

async function graph(url: string, params: Record<string, string>) {
  try {
    const body = new URLSearchParams(params);
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return (await r.json()) as { id?: string; error?: unknown };
  } catch (e) {
    return { error: String(e) };
  }
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
