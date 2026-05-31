import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/catalog";
import { vnd } from "@/lib/format";
import { getBrand } from "@/lib/brands";
import { CATEGORIES, priceRange } from "@/lib/categories";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: "Không tìm thấy thương hiệu" };

  const products = await searchProducts(brand.keyword);
  const range = priceRange(products);
  const title = `Giá ${brand.name} Shopee — soi giá thật trước khi mua`;
  const description = range
    ? `So sánh giá ${brand.name} trên Shopee theo lịch sử giá thật. ${range.count} sản phẩm, giá từ ${vnd(range.low)} — biết loại nào đang giảm thật, loại nào giảm ảo.`
    : `So sánh giá ${brand.name} trên Shopee theo lịch sử giá thật — biết loại nào đang giảm thật, loại nào giảm ảo.`;

  return {
    title,
    description,
    alternates: { canonical: `/thuong-hieu/${brand.slug}` },
    // Don't let empty brand pages into the index.
    robots: products.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: { title, description, type: "website" },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const products = await searchProducts(brand.keyword);
  const range = priceRange(products);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Giá ${brand.name} Shopee`,
    url: `${SITE_URL}/thuong-hieu/${brand.slug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Trang chủ", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: brand.name,
          item: `${SITE_URL}/thuong-hieu/${brand.slug}`,
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
            <span className="text-[#6e6e73]">{brand.name}</span>
          </nav>
          <h1 className="mt-4 font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
            Giá {brand.name} Shopee
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-relaxed text-[#6e6e73]">
            {range
              ? `${range.count} sản phẩm ${brand.name} đang theo dõi, giá từ ${vnd(range.low)}. Xem lịch sử giá thật để biết món nào đang giảm thật, món nào chỉ giảm ảo trước khi chốt đơn.`
              : `Theo dõi giá ${brand.name} trên Shopee qua lịch sử giá thật — biết món nào đang giảm thật, món nào chỉ giảm ảo.`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.08] bg-[#f5f5f7] p-16 text-center text-[#6e6e73]">
            <p className="text-3xl">🔍</p>
            <p className="mt-2">
              Chưa có sản phẩm {brand.name} nào đang được theo dõi.{" "}
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

        {/* Browse by category */}
        <div className="mt-12">
          <h2 className="text-[17px] font-semibold text-[#1d1d1f]">Soi giá theo danh mục</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/danh-muc/${c.slug}`}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-[13px] text-[#6e6e73] transition hover:border-[#0066cc]/40 hover:text-[#0066cc]"
              >
                {c.emoji} {c.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
