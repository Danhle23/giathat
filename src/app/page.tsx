import Link from "next/link";
import type { Product } from "@/lib/types";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { getAllProducts, getFakeDeals } from "@/lib/catalog";
import { CATEGORIES } from "@/lib/categories";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [all, fakeDeals] = await Promise.all([getAllProducts(), getFakeDeals()]);

  return (
    <div>
      {/* Hero — light, quiet, product-first */}
      <section className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:py-28">
          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-[#1d1d1f] sm:text-6xl">
            Giá thật.
            <br />
            Không giảm giá ảo.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-xl leading-snug text-[#6e6e73]">
            Theo dõi lịch sử giá mỹ phẩm Shopee — biết deal nào thật, deal nào ảo trước khi mua.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#deals"
              className="rounded-full bg-[#0066cc] px-5 py-2.5 text-[15px] font-medium text-white transition active:scale-95"
            >
              Xem deal hôm nay
            </Link>
            <Link
              href="/theo-doi"
              className="rounded-full border border-[#0066cc] px-5 py-2.5 text-[15px] font-medium text-[#0066cc] transition active:scale-95"
            >
              Theo dõi giá
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <SearchBar />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/danh-muc/${cat.slug}`}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-[12px] text-[#6e6e73] transition hover:border-[#0066cc]/40 hover:text-[#0066cc]"
              >
                {cat.emoji} {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fake-discount alert (only when history detects some) */}
      {fakeDeals.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <Reveal>
              <h2 className="font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
                Cẩn thận: giảm giá ảo
              </h2>
              <p className="mt-2 text-[17px] text-[#6e6e73]">
                Quảng cáo giảm sâu nhưng giá không hề rẻ hơn ngày thường.
              </p>
              <ProductGrid products={fakeDeals} className="mt-8" />
            </Reveal>
          </div>
        </section>
      )}

      {/* Deals grid */}
      <section id="deals" className="bg-[#f5f5f7]">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
              Deal làm đẹp hôm nay
            </h2>
            <p className="mt-2 text-[17px] text-[#6e6e73]">
              Mỹ phẩm Shopee đã được lọc &amp; cập nhật mỗi ngày — kèm lịch sử giá thật.
            </p>
            <ProductGrid products={all} className="mt-8" />
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-5 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
            Mua đúng giá trong 3 bước
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {[
              ["Tìm sản phẩm", "Gõ tên mỹ phẩm bạn định mua trên Shopee."],
              ["Xem giá thật", "Biểu đồ lịch sử giá cho biết deal xịn hay giảm ảo."],
              ["Nhận cảnh báo", "Đặt email để được báo khi giá xuống thật sự."],
            ].map(([title, desc], i) => (
              <div key={title}>
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#0066cc] text-[17px] font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-[19px] font-semibold text-[#1d1d1f]">{title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#6e6e73]">{desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/theo-doi"
            className="mt-12 inline-block rounded-full bg-[#0066cc] px-6 py-3 text-[15px] font-medium text-white transition active:scale-95"
          >
            Theo dõi sản phẩm của bạn
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductGrid({ products, className = "" }: { products: Product[]; className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
