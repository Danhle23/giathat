import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import { computeStats, getVerdict, genuineDiscountPct, pct } from "@/lib/pricing";
import { shopee } from "@/lib/shopee/provider";
import { vnd, compact } from "@/lib/format";
import { getCategoryVisual } from "@/lib/category";
import { PriceChart } from "@/components/PriceChart";
import { VerdictBadge } from "@/components/VerdictBadge";
import { AlertForm } from "@/components/AlertForm";
import { ProductImage } from "@/components/ProductImage";
import { ShareButtons } from "@/components/ShareButtons";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  const stats = computeStats(product);
  const verdict = getVerdict(stats);
  return {
    title: `Giá ${product.name} — lịch sử giá & ${verdict.label}`,
    description: `${product.name} hiện ${vnd(product.currentPrice)}. ${verdict.reason} Xem lịch sử giá, mức thấp nhất và đặt cảnh báo giảm giá.`,
    alternates: { canonical: `/san-pham/${product.id}` },
  };
}

const VERDICT_BANNER: Record<string, string> = {
  REAL_DEAL: "border-emerald-200 bg-emerald-50",
  GOOD: "border-sky-200 bg-sky-50",
  NORMAL: "border-black/[0.08] bg-[#f5f5f7]",
  FAKE: "border-rose-200 bg-rose-50",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const stats = computeStats(product);
  const verdict = getVerdict(stats);
  const real = genuineDiscountPct(stats);
  const c = getCategoryVisual(product.category);
  const buyUrl = product.affLink ?? shopee.affiliateLink(product, "product-page");
  const productUrl = `${SITE_URL}/san-pham/${product.id}`;
  const savings = Math.max(0, stats.typical - stats.current);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: `${product.name} — lịch sử giá Shopee, ${verdict.label.toLowerCase()}. ${verdict.reason}`,
    brand: { "@type": "Brand", name: product.shop },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.sold,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "VND",
      price: product.currentPrice,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-6 text-[13px] text-[#86868b]">
        <Link href="/" className="hover:text-[#0066cc]">Trang chủ</Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#6e6e73]">{product.category}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex gap-5">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/[0.06] bg-[#f5f5f7]">
              <ProductImage src={product.image} alt={product.name} emoji={c.emoji} gradient="from-[#f5f5f7] to-[#ececef]" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold leading-tight text-[#1d1d1f] sm:text-3xl">{product.name}</h1>
              <p className="mt-1.5 text-[15px] text-[#6e6e73]">{product.shop}</p>
              {(product.rating > 0 || product.sold > 0) && (
                <p className="mt-1 text-[13px] text-[#86868b]">
                  ⭐ {product.rating.toFixed(1)} · Đã bán {compact(product.sold)}
                </p>
              )}
            </div>
          </div>

          {/* Verdict banner */}
          <div className={`rounded-2xl border p-5 ${VERDICT_BANNER[verdict.kind]}`}>
            <VerdictBadge kind={verdict.kind} label={verdict.label} size="lg" />
            <p className="mt-2.5 text-[15px] text-[#1d1d1f]">{verdict.reason}</p>
          </div>

          {/* Price chart */}
          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <h2 className="mb-3 text-[15px] font-semibold text-[#1d1d1f]">Lịch sử giá {stats.days} ngày</h2>
            <PriceChart history={product.history} current={product.currentPrice} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Thấp nhất" value={vnd(stats.min)} accent="text-emerald-600" />
            <Stat label="Trung bình" value={vnd(stats.typical)} />
            <Stat label="Cao nhất" value={vnd(stats.max)} accent="text-rose-600" />
          </div>
        </div>

        {/* Sidebar: buy + alert */}
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white">
            {stats.isLowest && (
              <div className="bg-emerald-600 px-4 py-1.5 text-center text-[12px] font-semibold text-white">
                🔥 GIÁ THẤP NHẤT {stats.days} NGÀY
              </div>
            )}
            <div className="p-5">
              <span className="text-[32px] font-semibold text-[#1d1d1f]">{vnd(product.currentPrice)}</span>
              {product.listedPrice > product.currentPrice && (
                <p className="mt-1 text-[14px] text-[#86868b]">
                  <span className="line-through">{vnd(product.listedPrice)}</span>{" "}
                  <span className="text-rose-600">(shop ghi −{pct(stats.claimedDiscount)})</span>
                </p>
              )}
              <p className="mt-3 text-[14px]">
                {real > 0 ? (
                  <span className="font-semibold text-emerald-600">Rẻ hơn thật {real}% so với giá thường ngày</span>
                ) : (
                  <span className="font-medium text-[#6e6e73]">Đang thu thập lịch sử giá để so sánh</span>
                )}
              </p>
              {savings > 0 && (
                <p className="mt-1 text-[14px] font-semibold text-[#1d1d1f]">
                  Tiết kiệm {vnd(savings)} so với giá thường ngày
                </p>
              )}

              <a
                href={buyUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="mt-5 block rounded-full bg-[#0066cc] px-4 py-3 text-center text-[15px] font-medium text-white transition active:scale-[0.98]"
              >
                Mua trên Shopee
              </a>
              <p className="mt-2.5 text-center text-[11px] text-[#86868b]">
                Liên kết tiếp thị · bạn không trả thêm phí
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <ShareButtons url={productUrl} title={`${product.name} — ${vnd(product.currentPrice)} (${verdict.label})`} />
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <AlertForm productId={product.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = "text-[#1d1d1f]" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white p-4 text-center">
      <p className="text-[12px] text-[#86868b]">{label}</p>
      <p className={`mt-1 text-[14px] font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
