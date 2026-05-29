import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { getRealDeals, getFakeDeals } from "@/lib/repository";

export default function HomePage() {
  const realDeals = getRealDeals().map((r) => r.product);
  const fakeDeals = getFakeDeals();

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <span className="inline-block rounded-full bg-[#ee4d2d]/10 px-3 py-1 text-xs font-semibold text-[#ee4d2d]">
            Bắt giảm giá ảo · Săn deal thật trên Shopee
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Giảm 50%… <span className="text-[#ee4d2d]">hay là giá cũ đội lên?</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Giá Thật lưu lịch sử giá Shopee để bạn biết đâu là <b>deal thật</b>,
            đâu là <b>giảm giá ảo</b> — và báo bạn ngay khi giá xuống thật sự.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <SearchBar />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Thử tìm: tai nghe, nồi chiên, serum, robot hút bụi…
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        {/* Fake-discount alert — the signature hook */}
        <section className="mt-2">
          <div className="mb-4 flex items-end justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">⚠️ Cẩn thận: giảm giá ảo</h2>
              <p className="text-sm text-slate-500">
                Quảng cáo giảm sâu nhưng thực ra <b>không hề rẻ</b> hơn ngày thường.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {fakeDeals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Real deals */}
        <section className="mt-12">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900">✅ Deal thật hôm nay</h2>
            <p className="text-sm text-slate-500">
              Đang ở mức thấp nhất hoặc rẻ hơn rõ rệt so với giá thường ngày.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {realDeals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <h2 className="text-center text-lg font-bold text-slate-900">Cách hoạt động</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { icon: "🔗", title: "Dán link Shopee", desc: "Thêm sản phẩm bạn quan tâm để theo dõi." },
              { icon: "📊", title: "Xem giá thật", desc: "Lịch sử giá cho biết deal xịn hay giảm ảo." },
              { icon: "🔔", title: "Nhận cảnh báo", desc: "Báo email ngay khi giá xuống thật sự." },
            ].map((s) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#ee4d2d]/10 text-2xl">
                  {s.icon}
                </div>
                <h3 className="mt-3 font-semibold text-slate-800">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/theo-doi"
              className="inline-block rounded-full bg-[#ee4d2d] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d63e1f]"
            >
              Theo dõi sản phẩm của bạn →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
