"use client";

import { useEffect, useState } from "react";
import { vnd } from "@/lib/format";
import { ProductImage } from "./ProductImage";

type Demo = {
  emoji: string;
  img: string;
  name: string;
  listed: number;
  current: number;
  kind: "FAKE" | "REAL";
  truth: string;
  spark: number[];
};

const DEMOS: Demo[] = [
  {
    emoji: "🧴",
    img: "https://loremflickr.com/200/200/sunscreen,skincare?lock=22",
    name: "Kem chống nắng Anessa Gold",
    listed: 572000,
    current: 406000,
    kind: "REAL",
    truth: "Thấp nhất 3 tháng — deal thật, nên mua!",
    spark: [520, 515, 525, 510, 518, 512, 470, 406],
  },
  {
    emoji: "💧",
    img: "https://loremflickr.com/200/200/serum,cosmetics?lock=21",
    name: "Serum Vitamin C The Ordinary",
    listed: 390000,
    current: 195000,
    kind: "FAKE",
    truth: "Giá thật thường ~190.000đ — “giảm 50%” chỉ là chiêu.",
    spark: [192, 195, 190, 193, 191, 194, 190, 195],
  },
  {
    emoji: "💄",
    img: "https://loremflickr.com/200/200/lipstick,makeup?lock=24",
    name: "Son kem lì 3CE Velvet",
    listed: 320000,
    current: 249000,
    kind: "REAL",
    truth: "Rẻ hơn 18% so với giá thường ngày.",
    spark: [305, 300, 310, 298, 302, 295, 270, 249],
  },
  {
    emoji: "🧼",
    img: "https://loremflickr.com/200/200/facewash,skincare?lock=27",
    name: "Sữa rửa mặt CeraVe 236ml",
    listed: 410000,
    current: 280000,
    kind: "FAKE",
    truth: "Tháng trước chỉ ~275.000đ — mác “giảm 32%” là ảo.",
    spark: [278, 280, 276, 282, 279, 281, 277, 280],
  },
];

function sparkPath(vals: number[], w = 132, h = 44) {
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  return vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - 4 - ((v - min) / range) * (h - 8);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function DetectorDemo() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % DEMOS.length), 3600);
    return () => clearInterval(t);
  }, []);

  const d = DEMOS[i];
  const advertised = Math.round(((d.listed - d.current) / d.listed) * 100);
  const isFake = d.kind === "FAKE";

  return (
    <div className="relative w-full max-w-sm">
      {/* glow */}
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#8b5cf6]/15 to-violet-300/15 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
        {/* scanning beam — restarts every cycle via key */}
        <div
          key={i}
          className="scan-line pointer-events-none absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent"
          style={{ boxShadow: "0 0 14px 2px rgba(139,92,246,0.55)" }}
        />

        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#8b5cf6]" />
          Đang soi giá…
        </div>

        {/* product */}
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl">
            <ProductImage
              key={d.img}
              src={d.img}
              alt={d.name}
              emoji={d.emoji}
              gradient="from-white/10 to-white/5"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{d.name}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-lg font-extrabold text-[#a78bfa]">{vnd(d.current)}</span>
              <span className="text-xs text-slate-500 line-through">{vnd(d.listed)}</span>
              <span className="rounded bg-rose-500 px-1 py-0.5 text-[10px] font-bold text-white">
                shop ghi -{advertised}%
              </span>
            </div>
          </div>
        </div>

        {/* mini chart */}
        <svg viewBox="0 0 132 44" className="mt-3 h-12 w-full" preserveAspectRatio="none">
          <path
            key={`s${i}`}
            d={sparkPath(d.spark)}
            fill="none"
            stroke={isFake ? "#94a3b8" : "#10b981"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            className="spark-draw"
          />
        </svg>

        {/* verdict */}
        <div
          key={`v${i}`}
          className={`verdict-pop mt-3 rounded-xl border p-3 ${
            isFake ? "border-rose-500/30 bg-rose-500/10" : "border-emerald-500/30 bg-emerald-500/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{isFake ? "⚠️" : "✅"}</span>
            <span className={`text-sm font-bold ${isFake ? "text-rose-300" : "text-emerald-300"}`}>
              {isFake ? "Giảm giá ảo" : "Deal thật"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{d.truth}</p>
        </div>

        {/* dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {DEMOS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-5 bg-[#a78bfa]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
