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
    <div className="mx-auto max-w-3xl px-5 py-14">
      <h1 className="font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">Bài viết</h1>
      <p className="mt-2 text-[17px] text-[#6e6e73]">
        Mẹo mua đúng giá, nhận biết giảm ảo &amp; săn deal thật trên Shopee.
      </p>

      <div className="mt-8 space-y-3">
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            href={`/bai-viet/${a.slug}`}
            className="group flex gap-4 rounded-2xl border border-black/[0.08] bg-white p-5 transition hover:border-black/[0.16]"
          >
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[#f5f5f7] text-2xl">
              {a.emoji}
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-[#1d1d1f] group-hover:text-[#0066cc]">{a.title}</h2>
              <p className="mt-1 line-clamp-2 text-[14px] text-[#6e6e73]">{a.description}</p>
              <p className="mt-1.5 text-[12px] text-[#86868b]">
                {viDate(a.date)} · {a.readMins} phút đọc
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
