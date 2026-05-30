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
      className="flex w-full items-center gap-2 rounded-full border border-black/10 bg-white px-2 py-1.5 focus-within:border-[#0066cc]"
    >
      <span className="pl-2 text-[#86868b]" aria-hidden>🔍</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm sản phẩm: kem chống nắng, serum, son…"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-[#1d1d1f] outline-none placeholder:text-[#86868b]"
        aria-label="Tìm sản phẩm"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-[#0066cc] px-4 py-1.5 text-[14px] font-medium text-white transition active:scale-95"
      >
        Kiểm tra giá
      </button>
    </form>
  );
}
