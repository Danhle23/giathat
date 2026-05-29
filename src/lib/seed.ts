import type { Category, PriceSnapshot, Product } from "./types";

/**
 * Deterministic mock catalog. Replace this module with the real Shopee
 * adapter (see src/lib/shopee/provider.ts) once API access is granted —
 * everything downstream only depends on the Product[] shape.
 */

const TODAY = new Date("2026-05-29T00:00:00Z");

type Pattern = "real_deal" | "fake" | "good" | "normal";

interface Spec {
  id: string;
  name: string;
  category: Category;
  shop: string;
  base: number; // typical historical price
  pattern: Pattern;
  rating: number;
  sold: number;
}

// Small deterministic PRNG so the catalog (and therefore the deals) is stable.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateNDaysAgo(n: number): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function roundPrice(p: number): number {
  return Math.round(p / 1000) * 1000;
}

/** Build 90 days of history (oldest first) plus today's current/listed price. */
function build(spec: Spec): Product {
  const rng = mulberry32(hash(spec.id));
  const days = 90;
  const history: PriceSnapshot[] = [];

  for (let i = days; i >= 1; i--) {
    const noise = 1 + (rng() - 0.5) * 0.06; // ±3% daily wobble
    let factor = 1;

    if (spec.pattern === "real_deal" && i <= 6) {
      // genuine recent drop in the last week
      factor = 0.8 + (rng() - 0.5) * 0.02;
    } else if (spec.pattern === "good" && i <= 5) {
      factor = 0.89 + (rng() - 0.5) * 0.02;
    }

    history.push({
      date: dateNDaysAgo(i),
      price: roundPrice(spec.base * factor * noise),
    });
  }

  let currentPrice: number;
  let listedPrice: number;

  switch (spec.pattern) {
    case "real_deal":
      currentPrice = roundPrice(spec.base * 0.78);
      listedPrice = roundPrice(spec.base * 1.1);
      break;
    case "good":
      currentPrice = roundPrice(spec.base * 0.88);
      listedPrice = roundPrice(spec.base * 1.05);
      break;
    case "fake":
      // price is basically the usual price, but dressed up with a huge fake markdown
      currentPrice = roundPrice(spec.base * 1.0);
      listedPrice = roundPrice(spec.base * 1.65);
      break;
    default: // normal
      currentPrice = roundPrice(spec.base * 1.0);
      listedPrice = roundPrice(spec.base * 1.03);
  }

  const itemId = hash(spec.id) % 9_000_000_000;
  const shopId = (hash(spec.shop) % 900_000) + 100_000;

  return {
    id: spec.id,
    itemId,
    shopId,
    name: spec.name,
    category: spec.category,
    shop: spec.shop,
    url: `https://shopee.vn/product/${shopId}/${itemId}`,
    listedPrice,
    currentPrice,
    rating: spec.rating,
    sold: spec.sold,
    history,
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SPECS: Spec[] = [
  { id: "tai-nghe-soundcore-r50i", name: "Tai nghe Bluetooth Soundcore R50i", category: "Điện tử", shop: "Anker Official", base: 790000, pattern: "real_deal", rating: 4.9, sold: 18200 },
  { id: "sac-du-phong-anker-20000", name: "Sạc dự phòng Anker 20000mAh PowerCore", category: "Điện tử", shop: "Anker Official", base: 590000, pattern: "fake", rating: 4.8, sold: 9400 },
  { id: "ban-phim-co-akko-3068", name: "Bàn phím cơ Akko 3068B Plus", category: "Điện tử", shop: "Akko Gaming", base: 1190000, pattern: "good", rating: 4.9, sold: 5600 },
  { id: "chuot-logitech-mx-master-3s", name: "Chuột Logitech MX Master 3S", category: "Điện tử", shop: "Logitech VN", base: 2390000, pattern: "fake", rating: 4.9, sold: 7800 },
  { id: "noi-chien-khong-dau-locklock-5l5", name: "Nồi chiên không dầu Lock&Lock 5.5L", category: "Gia dụng", shop: "Lock&Lock Official", base: 1490000, pattern: "fake", rating: 4.7, sold: 12300 },
  { id: "robot-hut-bui-xiaomi-e10", name: "Robot hút bụi lau nhà Xiaomi E10", category: "Gia dụng", shop: "Xiaomi Official", base: 4990000, pattern: "real_deal", rating: 4.8, sold: 3100 },
  { id: "ao-thun-nam-cotton-basic", name: "Áo thun nam cotton 100% form regular", category: "Thời trang", shop: "Coolmate", base: 159000, pattern: "normal", rating: 4.8, sold: 45200 },
  { id: "giay-sneaker-nam-tr-01", name: "Giày sneaker nam thể thao TR-01", category: "Thời trang", shop: "Sport Store VN", base: 450000, pattern: "fake", rating: 4.5, sold: 6700 },
  { id: "serum-vitamin-c-melano", name: "Serum Vitamin C Melano CC 20ml", category: "Làm đẹp", shop: "Hada Labo Official", base: 320000, pattern: "good", rating: 4.9, sold: 21800 },
  { id: "kem-chong-nang-anessa", name: "Kem chống nắng Anessa Gold SPF50+", category: "Làm đẹp", shop: "Anessa Official", base: 520000, pattern: "real_deal", rating: 4.9, sold: 15400 },
  { id: "bim-bobby-size-l", name: "Bỉm tã quần Bobby size L 56 miếng", category: "Mẹ & Bé", shop: "Bobby Official", base: 350000, pattern: "normal", rating: 4.8, sold: 33100 },
  { id: "may-do-huyet-ap-omron-7121", name: "Máy đo huyết áp Omron HEM-7121", category: "Sức khỏe", shop: "Omron Healthcare", base: 890000, pattern: "good", rating: 4.9, sold: 8900 },
];

export const PRODUCTS: Product[] = SPECS.map(build);
