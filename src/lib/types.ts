// Core domain types for Soi Giá (giathat)

export type Category =
  | "Điện tử"
  | "Gia dụng"
  | "Thời trang"
  | "Làm đẹp"
  | "Mẹ & Bé"
  | "Sức khỏe";

/** A single point in a product's price history. */
export interface PriceSnapshot {
  /** ISO date string, e.g. "2026-05-29" */
  date: string;
  /** Selling price (VND) recorded on that date */
  price: number;
}

export interface Product {
  /** URL-friendly slug used as the public id */
  id: string;
  /** Shopee item id (mock now, real later) */
  itemId: number;
  /** Shopee shop id */
  shopId: number;
  name: string;
  /** Free-form category (mock uses the Category enum values; real data is a slug). */
  category: string;
  /** Shop / brand display name */
  shop: string;
  /** Original Shopee product URL */
  url: string;
  /** Product image URL (keyword stock now, real Shopee CDN later) */
  image: string;
  /** Ready affiliate link (from datafeed). When set, used as the buy link. */
  affLink?: string;
  /** Price the seller currently shows with a strike-through (giá niêm yết) */
  listedPrice: number;
  /** Price the customer actually pays right now */
  currentPrice: number;
  /** Rating 0-5 */
  rating: number;
  /** Number of items sold (for social proof) */
  sold: number;
  /** Daily-ish price history, oldest first */
  history: PriceSnapshot[];
}

export type VerdictKind = "REAL_DEAL" | "GOOD" | "NORMAL" | "FAKE";

export interface PriceStats {
  current: number;
  /** Lowest price seen in the tracked window */
  min: number;
  /** Highest price seen in the tracked window */
  max: number;
  /** Typical price (average over the window) */
  typical: number;
  /** Discount the seller claims vs its strike-through price (0..1) */
  claimedDiscount: number;
  /** Real discount vs the typical historical price (can be negative) */
  realDiscount: number;
  /** Whether the current price is the lowest in the window */
  isLowest: boolean;
  /** Number of days of history available */
  days: number;
}

export interface Verdict {
  kind: VerdictKind;
  /** Short label, e.g. "Deal thật" */
  label: string;
  /** One-line explanation for the user */
  reason: string;
}

/** Email price-drop alert subscription. */
export interface Alert {
  id: string;
  productId: string;
  email: string;
  /** Notify when price drops to/below this (VND). 0 = any drop. */
  targetPrice: number;
  createdAt: string;
}
