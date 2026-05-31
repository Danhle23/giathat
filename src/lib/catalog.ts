import { cache } from "react";
import type { Product } from "./types";
import { PRODUCTS } from "./seed";
import { computeStats, getVerdict } from "./pricing";
import { getSql, isDbConfigured } from "./db";
import { normalize } from "./text";

/**
 * Catalog data layer. Reads real products from Postgres when available,
 * and falls back to the mock seed on any error / empty DB — so the site
 * never breaks even if the DB is down or not yet synced.
 */

interface ProductRow {
  id: string;
  name: string;
  image: string | null;
  url: string | null;
  aff_link: string | null;
  listed_price: number;
  current_price: number;
  category: string | null;
  shop: string | null;
  discount_rate: number | null;
}

interface SnapRow {
  product_id: string;
  price: number;
  captured_on: string | Date;
}

function isoDate(d: string | Date): string {
  return (typeof d === "string" ? new Date(d) : d).toISOString().slice(0, 10);
}

function mapRow(r: ProductRow, snaps: SnapRow[]): Product {
  const history = snaps
    .map((s) => ({ date: isoDate(s.captured_on), price: s.price }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  return {
    id: r.id,
    itemId: 0,
    shopId: 0,
    name: r.name,
    category: r.category || "Khác",
    shop: r.shop || "Shopee",
    url: r.url || "",
    image: r.image || "",
    affLink: r.aff_link || undefined,
    listedPrice: r.listed_price,
    currentPrice: r.current_price,
    rating: 0,
    sold: 0,
    history: history.length ? history : [{ date: isoDate(new Date()), price: r.current_price }],
  };
}


async function loadFromDb(): Promise<Product[] | null> {
  if (!isDbConfigured()) return null;
  try {
    const sql = getSql();
    const rows = await sql<ProductRow[]>`
      SELECT id, name, image, url, aff_link, listed_price, current_price, category, shop, discount_rate
      FROM products ORDER BY updated_at DESC LIMIT 120
    `;
    if (!rows.length) return null;
    const ids = rows.map((r) => r.id);
    const snaps = await sql<SnapRow[]>`
      SELECT product_id, price, captured_on FROM price_snapshots
      WHERE product_id IN ${sql(ids)} ORDER BY captured_on ASC
    `;
    const byId = new Map<string, SnapRow[]>();
    for (const s of snaps) {
      const arr = byId.get(s.product_id);
      if (arr) arr.push(s);
      else byId.set(s.product_id, [s]);
    }
    return rows.map((r) => mapRow(r, byId.get(r.id) ?? []));
  } catch (e) {
    console.error("[catalog] DB read failed, using mock:", e);
    return null;
  }
}

// Memoized per server request (dedupes the many catalog reads from
// layout/home/ticker into one DB query) — fresh across requests, so a sync
// is reflected immediately with no stale 5-minute window.
export const getCatalog = cache(async (): Promise<Product[]> => {
  const db = await loadFromDb();
  return db ?? PRODUCTS;
});

export async function getAllProducts(): Promise<Product[]> {
  return getCatalog();
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const found = (await getCatalog()).find((p) => p.id === id);
  if (found) return found;
  // direct lookup for products outside the cached window
  if (!isDbConfigured()) return undefined;
  try {
    const sql = getSql();
    const [row] = await sql<ProductRow[]>`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
    if (!row) return undefined;
    const snaps = await sql<SnapRow[]>`SELECT product_id, price, captured_on FROM price_snapshots WHERE product_id = ${id}`;
    return mapRow(row, snaps);
  } catch {
    return undefined;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const all = await getCatalog();
  const q = normalize(query);
  if (!q) return all;
  return all.filter((p) => normalize(p.name).includes(q) || normalize(p.shop).includes(q));
}

export interface RankedProduct {
  product: Product;
  verdictKind: ReturnType<typeof getVerdict>["kind"];
  realDiscount: number;
}

export async function getRealDeals(): Promise<RankedProduct[]> {
  const all = await getCatalog();
  return all
    .map((product) => {
      const stats = computeStats(product);
      return { product, verdictKind: getVerdict(stats).kind, realDiscount: stats.realDiscount };
    })
    .filter((r) => r.verdictKind === "REAL_DEAL" || r.verdictKind === "GOOD")
    .sort((a, b) => b.realDiscount - a.realDiscount);
}

export async function getFakeDeals(): Promise<Product[]> {
  const all = await getCatalog();
  return all.filter((p) => getVerdict(computeStats(p)).kind === "FAKE");
}
