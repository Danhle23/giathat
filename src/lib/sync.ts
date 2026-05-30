import { fetchDatafeed } from "./accesstrade";
import { ensureSchema, getSql } from "./db";

/**
 * Pull discounted products from the AccessTrade datafeed and store them:
 *  - upsert into `products` (latest name/price/image/aff_link)
 *  - append one `price_snapshots` row per product per day (builds history)
 *
 * Run daily via /api/cron/sync. Each day adds a price point, so the
 * "giá thật / bóc giảm ảo" history fills in over time.
 */
export async function syncDatafeed(limit = 100): Promise<{ synced: number; total: number }> {
  await ensureSchema();
  const sql = getSql();

  const { items, total } = await fetchDatafeed({ limit, onlyDiscounted: true });
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  let synced = 0;
  for (const it of items) {
    if (!it.product_id && !it.sku) continue;
    const id = String(it.product_id || it.sku);
    const listed = Math.round(it.price || 0);
    const current = Math.round(it.discount && it.discount > 0 ? it.discount : it.price || 0);
    if (current <= 0) continue;

    await sql`
      INSERT INTO products
        (id, name, image, url, aff_link, listed_price, current_price, category, shop, discount_rate, updated_at)
      VALUES
        (${id}, ${it.name}, ${it.image ?? null}, ${it.url ?? null}, ${it.aff_link ?? null},
         ${listed}, ${current}, ${it.cate ?? null}, ${it.domain ?? "Shopee"}, ${it.discount_rate ?? null}, now())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        url = EXCLUDED.url,
        aff_link = EXCLUDED.aff_link,
        listed_price = EXCLUDED.listed_price,
        current_price = EXCLUDED.current_price,
        category = EXCLUDED.category,
        shop = EXCLUDED.shop,
        discount_rate = EXCLUDED.discount_rate,
        updated_at = now()
    `;

    await sql`
      INSERT INTO price_snapshots (product_id, price, captured_on)
      VALUES (${id}, ${current}, ${today})
      ON CONFLICT (product_id, captured_on) DO NOTHING
    `;

    synced += 1;
  }

  return { synced, total };
}
