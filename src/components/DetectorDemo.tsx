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
    emoji: "🎧",
    img: "https://loremflickr.com/200/200/headphones,earbuds?lock=11",
    name: "Tai nghe Bluetooth XYZ Pro",
    listed: 599000,
    current: 299000,
    kind: "FAKE",
    truth: "Giá thật thường ~300.000đ — “giảm 50%” chỉ là chiêu nâng giá.",
    spark: [300, 305, 298, 302, 300, 299, 301, 300],
  },
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
    emoji: "🤖",
    img: "https://loremflickr.com/200/200/robot,vacuum?lock=33",
    name: "Robot hút bụi Xiaomi E10",
    listed: 6190000,
    current: 3890000,
    kind: "REAL",
    truth: "Rẻ hơn 22% so với giá thường ngày.",
    spark: [4900, 4950, 4880, 4920, 4900, 4870, 4200, 3890],
  },
  {
    emoji: "👟",
    img: "https://loremflickr.com/200/200/sneakers,shoes?lock=44",
    name: "Giày sneaker thể thao TR-01",
    listed: 743000,
    current: 450000,
    kind: "FAKE",
    truth: "Tháng trước chỉ ~445.000đ — mác “giảm 39%” là ảo.",
    spark: [448, 452, 445, 450, 449, 451, 447, 450],
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
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-tr from-[#ee4d2d]/15 to-amber-300/15 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-2xl shadow-[#ee4d2d]/10 backdrop-blur">
        {/* scanning beam — restarts every cycle via key */}
        <div
          key={i}
          className="scan-line pointer-events-none absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#ee4d2d] to-transparent"
          style={{ boxShadow: "0 0 14px 2px rgba(238,77,45,0.55)" }}
        />

        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#ee4d2d]" />
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
              gradient="from-slate-100 to-slate-50"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{d.name}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-lg font-extrabold text-[#ee4d2d]">{vnd(d.current)}</span>
              <span className="text-xs text-slate-400 line-through">{vnd(d.listed)}</span>
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
            isFake ? "border-rose-200 bg-rose-50" : "border-emerald-200 bg-emerald-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{isFake ? "⚠️" : "✅"}</span>
            <span className={`text-sm font-bold ${isFake ? "text-rose-700" : "text-emerald-700"}`}>
              {isFake ? "Giảm giá ảo" : "Deal thật"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">{d.truth}</p>
        </div>

        {/* dots */}
        <div className="mt-3 flex justify-center gap-1.5">
          {DEMOS.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-5 bg-[#ee4d2d]" : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
