import type { Product } from "./types";
import { vnd } from "./format";
import { normalize } from "./text";

/**
 * Beauty categories for programmatic SEO landing pages (/danh-muc/[slug]).
 * Each slug maps to a Vietnamese keyword fed into `searchProducts` to filter
 * the catalog, plus per-category SEO copy. Single source of truth used by the
 * category page, sitemap, footer and the home-page chip row.
 */
export interface CategoryDef {
  /** URL slug, e.g. "kem-chong-nang" */
  slug: string;
  /** Display label, e.g. "Kem chống nắng" */
  label: string;
  /** Keyword passed to searchProducts() to filter the catalog */
  keyword: string;
  emoji: string;
  /** <title> for generateMetadata */
  title: string;
  /** meta description */
  description: string;
  /** Short intro paragraph under the H1 (keyword-targeted) */
  intro: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    slug: "kem-chong-nang",
    label: "Kem chống nắng",
    keyword: "kem chống nắng",
    emoji: "☀️",
    title: "Giá kem chống nắng Shopee — loại nào đáng mua 2026",
    description:
      "So sánh giá kem chống nắng trên Shopee theo lịch sử giá thật. Biết loại nào đang giảm thật, loại nào giảm ảo trước khi mua.",
    intro:
      "Kem chống nắng là bước skincare quan trọng nhất, nhưng giá trên Shopee đổi liên tục theo từng đợt flash sale. Dưới đây là các loại kem chống nắng đang bán kèm lịch sử giá thật — để bạn biết loại nào đáng mua và đang ở vùng giá tốt, thay vì chỉ tin con số “giảm sốc”.",
  },
  {
    slug: "serum",
    label: "Serum",
    keyword: "serum",
    emoji: "💧",
    title: "Giá serum Shopee — serum nào đáng mua, giá bao nhiêu hợp lý",
    description:
      "Giá serum dưỡng da trên Shopee dao động mạnh. Xem lịch sử giá thật để biết serum nào đáng mua và mức giá nào là hợp lý.",
    intro:
      "Serum là món skincare có biên độ giảm giá lớn nhất — cùng một chai có thể chênh nhau cả trăm nghìn giữa hai shop. Danh sách dưới đây gom các loại serum đang bán cùng lịch sử giá thật, giúp bạn biết serum nào đáng mua và mức giá nào mới thực sự hợp lý.",
  },
  {
    slug: "son",
    label: "Son",
    keyword: "son",
    emoji: "💄",
    title: "Giá son Shopee — son nào đáng mua, soi giá thật trước khi chốt",
    description:
      "So sánh giá son môi trên Shopee bằng lịch sử giá. Tránh bẫy “giảm 50%” ảo, biết son nào đang ở giá thật rẻ nhất.",
    intro:
      "Son là mặt hàng bị gắn mác “giảm sâu” nhiều nhất trên Shopee, dù giá thực tế thường không đổi. Xem các mẫu son đang bán kèm lịch sử giá thật bên dưới để biết cây son nào đáng mua và đang ở mức giá tốt nhất.",
  },
  {
    slug: "sua-rua-mat",
    label: "Sữa rửa mặt",
    keyword: "sữa rửa mặt",
    emoji: "🧼",
    title: "Giá sữa rửa mặt Shopee — loại nào đáng mua, giá thật",
    description:
      "Giá sữa rửa mặt trên Shopee theo lịch sử giá thật. Biết loại nào đang giảm thật và đáng mua cho từng loại da.",
    intro:
      "Sữa rửa mặt là món dùng hằng ngày nên mua đúng giá rất đáng tiền. Bên dưới là các loại sữa rửa mặt đang bán cùng lịch sử giá thật, giúp bạn chọn loại đáng mua và canh đúng lúc giá xuống thật sự.",
  },
  {
    slug: "mat-na",
    label: "Mặt nạ",
    keyword: "mặt nạ",
    emoji: "🧖",
    title: "Giá mặt nạ dưỡng da Shopee — loại nào đáng mua",
    description:
      "So sánh giá mặt nạ dưỡng da trên Shopee bằng lịch sử giá thật. Biết loại nào đang giảm thật, loại nào chỉ giảm ảo.",
    intro:
      "Mặt nạ thường được bán theo set và gắn mác giảm giá rất hấp dẫn. Danh sách dưới đây tổng hợp các loại mặt nạ đang bán kèm lịch sử giá thật, để bạn biết set nào đáng mua thay vì mua hớ vì khuyến mãi ảo.",
  },
  {
    slug: "nuoc-hoa",
    label: "Nước hoa",
    keyword: "nước hoa",
    emoji: "🌸",
    title: "Giá nước hoa Shopee — chai nào đáng mua, soi giá thật",
    description:
      "Giá nước hoa trên Shopee biến động mạnh quanh các đợt sale. Xem lịch sử giá thật để biết chai nào đáng mua đúng giá.",
    intro:
      "Nước hoa là mặt hàng giá trị cao nên chênh lệch giá giữa các đợt sale rất đáng kể. Xem các chai nước hoa đang bán cùng lịch sử giá thật bên dưới để chốt đúng thời điểm, tránh mua lúc giá bị đẩy lên cao.",
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** Live price range across a set of products (uses current selling price). */
export interface PriceRange {
  count: number;
  low: number;
  high: number;
}

export function priceRange(products: Product[]): PriceRange | null {
  const prices = products.map((p) => p.currentPrice).filter((n) => n > 0);
  if (!prices.length) return null;
  return { count: products.length, low: Math.min(...prices), high: Math.max(...prices) };
}

/**
 * Infer which SEO category a product belongs to by matching the category
 * keyword against the (diacritic-insensitive) product name. Used for the
 * product-page breadcrumb and "related products" section.
 */
export function inferCategory(product: Product): CategoryDef | undefined {
  const name = normalize(product.name);
  return CATEGORIES.find((c) => name.includes(normalize(c.keyword)));
}

export interface Faq {
  q: string;
  a: string;
}

/** Build keyword-rich FAQ (also emitted as FAQPage JSON-LD) for a category. */
export function categoryFaq(cat: CategoryDef, range: PriceRange | null): Faq[] {
  const label = cat.label.toLowerCase();
  return [
    {
      q: `Giá ${label} trên Shopee khoảng bao nhiêu?`,
      a: range
        ? `Soi Giá đang theo dõi ${range.count} sản phẩm ${label}, mức giá phổ biến từ ${vnd(
            range.low,
          )} đến ${vnd(
            range.high,
          )} tuỳ thương hiệu và dung tích. Quan trọng hơn con số là việc đối chiếu với lịch sử giá của chính sản phẩm đó.`
        : `Giá ${label} trên Shopee dao động khá rộng tuỳ thương hiệu và dung tích. Hãy đối chiếu giá hôm nay với lịch sử giá của chính sản phẩm để biết có đang ở vùng giá tốt hay không.`,
    },
    {
      q: `${cat.label} nào đáng mua?`,
      a: `Loại ${label} đáng mua là loại hợp nhu cầu/loại da của bạn và đang ở vùng giá thấp so với lịch sử giá của nó — không phải loại có % giảm to nhất. Xem lưới sản phẩm bên trên, ưu tiên món gắn nhãn “Deal thật”.`,
    },
    {
      q: `Làm sao biết ${label} giảm giá thật hay giảm ảo?`,
      a: `Đừng tin con số % giảm do shop tự đặt. Soi Giá lưu lịch sử giá theo từng ngày: nếu giá hôm nay chạm vùng thấp nhất là deal thật, còn nếu vẫn bằng giá thường ngày dù treo biển “giảm sốc” thì đó là giảm ảo.`,
    },
  ];
}
