import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { Tilt } from "@/components/Tilt";
import { searchProducts } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm",
  description: "Tìm và kiểm tra lịch sử giá sản phẩm Shopee.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchProducts(q);

  return (
    <div>
      {/* Header band */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="dot-grid absolute inset-0 opacity-50" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ee4d2d]/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tra giá thật mọi sản phẩm Shopee
          </h1>
          <p className="mt-2 text-slate-500">
            Gõ tên sản phẩm để xem lịch sử giá &amp; biết deal thật hay giảm ảo.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <SearchBar initial={q} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="mb-4 text-sm text-slate-500">
          {q ? (
            <>
              {results.length} kết quả cho <b>“{q}”</b>
            </>
          ) : (
            <>Tất cả sản phẩm</>
          )}
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center text-slate-500">
            <p className="text-3xl">🔍</p>
            <p className="mt-2">Không tìm thấy sản phẩm phù hợp. Thử từ khoá khác nhé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((p) => (
              <Tilt key={p.id}>
                <ProductCard product={p} />
              </Tilt>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
