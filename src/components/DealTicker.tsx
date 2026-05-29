import Link from "next/link";
import { getAllProducts } from "@/lib/repository";
import { computeStats, getVerdict, genuineDiscountPct } from "@/lib/pricing";
import { vnd } from "@/lib/format";

/** Stock-ticker style scrolling band of live deals. */
export function DealTicker() {
  const items = getAllProducts().map((p) => {
    const stats = computeStats(p);
    return {
      id: p.id,
      name: p.name,
      price: p.currentPrice,
      drop: genuineDiscountPct(stats),
      fake: getVerdict(stats).kind === "FAKE",
    };
  });
  const row = [...items, ...items]; // duplicated for a seamless loop

  return (
    <div className="marquee-pause overflow-hidden border-y border-slate-200/70 bg-white/60 backdrop-blur">
      <div className="flex w-max animate-marquee items-center gap-7 py-2.5">
        {row.map((it, idx) => (
          <Link
            key={idx}
            href={`/san-pham/${it.id}`}
            className="flex items-center gap-2 whitespace-nowrap text-sm transition hover:opacity-100"
          >
            <span className="font-medium text-slate-700">{it.name}</span>
            <span className="font-semibold text-[#ee4d2d]">{vnd(it.price)}</span>
            {it.fake ? (
              <span className="font-semibold text-rose-500">⚠ giảm ảo</span>
            ) : it.drop > 0 ? (
              <span className="font-semibold text-emerald-600">▼ {it.drop}%</span>
            ) : (
              <span className="text-slate-400">— ổn định</span>
            )}
            <span className="text-slate-300">•</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
