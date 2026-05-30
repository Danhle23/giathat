import type { Metadata } from "next";
import Link from "next/link";
import { Be_Vietnam_Pro } from "next/font/google";
import { Logo } from "@/components/Logo";
import { ARTICLES } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Soi Giá — Lịch sử giá Shopee & cảnh báo giảm giá ảo",
    template: "%s | Soi Giá",
  },
  description:
    "Theo dõi lịch sử giá mỹ phẩm Shopee, phát hiện giảm giá ảo và nhận cảnh báo khi có deal thật. Mua đúng giá, không bị lừa.",
  keywords: ["giá shopee", "lịch sử giá", "giảm giá ảo", "săn deal", "mỹ phẩm", "deal làm đẹp"],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Soi Giá",
    title: "Soi Giá — Bắt giảm giá ảo trên Shopee",
    description: "Lịch sử giá thật giúp bạn biết deal nào xịn, deal nào ảo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-[#1d1d1f]">
        <header className="sticky top-0 z-20 border-b border-black/5 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
            <Link href="/" aria-label="Soi Giá — trang chủ">
              <Logo />
            </Link>
            <nav className="flex items-center gap-5 text-[13px] text-[#1d1d1f]">
              <Link href="/" className="transition hover:text-[#0066cc]">
                Deal hôm nay
              </Link>
              <Link href="/bai-viet" className="hidden transition hover:text-[#0066cc] sm:block">
                Bài viết
              </Link>
              <Link
                href="/theo-doi"
                className="rounded-full bg-[#0066cc] px-4 py-1.5 font-medium text-white transition active:scale-95"
              >
                Theo dõi giá
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-black/5 bg-[#f5f5f7]">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <Logo />
                <p className="mt-3 text-[13px] leading-relaxed text-[#6e6e73]">
                  Theo dõi lịch sử giá &amp; phát hiện giảm giá ảo trên Shopee. Mua đúng giá,
                  không bị lừa.
                </p>
              </div>

              <FooterCol title="Khám phá">
                <FooterLink href="/">Deal hôm nay</FooterLink>
                <FooterLink href="/tim-kiem">Tìm kiếm sản phẩm</FooterLink>
                <FooterLink href="/theo-doi">Theo dõi giá</FooterLink>
                <FooterLink href="/bai-viet">Bài viết</FooterLink>
              </FooterCol>

              <FooterCol title="Danh mục">
                {CATEGORIES.map((cat) => (
                  <FooterLink key={cat.slug} href={`/danh-muc/${cat.slug}`}>
                    {cat.label}
                  </FooterLink>
                ))}
              </FooterCol>

              <FooterCol title="Bài viết mới">
                {ARTICLES.slice(0, 3).map((a) => (
                  <FooterLink key={a.slug} href={`/bai-viet/${a.slug}`}>
                    {a.title}
                  </FooterLink>
                ))}
              </FooterCol>
            </div>

            <div className="mt-12 flex flex-col gap-2 border-t border-black/10 pt-6 text-[12px] text-[#86868b] sm:flex-row sm:items-center sm:justify-between">
              <p>© {new Date().getFullYear()} Soi Giá.</p>
              <p>Một số liên kết là liên kết tiếp thị (affiliate) — bạn không trả thêm phí.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-[#1d1d1f]">{title}</p>
      <ul className="mt-3 space-y-2 text-[13px] text-[#6e6e73]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition hover:text-[#0066cc]">
        {children}
      </Link>
    </li>
  );
}
