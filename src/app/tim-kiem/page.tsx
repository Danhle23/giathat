import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { searchProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm",
  description: "Tìm và kiểm tra lịch sử giá mỹ phẩm Shopee.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = await searchProducts(q);

  return (
    <div>
      <section className="border-b border-black/5 bg-[#f5f5f7]">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <h1 className="font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
            Tra giá thật trước khi mua
          </h1>
          <p className="mt-2 text-[17px] text-[#6e6e73]">
            Gõ tên sản phẩm để xem lịch sử giá &amp; biết deal thật hay giảm ảo.
          </p>
          <div className="mx-auto mt-7 max-w-xl">
            <SearchBar initial={q} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <p className="mb-5 text-[15px] text-[#6e6e73]">
          {q ? (
            <>
              {results.length} kết quả cho <b className="text-[#1d1d1f]">“{q}”</b>
            </>
          ) : (
            <>Tất cả sản phẩm</>
          )}
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-black/[0.08] bg-[#f5f5f7] p-16 text-center text-[#6e6e73]">
            <p className="text-3xl">🔍</p>
            <p className="mt-2">Không tìm thấy sản phẩm phù hợp. Thử từ khoá khác nhé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
