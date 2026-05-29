/** Format a VND amount, e.g. 790000 -> "790.000₫". */
export function vnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Compact number for social proof, e.g. 18200 -> "18,2k". */
export function compact(n: number): string {
  if (n < 1000) return String(n);
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** "29/05/2026" */
export function viDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
