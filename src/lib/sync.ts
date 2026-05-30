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

  const rows = items
    .filter((it) => (it.product_id || it.sku) && (it.discount > 0 || it.price > 0))
    .map((it) => {
      const listed = Math.round(it.price || 0);
      const current = Math.round(it.discount && it.discount > 0 ? it.discount : it.price || 0);
      return {
        id: String(it.product_id || it.sku),
        name: it.name,
        image: it.image ?? null,
        url: it.url ?? null,
        aff_link: it.aff_link ?? null,
        listed_price: listed,
        current_price: current,
        category: it.cate ?? null,
        shop: it.domain ?? "Shopee",
        discount_rate: it.discount_rate ?? null,
      };
    })
    .filter((r) => r.current_price > 0);

  if (rows.length === 0) return { synced: 0, total };

  // bulk upsert products (single statement)
  await sql`
    INSERT INTO products ${sql(rows, "id", "name", "image", "url", "aff_link", "listed_price", "current_price", "category", "shop", "discount_rate")}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, image = EXCLUDED.image, url = EXCLUDED.url, aff_link = EXCLUDED.aff_link,
      listed_price = EXCLUDED.listed_price, current_price = EXCLUDED.current_price,
      category = EXCLUDED.category, shop = EXCLUDED.shop, discount_rate = EXCLUDED.discount_rate,
      updated_at = now()
  `;

  // bulk insert today's snapshots (single statement)
  const snaps = rows.map((r) => ({ product_id: r.id, price: r.current_price, captured_on: today }));
  await sql`
    INSERT INTO price_snapshots ${sql(snaps, "product_id", "price", "captured_on")}
    ON CONFLICT (product_id, captured_on) DO NOTHING
  `;

  return { synced: rows.length, total };
}
