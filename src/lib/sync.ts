import { fetchDatafeed, type DatafeedItem } from "./accesstrade";
import { ensureSchema, getSql } from "./db";

/**
 * Pull products from the AccessTrade datafeed and CURATE to the beauty niche
 * (the generic Shopee feed has no category labels, so we niche by name keyword).
 * Stores curated products + a daily price snapshot, and drops anything no longer
 * curated so the catalog stays clean and cohesive.
 */

const MIN_PRICE = 25_000;
const MAX_PRICE = 5_000_000;
const KEEP = 60;
const MAX_PAGES = 6;

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

// Beauty & personal-care keywords (matched against the accent-stripped name).
const BEAUTY_RE =
  /kem chong nang|kem duong|kem nen|kem mat|kem body|kem tay|kem tri|sua rua mat|sua tam|tay trang|tay te bao|serum|tinh chat|toner|nuoc hoa hong|mat na|son moi|son li|son kem|son tint|son duong|son thoi|son bong|phan phu|phan nuoc|phan ma|cushion|che khuyet diem|ke may|chi may|mascara|nuoc hoa|duong the|duong da|duong moi|duong toc|dau goi|tri mun|collagen|retinol|niacinamide|vitamin c|my pham|skincare|lam dep|xit khoang|se khit|cap am|nam da|tan nhang|gel rua|bb cream|cc cream|foundation|concealer|highlight|cleanser|moisturizer|lipstick|skin|beauty/;

function curate(items: DatafeedItem[]) {
  const seen = new Set<string>();
  return items
    .filter((it) => {
      const id = String(it.product_id || it.sku || "");
      if (!id || seen.has(id)) return false;
      if (!it.image || !it.name) return false;
      if (it.price < MIN_PRICE || it.price > MAX_PRICE) return false;
      if (!BEAUTY_RE.test(norm(it.name))) return false; // niche filter
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
        category: "Làm đẹp",
        shop: it.domain ?? "Shopee",
        discount_rate: rate,
      };
    })
    .sort((a, b) => (b.discount_rate ?? 0) - (a.discount_rate ?? 0))
    .slice(0, KEEP);
}

export async function syncDatafeed(): Promise<{ synced: number; total: number; scanned: number }> {
  await ensureSchema();
  const sql = getSql();

  // fetch several pages so we have enough niche products to curate from
  const collected: DatafeedItem[] = [];
  let total = 0;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetchDatafeed({ limit: 200, page, onlyDiscounted: true });
    total = res.total;
    if (!res.items.length) break;
    collected.push(...res.items);
    if (curate(collected).length >= KEEP) break; // enough niche items
  }

  const rows = curate(collected);
  if (rows.length === 0) return { synced: 0, total, scanned: collected.length };

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

  await sql`DELETE FROM products WHERE updated_at < now() - interval '1 hour'`;
  await sql`DELETE FROM price_snapshots WHERE product_id NOT IN (SELECT id FROM products)`;

  return { synced: rows.length, total, scanned: collected.length };
}
