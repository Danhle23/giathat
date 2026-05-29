import type { Metadata } from "next";
import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
import { Logo } from "@/components/Logo";
import { ScrollProgress } from "@/components/ScrollProgress";
import { DealToasts } from "@/components/DealToasts";
import { getFakeDeals, getRealDeals } from "@/lib/repository";
import "./globals.css";

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
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-500">
            <Logo />
            <p className="mt-3 max-w-xl">
              Công cụ theo dõi lịch sử giá &amp; phát hiện giảm giá ảo trên Shopee.
              Một số liên kết là liên kết tiếp thị (affiliate) — bạn không phải trả thêm phí.
            </p>
            <p className="mt-4 text-xs text-slate-400">
              © {new Date().getFullYear()} Giá Thật · Dữ liệu mẫu phục vụ demo MVP.
            </p>
          </div>
        </footer>

        <DealToasts items={toastItems} />
      </body>
    </html>
  );
}
