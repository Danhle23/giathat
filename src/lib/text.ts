/**
 * Diacritic-insensitive normalize used for Vietnamese search/matching:
 * lowercases, strips combining marks, maps đ→d. Shared by catalog search,
 * category inference and brand matching so they all behave identically.
 */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .trim();
}
