import type { PriceSnapshot, PriceStats, Product, Verdict } from "./types";

/**
 * The heart of Giá Thật: turn a price history into honest statistics and a
 * verdict that tells the shopper whether a "sale" is real or fake.
 */
export function computeStats(product: Product): PriceStats {
  const prices = product.history.map((h) => h.price);
  const current = product.currentPrice;
  const min = Math.min(...prices, current);
  const max = Math.max(...prices, current);
  const typical = Math.round(
    prices.reduce((a, b) => a + b, 0) / Math.max(prices.length, 1),
  );

  const claimedDiscount =
    product.listedPrice > 0
      ? (product.listedPrice - current) / product.listedPrice
      : 0;

  const realDiscount = typical > 0 ? (typical - current) / typical : 0;

  return {
    current,
    min,
    max,
    typical,
    claimedDiscount,
    realDiscount,
    isLowest: current <= min,
    days: product.history.length,
  };
}

/**
 * Classify the current price.
 *
 * - REAL_DEAL: genuinely cheap — at/near the historical low AND clearly below typical.
 * - GOOD:      cheaper than usual, worth buying.
 * - FAKE:      seller advertises a big discount but the price isn't actually low
 *              vs its own history ("giảm giá ảo").
 * - NORMAL:    roughly the usual price.
 */
export function getVerdict(stats: PriceStats): Verdict {
  const { realDiscount, claimedDiscount, isLowest, current, min } = stats;
  const nearLow = current <= min * 1.03; // within 3% of the lowest ever

  if (realDiscount >= 0.15 && nearLow) {
    return {
      kind: "REAL_DEAL",
      label: "Deal thật",
      reason: isLowest
        ? "Giá thấp nhất từ trước tới nay — nên mua!"
        : "Sát mức thấp nhất lịch sử — deal xịn.",
    };
  }

  if (claimedDiscount >= 0.2 && realDiscount <= 0.03) {
    return {
      kind: "FAKE",
      label: "Giảm giá ảo",
      reason: `Quảng cáo giảm ${pct(claimedDiscount)} nhưng giá này không hề rẻ hơn mức thường ngày.`,
    };
  }

  if (realDiscount >= 0.07) {
    return {
      kind: "GOOD",
      label: "Giá tốt",
      reason: `Rẻ hơn khoảng ${pct(realDiscount)} so với giá thường ngày.`,
    };
  }

  return {
    kind: "NORMAL",
    label: "Giá bình thường",
    reason: "Đang ở mức giá quen thuộc — có thể chờ đợt giảm thật.",
  };
}

/** Percentage of genuine saving vs typical price, clamped at 0 for display. */
export function genuineDiscountPct(stats: PriceStats): number {
  return Math.max(0, Math.round(stats.realDiscount * 100));
}

export function pct(x: number): string {
  return `${Math.round(x * 100)}%`;
}

/** Lowest price within the last N days (defaults to whole window). */
export function lowestInDays(history: PriceSnapshot[], days?: number): number {
  const slice = days ? history.slice(-days) : history;
  return Math.min(...slice.map((h) => h.price));
}
