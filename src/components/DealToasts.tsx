"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type ToastItem = {
  id: string;
  name: string;
  type: "FAKE" | "REAL";
  drop: number;
};

/** Periodically pops a small on-brand toast (bottom-left) about a live find. */
export function DealToasts({ items }: { items: ToastItem[] }) {
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const [seq, setSeq] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    let idx = 0;
    let hideTimer: ReturnType<typeof setTimeout>;

    const show = () => {
      setCurrent(items[idx % items.length]);
      setSeq((s) => s + 1);
      idx += 1;
      hideTimer = setTimeout(() => setCurrent(null), 4500);
    };

    const first = setTimeout(show, 3500);
    const loop = setInterval(show, 8500);
    return () => {
      clearTimeout(first);
      clearTimeout(hideTimer);
      clearInterval(loop);
    };
  }, [items]);

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40">
      {current && (
        <Link
          key={seq}
          href={`/san-pham/${current.id}`}
          className="toast-in pointer-events-auto flex max-w-xs items-center gap-3 rounded-2xl border border-white/10 bg-[#171327]/95 p-3 pr-4 shadow-xl shadow-black/50 backdrop-blur"
        >
          <span
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-lg ${
              current.type === "FAKE" ? "bg-rose-500/15" : "bg-emerald-500/15"
            }`}
          >
            {current.type === "FAKE" ? "⚠️" : "✅"}
          </span>
          <div className="min-w-0 text-sm">
            <p className={`font-semibold ${current.type === "FAKE" ? "text-rose-400" : "text-emerald-400"}`}>
              {current.type === "FAKE" ? "Vừa bắt được giảm ảo" : "Deal thật vừa xuất hiện"}
            </p>
            <p className="truncate text-slate-400">
              {current.name}
              {current.type === "REAL" && current.drop > 0 ? ` · -${current.drop}%` : ""}
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
