import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/repository";
import { computeStats, getVerdict, genuineDiscountPct, pct } from "@/lib/pricing";
import { shopee } from "@/lib/shopee/provider";
import { vnd, compact } from "@/lib/format";
import { CATEGORY_VISUAL } from "@/lib/category";
import { PriceChart } from "@/components/PriceChart";
import { VerdictBadge } from "@/components/VerdictBadge";
import { AlertForm } from "@/components/AlertForm";
import { ProductImage } from "@/components/ProductImage";
import { ShareButtons } from "@/components/ShareButtons";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);
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
  REAL_DEAL: "border-emerald-500/30 bg-emerald-500/10",
  GOOD: "border-sky-500/30 bg-sky-500/10",
  NORMAL: "border-white/10 bg-white/[0.04]",
  FAKE: "border-rose-500/30 bg-rose-500/10",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const stats = computeStats(product);
  const verdict = getVerdict(stats);
  const real = genuineDiscountPct(stats);
  const c = CATEGORY_VISUAL[product.category];
  const buyUrl = shopee.affiliateLink(product, "product-page");
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
    <div className="mx-auto max-w-5xl px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-4 text-sm text-slate-400">
        <Link href="/" className="hover:text-[#8b5cf6]">Trang chủ</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-500">{product.category}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
              <ProductImage
                src={product.image}
                alt={product.name}
                emoji={c.emoji}
                gradient={`${c.from} ${c.to}`}
              />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{product.name}</h1>
              <p className="mt-1 text-sm text-slate-400">{product.shop}</p>
              <p className="mt-1 text-xs text-slate-400">
                ⭐ {product.rating.toFixed(1)} · Đã bán {compact(product.sold)}
              </p>
            </div>
          </div>

          {/* Verdict banner */}
          <div className={`rounded-xl border p-4 ${VERDICT_BANNER[verdict.kind]}`}>
            <div className="flex items-center gap-2">
              <VerdictBadge kind={verdict.kind} label={verdict.label} size="lg" />
            </div>
            <p className="mt-2 text-sm text-slate-300">{verdict.reason}</p>
          </div>

          {/* Price chart */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-300">
              Lịch sử giá {stats.days} ngày
            </h2>
            <PriceChart history={product.history} current={product.currentPrice} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Thấp nhất" value={vnd(stats.min)} accent="text-emerald-400" />
            <Stat label="Trung bình" value={vnd(stats.typical)} />
            <Stat label="Cao nhất" value={vnd(stats.max)} accent="text-rose-400" />
          </div>
        </div>

        {/* Sidebar: buy + alert */}
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            {/* conversion ribbon (honest, data-driven) */}
            {stats.isLowest && (
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 text-center text-xs font-bold text-white">
                🔥 GIÁ THẤP NHẤT {stats.days} NGÀY
              </div>
            )}
            <div className="p-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#a78bfa]">{vnd(product.currentPrice)}</span>
              </div>
              {product.listedPrice > product.currentPrice && (
                <p className="mt-1 text-sm text-slate-500">
                  <span className="line-through">{vnd(product.listedPrice)}</span>{" "}
                  <span className="text-rose-400">(shop ghi -{pct(stats.claimedDiscount)})</span>
                </p>
              )}
              <p className="mt-2 text-sm">
                {real > 0 ? (
                  <span className="font-semibold text-emerald-400">
                    Rẻ hơn thật {real}% so với giá thường ngày
                  </span>
                ) : (
                  <span className="font-semibold text-rose-400">
                    Không rẻ hơn giá thường ngày — cẩn thận giảm ảo
                  </span>
                )}
              </p>
              {savings > 0 && (
                <p className="mt-1 text-sm font-semibold text-slate-200">
                  💰 Tiết kiệm {vnd(savings)} so với giá thường ngày
                </p>
              )}

              <a
                href={buyUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="mt-4 block rounded-lg bg-[#8b5cf6] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#7c3aed]"
              >
                Mua trên Shopee →
              </a>
              <p className="mt-2 text-center text-[11px] text-slate-400">
                Liên kết tiếp thị · bạn không trả thêm phí · Dữ liệu giá cập nhật mỗi ngày
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <ShareButtons url={productUrl} title={`${product.name} — ${vnd(product.currentPrice)} (${verdict.label})`} />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <AlertForm productId={product.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, accent = "text-white" }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3 text-center">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-bold ${accent}`}>{value}</p>
    </div>
  );
}
