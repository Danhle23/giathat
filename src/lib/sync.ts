import { fetchDatafeed, type DatafeedItem } from "./accesstrade";
import { ensureSchema, getSql } from "./db";

/**
 * Pull products from the AccessTrade datafeed, CURATE them (drop junk / cheap
 * accessories, prefer items with a real discount + a usable image), and store:
 *  - upsert into `products`
 *  - append one `price_snapshots` row per product per day (builds history)
 *  - drop products no longer in the curated set (keeps the catalog clean)
 *
 * Run daily via /api/cron/sync.
 */

const MIN_PRICE = 80_000; // cut cheap junk/accessories
const MAX_PRICE = 30_000_000;
const KEEP = 60; // curated catalog size

// crude junk filter for the generic Shopee feed (parts/accessories/etc.)
const JUNK_RE =
  /bu l[oô]ng|[oố]c v[ií]t|ph[uụ] t[uù]ng|l[oò]ng chim|kh[oó]a [dđ]i[eệ]n|d[aâ]y [dđ]ai|gi[aá] [dđ]?[oỡ]|c[uủ] [dđ][eề]|s[eê]n x[ee]|nh[oô]ng|b[aá]nh r[aă]ng|t[ee]m xe|[oố]p|m[oó]c kh[oó]a/i;

function curate(items: DatafeedItem[]) {
  const seen = new Set<string>();
  return items
    .filter((it) => {
      const id = String(it.product_id || it.sku || "");
      if (!id || seen.has(id)) return false;
      if (!it.image || !it.name) return false;
      if (it.price < MIN_PRICE || it.price > MAX_PRICE) return false;
      if (JUNK_RE.test(it.name)) return false;
      seen.add(id);
      return true;
    })
    .map((it) => {
      const listed = Math.round(it.price);
      const onSale = it.discount && it.discount > 0 && it.discount < it.price;
      const current = Math.round(onSale ? it.discount : it.price);
      const rate =
        it.discount_rate && it.discount_rate > 0
          ? Math.round(it.discount_rate)
          : listed > current
            ? Math.round(((listed - current) / listed) * 100)
            : 0;
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
        discount_rate: rate,
      };
    })
    .sort((a, b) => (b.discount_rate ?? 0) - (a.discount_rate ?? 0)) // best discounts first
    .slice(0, KEEP);
}

export async function syncDatafeed(): Promise<{ synced: number; total: number }> {
  await ensureSchema();
  const sql = getSql();

  // fetch a big batch to curate from
  const { items, total } = await fetchDatafeed({ limit: 200, onlyDiscounted: true });
  const rows = curate(items);
  if (rows.length === 0) return { synced: 0, total };

  const today = new Date().toISOString().slice(0, 10);

  await sql`
    INSERT INTO products ${sql(rows, "id", "name", "image", "url", "aff_link", "listed_price", "current_price", "category", "shop", "discount_rate")}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name, image = EXCLUDED.image, url = EXCLUDED.url, aff_link = EXCLUDED.aff_link,
      listed_price = EXCLUDED.listed_price, current_price = EXCLUDED.current_price,
      category = EXCLUDED.category, shop = EXCLUDED.shop, discount_rate = EXCLUDED.discount_rate,
      updated_at = now()
  `;

  const snaps = rows.map((r) => ({ product_id: r.id, price: r.current_price, captured_on: today }));
  await sql`
    INSERT INTO price_snapshots ${sql(snaps, "product_id", "price", "captured_on")}
    ON CONFLICT (product_id, captured_on) DO NOTHING
  `;

  // keep catalog clean: drop products not refreshed in this sync (stale/uncurated)
  await sql`DELETE FROM products WHERE updated_at < now() - interval '1 hour'`;
  await sql`DELETE FROM price_snapshots WHERE product_id NOT IN (SELECT id FROM products)`;

  return { synced: rows.length, total };
}
