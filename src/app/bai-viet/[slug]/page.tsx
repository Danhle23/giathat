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
    <article className="mx-auto max-w-2xl px-5 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-5 text-[13px] text-[#86868b]">
        <Link href="/bai-viet" className="hover:text-[#0066cc]">Bài viết</Link>
        <span className="mx-1.5">/</span>
        <span className="text-[#6e6e73]">{article.emoji}</span>
      </nav>

      <h1 className="font-display text-4xl font-semibold leading-tight text-[#1d1d1f]">{article.title}</h1>
      <p className="mt-3 text-[13px] text-[#86868b]">
        {viDate(article.date)} · {article.readMins} phút đọc
      </p>

      <div className="mt-7 space-y-5 text-[17px] leading-[1.6] text-[#333336]">
        {article.blocks.map((b, i) => {
          if (b.h) return <h2 key={i} className="font-display pt-3 text-2xl font-semibold text-[#1d1d1f]">{b.h}</h2>;
          if (b.list)
            return (
              <ul key={i} className="list-disc space-y-2 pl-6">
                {b.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          return <p key={i}>{b.p}</p>;
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-3xl bg-[#0066cc] p-8 text-center text-white">
        <p className="text-[22px] font-semibold">Tra giá thật trước khi mua</p>
        <p className="mt-1.5 text-[15px] text-white/90">
          Xem lịch sử giá &amp; bắt giảm ảo cho bất kỳ sản phẩm Shopee nào.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-[15px] font-medium text-[#0066cc] transition active:scale-95"
        >
          Kiểm tra giá ngay
        </Link>
      </div>
    </article>
  );
}
