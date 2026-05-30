import Link from "next/link";
import type { Product } from "@/lib/types";
import { computeStats, getVerdict, genuineDiscountPct } from "@/lib/pricing";
import { vnd, compact } from "@/lib/format";
import { getCategoryVisual } from "@/lib/category";
import { VerdictBadge } from "./VerdictBadge";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const stats = computeStats(product);
  const verdict = getVerdict(stats);
  const real = genuineDiscountPct(stats);
  const c = getCategoryVisual(product.category);

  return (
    <Link
      href={`/san-pham/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition duration-200 hover:-translate-y-1 hover:border-[#8b5cf6]/50 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/40"
    >
      <div className="card-sheen relative h-36 overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          emoji={c.emoji}
          gradient={`${c.from} ${c.to}`}
        />
        <span className="absolute left-2 top-2 z-10">
          <VerdictBadge kind={verdict.kind} label={verdict.label} />
        </span>
        {real > 0 ? (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-[#8b5cf6] px-1.5 py-0.5 text-xs font-bold text-white shadow-sm">
            -{real}% thật
          </span>
        ) : product.listedPrice > product.currentPrice ? (
          <span className="absolute right-2 top-2 z-10 rounded-md border border-white/20 bg-black/50 px-1.5 py-0.5 text-xs font-bold text-white backdrop-blur">
            -{Math.round(stats.claimedDiscount * 100)}%
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-100 group-hover:text-[#a78bfa]">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500">{product.shop}</p>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-[#a78bfa]">{vnd(product.currentPrice)}</span>
          {product.listedPrice > product.currentPrice && (
            <span className="text-xs text-slate-500 line-through">{vnd(product.listedPrice)}</span>
          )}
        </div>

        {(product.rating > 0 || product.sold > 0) && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>⭐ {product.rating.toFixed(1)}</span>
            <span>Đã bán {compact(product.sold)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
