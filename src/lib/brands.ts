import type { Product } from "./types";
import { normalize } from "./text";

/**
 * Curated beauty brands for programmatic SEO landing pages
 * (/thuong-hieu/[slug]). `keyword` is a diacritic-insensitive substring matched
 * against product name/shop — the SAME matching `searchProducts` uses, so a
 * brand page can simply call `searchProducts(brand.keyword)`.
 *
 * To avoid thin/empty pages we never link or sitemap a brand that has zero
 * matching products (see `getBrandsInCatalog`); the page itself also marks
 * empty results as noindex defensively.
 */
export interface BrandDef {
  slug: string;
  name: string;
  /** Lowercase, diacritic-free substring used to match products. */
  keyword: string;
}

export const BRANDS: BrandDef[] = [
  { slug: "cerave", name: "CeraVe", keyword: "cerave" },
  { slug: "la-roche-posay", name: "La Roche-Posay", keyword: "la roche" },
  { slug: "the-ordinary", name: "The Ordinary", keyword: "ordinary" },
  { slug: "paulas-choice", name: "Paula's Choice", keyword: "paula" },
  { slug: "anessa", name: "Anessa", keyword: "anessa" },
  { slug: "hada-labo", name: "Hada Labo", keyword: "hada labo" },
  { slug: "senka", name: "Senka", keyword: "senka" },
  { slug: "cetaphil", name: "Cetaphil", keyword: "cetaphil" },
  { slug: "bioderma", name: "Bioderma", keyword: "bioderma" },
  { slug: "vichy", name: "Vichy", keyword: "vichy" },
  { slug: "nivea", name: "Nivea", keyword: "nivea" },
  { slug: "garnier", name: "Garnier", keyword: "garnier" },
  { slug: "loreal", name: "L'Oréal", keyword: "oreal" },
  { slug: "cocoon", name: "Cocoon", keyword: "cocoon" },
  { slug: "some-by-mi", name: "Some By Mi", keyword: "some by mi" },
  { slug: "skin1004", name: "SKIN1004", keyword: "skin1004" },
  { slug: "klairs", name: "Klairs", keyword: "klairs" },
  { slug: "innisfree", name: "Innisfree", keyword: "innisfree" },
  { slug: "maybelline", name: "Maybelline", keyword: "maybelline" },
  { slug: "3ce", name: "3CE", keyword: "3ce" },
  { slug: "romand", name: "Romand", keyword: "romand" },
  { slug: "merzy", name: "Merzy", keyword: "merzy" },
  { slug: "bbia", name: "Bbia", keyword: "bbia" },
  { slug: "dior", name: "Dior", keyword: "dior" },
  { slug: "chanel", name: "Chanel", keyword: "chanel" },
];

export function getBrand(slug: string): BrandDef | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function brandMatches(product: Product, brand: BrandDef): boolean {
  const k = normalize(brand.keyword);
  return normalize(product.name).includes(k) || normalize(product.shop).includes(k);
}

export interface BrandHit {
  brand: BrandDef;
  count: number;
}

/** Brands that actually have ≥1 product in the given catalog, busiest first. */
export function getBrandsInCatalog(products: Product[]): BrandHit[] {
  return BRANDS.map((brand) => ({
    brand,
    count: products.filter((p) => brandMatches(p, brand)).length,
  }))
    .filter((x) => x.count > 0)
    .sort((a, b) => b.count - a.count);
}
