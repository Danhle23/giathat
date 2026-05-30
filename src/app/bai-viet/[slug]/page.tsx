import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "@/lib/articles";
import { viDate } from "@/lib/format";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Không tìm thấy bài viết" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/bai-viet/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.description },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    author: { "@type": "Organization", name: "Giá Thật" },
    publisher: { "@type": "Organization", name: "Giá Thật" },
    mainEntityOfPage: `${SITE_URL}/bai-viet/${article.slug}`,
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-4 text-sm text-slate-400">
        <Link href="/bai-viet" className="hover:text-[#ee4d2d]">Bài viết</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-500">{article.emoji}</span>
      </nav>

      <h1 className="font-display text-4xl font-bold leading-tight text-white">{article.title}</h1>
      <p className="mt-2 text-sm text-slate-400">
        {viDate(article.date)} · {article.readMins} phút đọc
      </p>

      <div className="mt-6 space-y-4">
        {article.blocks.map((b, i) => {
          if (b.h) return <h2 key={i} className="font-display pt-2 text-xl font-bold text-white">{b.h}</h2>;
          if (b.list)
            return (
              <ul key={i} className="list-disc space-y-1.5 pl-5 text-slate-300">
                {b.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          return <p key={i} className="leading-relaxed text-slate-300">{b.p}</p>;
        })}
      </div>

      {/* CTA */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#ee4d2d] to-amber-500 p-6 text-center text-white">
        <p className="text-lg font-bold">Tra giá thật trước khi mua</p>
        <p className="mt-1 text-sm text-white/90">
          Xem lịch sử giá & bắt giảm ảo cho bất kỳ sản phẩm Shopee nào.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#ee4d2d] transition hover:scale-[1.02]"
        >
          Kiểm tra giá ngay →
        </Link>
      </div>
    </article>
  );
}
