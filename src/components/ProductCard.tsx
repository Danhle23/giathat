import Link from "next/link";
import type { Product } from "@/lib/types";
import { computeStats, getVerdict, genuineDiscountPct } from "@/lib/pricing";
import { vnd, compact } from "@/lib/format";
import { CATEGORY_VISUAL } from "@/lib/category";
import { VerdictBadge } from "./VerdictBadge";
import { ProductImage } from "./ProductImage";

export function ProductCard({ product }: { product: Product }) {
  const stats = computeStats(product);
  const verdict = getVerdict(stats);
  const real = genuineDiscountPct(stats);
  const c = CATEGORY_VISUAL[product.category];

  return (
    <Link
      href={`/san-pham/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#ee4d2d]/40 hover:shadow-xl hover:shadow-[#ee4d2d]/5"
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
        {real > 0 && (
          <span className="absolute right-2 top-2 z-10 rounded-md bg-[#ee4d2d] px-1.5 py-0.5 text-xs font-bold text-white shadow-sm">
            -{real}% thật
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-slate-800 group-hover:text-[#ee4d2d]">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400">{product.shop}</p>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-[#ee4d2d]">{vnd(product.currentPrice)}</span>
          {product.listedPrice > product.currentPrice && (
            <span className="text-xs text-slate-400 line-through">{vnd(product.listedPrice)}</span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>⭐ {product.rating.toFixed(1)}</span>
          <span>Đã bán {compact(product.sold)}</span>
        </div>
      </div>
    </Link>
  );
}
