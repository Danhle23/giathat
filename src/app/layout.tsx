import type { Metadata } from "next";
import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
import { Logo } from "@/components/Logo";
import { ScrollProgress } from "@/components/ScrollProgress";
import { DealToasts } from "@/components/DealToasts";
import { getFakeDeals, getRealDeals } from "@/lib/repository";
import { ARTICLES } from "@/lib/articles";
import "./globals.css";

const FOOTER_CATEGORIES = ["Điện tử", "Gia dụng", "Thời trang", "Làm đẹp", "Mẹ & Bé", "Sức khỏe"];

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Giá Thật — Lịch sử giá Shopee & cảnh báo giảm giá ảo",
    template: "%s | Giá Thật",
  },
  description:
    "Theo dõi lịch sử giá sản phẩm Shopee, phát hiện giảm giá ảo và nhận cảnh báo khi có deal thật. Mua đúng giá, không bị lừa.",
  keywords: ["giá shopee", "lịch sử giá", "giảm giá ảo", "săn deal", "theo dõi giá", "deal shopee"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Giá Thật",
    title: "Giá Thật — Bắt giảm giá ảo trên Shopee",
    description: "Lịch sử giá thật giúp bạn biết deal nào xịn, deal nào ảo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const toastItems = [
    ...getFakeDeals().map((p) => ({ id: p.id, name: p.name, type: "FAKE" as const, drop: 0 })),
    ...getRealDeals().map((r) => ({
      id: r.product.id,
      name: r.product.name,
      type: "REAL" as const,
      drop: Math.round(r.realDiscount * 100),
    })),
  ];

  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col text-slate-800">
        <ScrollProgress />
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" aria-label="Giá Thật — trang chủ">
              <Logo />
            </Link>
            <nav className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Deal hôm nay
              </Link>
              <Link
                href="/bai-viet"
                className="hidden rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
              >
                Bài viết
              </Link>
              <Link
                href="/theo-doi"
                className="rounded-full bg-[#ee4d2d] px-4 py-2 font-semibold text-white shadow-sm shadow-[#ee4d2d]/20 transition hover:bg-[#d63e1f]"
              >
                Theo dõi giá
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200/70 bg-white/70">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="lg:col-span-1">
                <Logo />
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  Theo dõi lịch sử giá &amp; phát hiện giảm giá ảo trên Shopee.
                  Mua đúng giá, không bị lừa.
                </p>
              </div>

              {/* Explore */}
              <div>
                <p className="text-sm font-semibold text-slate-800">Khám phá</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-500">
                  <li><Link href="/" className="hover:text-[#ee4d2d]">Deal hôm nay</Link></li>
                  <li><Link href="/tim-kiem" className="hover:text-[#ee4d2d]">Tìm kiếm sản phẩm</Link></li>
                  <li><Link href="/theo-doi" className="hover:text-[#ee4d2d]">Theo dõi giá</Link></li>
                  <li><Link href="/bai-viet" className="hover:text-[#ee4d2d]">Bài viết</Link></li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <p className="text-sm font-semibold text-slate-800">Danh mục</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-500">
                  {FOOTER_CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <Link href={`/tim-kiem?q=${encodeURIComponent(cat)}`} className="hover:text-[#ee4d2d]">
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Articles */}
              <div>
                <p className="text-sm font-semibold text-slate-800">Bài viết mới</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-500">
                  {ARTICLES.slice(0, 3).map((a) => (
                    <li key={a.slug}>
                      <Link href={`/bai-viet/${a.slug}`} className="hover:text-[#ee4d2d]">
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2 border-t border-slate-200/70 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Giá Thật · Dữ liệu mẫu phục vụ demo MVP.</p>
              <p>Một số liên kết là liên kết tiếp thị (affiliate) — bạn không trả thêm phí.</p>
            </div>
          </div>
        </footer>

        <DealToasts items={toastItems} />
      </body>
    </html>
  );
}
