import type { Category } from "./types";

export const CATEGORY_VISUAL: Record<
  Category,
  { emoji: string; from: string; to: string }
> = {
  "Điện tử": { emoji: "🎧", from: "from-indigo-100", to: "to-sky-100" },
  "Gia dụng": { emoji: "🍳", from: "from-amber-100", to: "to-orange-100" },
  "Thời trang": { emoji: "👕", from: "from-pink-100", to: "to-rose-100" },
  "Làm đẹp": { emoji: "💄", from: "from-fuchsia-100", to: "to-pink-100" },
  "Mẹ & Bé": { emoji: "🍼", from: "from-teal-100", to: "to-emerald-100" },
  "Sức khỏe": { emoji: "🩺", from: "from-lime-100", to: "to-green-100" },
};
