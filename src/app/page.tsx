import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { Odometer } from "@/components/Odometer";
import { DetectorDemo } from "@/components/DetectorDemo";
import { DealTicker } from "@/components/DealTicker";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { Tilt } from "@/components/Tilt";
import { getAllProducts, getRealDeals, getFakeDeals } from "@/lib/repository";
import { computeStats } from "@/lib/pricing";

const CATEGORIES = ["Điện tử", "Gia dụng", "Thời trang", "Làm đẹp", "Mẹ & Bé", "Sức khỏe"];

export default function HomePage() {
  const all = getAllProducts();
  const realDeals = getRealDeals().map((r) => r.product);
  const fakeDeals = getFakeDeals();
  const pricePoints = all.reduce((sum, p) => sum + p.history.length, 0);
  const totalSavings = all.reduce((sum, p) => {
    const s = computeStats(p);
    return sum + Math.max(0, s.typical - s.current);
  }, 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <CursorSpotlight />
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="dot-grid absolute inset-0 opacity-50" />
          <div className="animate-float-slow absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#ee4d2d]/15 blur-3xl" />
          <div className="animate-float-slow-2 absolute -left-24 top-10 h-72 w-72 rounded-full bg-amber-300/25 blur-3xl" />
          <div className="animate-float-slow-3 absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-rose-300/15 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ee4d2d]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#ee4d2d] backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ee4d2d]" />
              Bắt giảm giá ảo · Săn deal thật trên Shopee
            </span>
            <h1 className="font-display mt-5 text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              Giảm 50%…{" "}
              <span className="animate-gradient-pan bg-gradient-to-r from-[#ee4d2d] via-amber-500 to-[#ee4d2d] bg-clip-text italic text-transparent">
                hay giá cũ đội lên?
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600 sm:text-lg lg:mx-0">
              Giá Thật lưu lịch sử giá Shopee để bạn biết đâu là <b>deal thật</b>,
              đâu là <b>giảm giá ảo</b> — và báo ngay khi giá xuống thật sự.
            </p>

            <div className="mx-auto mt-7 max-w-xl lg:mx-0">
              <SearchBar />
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  href={`/tim-kiem?q=${encodeURIComponent(cat)}`}
                  className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur transition hover:border-[#ee4d2d]/40 hover:text-[#ee4d2d]"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: live price detector */}
          <div className="flex justify-center lg:justify-end">
            <Tilt max={6}>
              <DetectorDemo />
            </Tilt>
          </div>
        </div>
      </section>

      <DealTicker />

      {/* Animated stats band */}
      <div className="mx-auto max-w-4xl px-4">
        <Reveal>
          <div className="-mt-9 grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-xl shadow-slate-200/50 backdrop-blur sm:gap-3">
            <StatItem value={pricePoints} label="Điểm giá đã ghi nhận" />
            <StatItem value={realDeals.length} label="Deal thật hôm nay" accent="text-emerald-600" />
            <StatItem value={fakeDeals.length} label="Giảm ảo đã bắt" accent="text-rose-600" />
          </div>
        </Reveal>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16">
        <Reveal>
          <Section
            accent="bg-rose-500"
            title="⚠️ Cẩn thận: giảm giá ảo"
            subtitle="Quảng cáo giảm sâu nhưng thực ra không hề rẻ hơn ngày thường."
          >
            <Grid>
              {fakeDeals.map((p) => (
                <Tilt key={p.id}>
                  <ProductCard product={p} />
                </Tilt>
              ))}
            </Grid>
          </Section>
        </Reveal>

        <Reveal>
          <Section
            accent="bg-emerald-500"
            title="✅ Deal thật hôm nay"
            subtitle="Đang ở mức thấp nhất hoặc rẻ hơn rõ rệt so với giá thường ngày."
          >
            <Grid>
              {realDeals.map((p) => (
                <Tilt key={p.id}>
                  <ProductCard product={p} />
                </Tilt>
              ))}
            </Grid>
          </Section>
        </Reveal>

        {/* Savings odometer band */}
        <Reveal>
          <section className="relative mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ee4d2d] to-amber-500 p-8 text-center text-white shadow-xl shadow-[#ee4d2d]/20">
            <div className="dot-grid absolute inset-0 opacity-20" />
            <p className="relative text-sm font-medium text-white/90">
              Tổng mức giảm giá <b>THẬT</b> mà Giá Thật phát hiện hôm nay
            </p>
            <div className="relative mt-2 flex items-baseline justify-center text-4xl font-extrabold sm:text-5xl">
              <Odometer value={totalSavings} />
              <span className="ml-1">₫</span>
            </div>
            <p className="relative mt-2 text-sm text-white/80">
              Mua đúng giá, đừng để “giảm giá ảo” móc túi.
            </p>
          </section>
        </Reveal>

        {/* How it works */}
        <Reveal>
          <section className="mt-12 overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="font-display text-center text-2xl font-bold text-slate-900">Cách hoạt động</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[
                { icon: "🔗", title: "Dán link Shopee", desc: "Thêm sản phẩm bạn quan tâm để theo dõi." },
                { icon: "📊", title: "Xem giá thật", desc: "Lịch sử giá cho biết deal xịn hay giảm ảo." },
                { icon: "🔔", title: "Nhận cảnh báo", desc: "Báo email ngay khi giá xuống thật sự." },
              ].map((s) => (
                <div key={s.title} className="text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#ee4d2d]/10 to-amber-100 text-2xl">
                    {s.icon}
                  </div>
                  <h3 className="mt-3 font-semibold text-slate-800">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/theo-doi"
                className="inline-block rounded-full bg-gradient-to-r from-[#ee4d2d] to-amber-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ee4d2d]/20 transition hover:scale-[1.02]"
              >
                Theo dõi sản phẩm của bạn →
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}

function StatItem({
  value,
  label,
  accent = "text-slate-900",
}: {
  value: number;
  label: string;
  accent?: string;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-extrabold sm:text-3xl ${accent}`}>
        <CountUp to={value} />
      </div>
      <div className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">{label}</div>
    </div>
  );
}

function Section({
  accent,
  title,
  subtitle,
  children,
}: {
  accent: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-5 flex items-start gap-3">
        <span className={`mt-1 h-7 w-1.5 rounded-full ${accent}`} />
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{children}</div>;
}
