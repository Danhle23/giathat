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
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mx-auto max-w-xl">
        <SearchBar initial={q} />
      </div>

      <p className="mt-6 text-sm text-slate-500">
        {q ? (
          <>
            {results.length} kết quả cho <b>“{q}”</b>
          </>
        ) : (
          <>Tất cả sản phẩm</>
        )}
      </p>

      {results.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          Không tìm thấy sản phẩm phù hợp. Thử từ khoá khác nhé.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <Tilt key={p.id}>
              <ProductCard product={p} />
            </Tilt>
          ))}
        </div>
      )}
    </div>
  );
}
