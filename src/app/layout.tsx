import type { Metadata } from "next";
import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
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
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-800">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-extrabold">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#ee4d2d] text-white">G</span>
              <span className="text-lg">
                Giá<span className="text-[#ee4d2d]">Thật</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">Deal hôm nay</Link>
              <Link href="/theo-doi" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">Theo dõi giá</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
            <p className="font-semibold text-slate-700">Giá Thật</p>
            <p className="mt-1 max-w-xl">
              Công cụ theo dõi lịch sử giá &amp; phát hiện giảm giá ảo trên Shopee.
              Một số liên kết là liên kết tiếp thị (affiliate) — bạn không phải trả thêm phí.
            </p>
            <p className="mt-3 text-xs text-slate-400">
              © {new Date().getFullYear()} Giá Thật · Dữ liệu mẫu phục vụ demo MVP.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
