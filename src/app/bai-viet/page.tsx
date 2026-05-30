import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";
import { viDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Bài viết — Mẹo mua đúng giá & bắt giảm ảo",
  description:
    "Hướng dẫn nhận biết giảm giá ảo, mẹo săn deal thật và cách mua đúng giá trên Shopee.",
  alternates: { canonical: "/bai-viet" },
};

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-white">Bài viết</h1>
      <p className="mt-1 text-slate-400">
        Mẹo mua đúng giá, nhận biết giảm ảo & săn deal thật trên Shopee.
      </p>

      <div className="mt-6 space-y-3">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            href={`/bai-viet/${a.slug}`}
            className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-0.5 hover:border-[#8b5cf6]/40 hover:bg-white/[0.06]"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#8b5cf6]/25 to-indigo-500/10 text-2xl">
              {a.emoji}
            </div>
            <div>
              <h2 className="font-semibold text-white group-hover:text-[#a78bfa]">{a.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-400">{a.description}</p>
              <p className="mt-1 text-xs text-slate-500">
                {viDate(a.date)} · {a.readMins} phút đọc
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
