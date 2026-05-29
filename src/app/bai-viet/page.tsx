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
      <h1 className="font-display text-3xl font-bold text-slate-900">Bài viết</h1>
      <p className="mt-1 text-slate-500">
        Mẹo mua đúng giá, nhận biết giảm ảo & săn deal thật trên Shopee.
      </p>

      <div className="mt-6 space-y-3">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            href={`/bai-viet/${a.slug}`}
            className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#ee4d2d]/40 hover:shadow-lg"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#ee4d2d]/10 to-amber-100 text-2xl">
              {a.emoji}
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 group-hover:text-[#ee4d2d]">{a.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{a.description}</p>
              <p className="mt-1 text-xs text-slate-400">
                {viDate(a.date)} · {a.readMins} phút đọc
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
