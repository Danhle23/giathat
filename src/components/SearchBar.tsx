"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/tim-kiem?q=${encodeURIComponent(q.trim())}`);
      }}
      className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm focus-within:border-[#ee4d2d]"
    >
      <span className="pl-2 text-slate-400" aria-hidden>🔍</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm sản phẩm, ví dụ: tai nghe, nồi chiên, serum…"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
        aria-label="Tìm sản phẩm"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-[#ee4d2d] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#d63e1f]"
      >
        Kiểm tra giá
      </button>
    </form>
  );
}
