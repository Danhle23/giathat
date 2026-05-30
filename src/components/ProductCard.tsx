import Link from "next/link";
import type { Product } from "@/lib/types";
import { computeStats, getVerdict, genuineDiscountPct } from "@/lib/pricing";
import { vnd } from "@/lib/format";
import { getCategoryVisual } from "@/lib/category";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const stats = computeStats(product);
  const verdict = getVerdict(stats);
  const real = genuineDiscountPct(stats);
  const claimed = Math.round(stats.claimedDiscount * 100);
  const emoji = getCategoryVisual(product.category).emoji;

  return (
    <Link
      href={`/san-pham/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-[18px] border border-black/[0.08] bg-white transition duration-200 hover:border-black/[0.16] active:scale-[0.99]"
    >
      <div className="relative aspect-square bg-[#f5f5f7] p-4">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          <ProductImage
            src={product.image}
            alt={product.name}
            emoji={emoji}
            gradient="from-[#f5f5f7] to-[#ececef]"
          />
        </div>
        {real > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            Deal thật −{real}%
          </span>
        ) : claimed > 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-[#1d1d1f]/80 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
            −{claimed}%
          </span>
        ) : verdict.kind === "FAKE" ? (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            Giảm ảo
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-1">
        <h3 className="line-clamp-2 text-[14px] font-semibold leading-snug text-[#1d1d1f]">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-[17px] font-semibold text-[#1d1d1f]">{vnd(product.currentPrice)}</span>
          {product.listedPrice > product.currentPrice && (
            <span className="text-[12px] text-[#86868b] line-through">{vnd(product.listedPrice)}</span>
          )}
        </div>
        <span className="mt-2 text-[13px] font-medium text-[#0066cc]">Xem giá thật ›</span>
      </div>
    </Link>
  );
}
