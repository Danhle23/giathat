import type { Alert, Product } from "./types";
import { PRODUCTS } from "./seed";
import { computeStats, getVerdict } from "./pricing";

/**
 * In-memory repository for the MVP. The interface below is what a real
 * Postgres-backed implementation (see prisma/schema.prisma) must satisfy,
 * so swapping the storage layer later does not touch the UI.
 *
 * NOTE: alerts/tracked URLs live in module memory and reset on restart —
 * that's fine for the demo. Persisting them is the first job of the
 * Postgres implementation.
 */

const alerts: Alert[] = [];
const trackedUrls = new Set<string>();

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = normalize(query);
  if (!q) return PRODUCTS;
  return PRODUCTS.filter(
    (p) =>
      normalize(p.name).includes(q) ||
      normalize(p.shop).includes(q) ||
      normalize(p.category).includes(q),
  );
}

export interface RankedProduct {
  product: Product;
  verdictKind: ReturnType<typeof getVerdict>["kind"];
  realDiscount: number;
}

/** Products that are genuinely cheap right now, best deal first. */
export function getRealDeals(): RankedProduct[] {
  return PRODUCTS.map((product) => {
    const stats = computeStats(product);
    return {
      product,
      verdictKind: getVerdict(stats).kind,
      realDiscount: stats.realDiscount,
    };
  })
    .filter((r) => r.verdictKind === "REAL_DEAL" || r.verdictKind === "GOOD")
    .sort((a, b) => b.realDiscount - a.realDiscount);
}

/** Products whose advertised discount is misleading ("giảm giá ảo"). */
export function getFakeDeals(): Product[] {
  return PRODUCTS.filter(
    (p) => getVerdict(computeStats(p)).kind === "FAKE",
  );
}

export function addAlert(input: {
  productId: string;
  email: string;
  targetPrice: number;
}): Alert {
  const alert: Alert = {
    id: `al_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    productId: input.productId,
    email: input.email,
    targetPrice: input.targetPrice,
    createdAt: new Date().toISOString(),
  };
  alerts.push(alert);
  return alert;
}

export function addTrackedUrl(url: string): void {
  trackedUrls.add(url);
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip Vietnamese accents for fuzzy match
    .replace(/đ/g, "d")
    .trim();
}
