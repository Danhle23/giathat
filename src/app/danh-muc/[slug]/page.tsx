import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/catalog";
import { CATEGORIES, getCategory } from "@/lib/categories";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return { title: "Không tìm thấy danh mục" };
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: `/danh-muc/${cat.slug}` },
    openGraph: {
      title: cat.title,
      description: cat.description,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const products = await searchProducts(cat.keyword);
  const others = CATEGORIES.filter((c) => c.slug !== cat.slug);
  const label = cat.label.toLowerCase();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.title,
    description: cat.description,
    url: `${SITE_URL}/danh-muc/${cat.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: cat.label,
          item: `${SITE_URL}/danh-muc/${cat.slug}`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `${SITE_URL}/san-pham/${p.id}`,
      })),
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-black/5 bg-[#f5f5f7]">
        <div className="mx-auto max-w-3xl px-5 py-14 text-center sm:py-16">
          <nav className="text-[13px] text-[#86868b]">
            <Link href="/" className="transition hover:text-[#0066cc]">
              Trang chủ
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-[#6e6e73]">{cat.label}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
            Giá {label} Shopee
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-relaxed text-[#6e6e73]">
            {cat.intro}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {/* Cross-links to other categories */}
        <div className="mb-8 flex flex-wrap gap-2">
          {others.map((c) => (
            <Link
              key={c.slug}
              href={`/danh-muc/${c.slug}`}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-[13px] text-[#6e6e73] transition hover:border-[#0066cc]/40 hover:text-[#0066cc]"
            >
              {c.emoji} {c.label}
            </Link>
          ))}
        </div>

        <p className="mb-5 text-[15px] text-[#6e6e73]">
          <b className="text-[#1d1d1f]">{products.length}</b> sản phẩm {label} — kèm lịch sử giá thật
        </p>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.08] bg-[#f5f5f7] p-16 text-center text-[#6e6e73]">
            <p className="text-3xl">{cat.emoji}</p>
            <p className="mt-2">
              Chưa có sản phẩm {label} trong danh mục này.{" "}
              <Link href="/tim-kiem" className="text-[#0066cc]">
                Tìm sản phẩm khác ›
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-black/[0.08] bg-[#f5f5f7] p-6 text-center">
          <p className="text-[15px] font-semibold text-[#1d1d1f]">
            Đừng để “giảm 50%” đánh lừa
          </p>
          <p className="mx-auto mt-1 max-w-xl text-[14px] leading-relaxed text-[#6e6e73]">
            Soi Giá lưu lịch sử giá theo từng ngày, giúp bạn biết {label} nào đang giảm thật
            và loại nào chỉ giảm ảo trước khi chốt đơn.
          </p>
          <Link
            href="/theo-doi"
            className="mt-4 inline-block rounded-full bg-[#0066cc] px-5 py-2.5 text-[14px] font-medium text-white transition active:scale-95"
          >
            Theo dõi giá sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
