import type { PriceSnapshot } from "@/lib/types";
import { vnd, viDate } from "@/lib/format";

/**
 * Lightweight dependency-free SVG line chart of price history.
 * Draws the price line, the "typical" (average) reference and the all-time low.
 */
export function PriceChart({
  history,
  current,
  width = 720,
  height = 240,
}: {
  history: PriceSnapshot[];
  current: number;
  width?: number;
  height?: number;
}) {
  const points = [...history, { date: "today", price: current }];
  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const typical = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  const padL = 8;
  const padR = 8;
  const padT = 16;
  const padB = 16;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const range = Math.max(max - min, 1);

  const x = (i: number) => padL + (i / (points.length - 1)) * innerW;
  const y = (price: number) => padT + (1 - (price - min) / range) * innerH;

  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(" ");
  const area = `${line} L${x(points.length - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${padL.toFixed(1)},${(padT + innerH).toFixed(1)} Z`;

  const lastX = x(points.length - 1);
  const lastY = y(current);
  const typicalY = y(typical);
  const minY = y(min);

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        role="img"
        aria-label="Biểu đồ lịch sử giá"
      >
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ee4d2d" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ee4d2d" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* typical (average) reference line */}
        <line x1={padL} y1={typicalY} x2={width - padR} y2={typicalY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 4" />
        <text x={padL + 2} y={typicalY - 4} fontSize="11" fill="#64748b">
          Giá thường ngày {vnd(typical)}
        </text>

        {/* all-time low reference line */}
        <line x1={padL} y1={minY} x2={width - padR} y2={minY} stroke="#10b981" strokeWidth="1" strokeDasharray="2 3" />
        <text x={padL + 2} y={minY + 13} fontSize="11" fill="#059669">
          Thấp nhất {vnd(min)}
        </text>

        <path d={area} fill="url(#fill)" />
        <path d={line} fill="none" stroke="#ee4d2d" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* current price marker */}
        <circle cx={lastX} cy={lastY} r="4" fill="#ee4d2d" stroke="#fff" strokeWidth="1.5" />
      </svg>
      <figcaption className="mt-1 flex justify-between text-xs text-slate-400">
        <span>{viDate(history[0]?.date ?? "")}</span>
        <span>Hôm nay</span>
      </figcaption>
    </figure>
  );
}
