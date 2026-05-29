# Giá Thật 🛒

> Theo dõi lịch sử giá Shopee, **bắt giảm giá ảo** và báo bạn khi có **deal thật**.

Ở Shopee, người bán hay nâng giá rồi gắn mác "giảm 50%". **Giá Thật** lưu lịch sử giá
theo thời gian để chỉ ra đâu là khuyến mãi xịn, đâu là giảm giá ảo — và kiếm doanh thu
qua liên kết tiếp thị (affiliate) khi người dùng bấm mua.

Đây là **MVP chạy bằng dữ liệu mẫu**. Toàn bộ ứng dụng được thiết kế sau một lớp
"adapter" để khi có quyền truy cập Shopee Affiliate Open Platform thì cắm dữ liệu thật
vào mà không phải sửa giao diện.

## ✨ Tính năng

- 🕵️ **Phát hiện giảm giá ảo** — so sánh giá "giảm" với giá trung bình thật sự trong lịch sử.
- 📊 **Biểu đồ lịch sử giá** — vẽ bằng SVG thuần, hiển thị mức thấp nhất / trung bình / hiện tại.
- ✅ **Phân loại deal** — Deal thật · Giá tốt · Bình thường · Giảm ảo.
- 🔔 **Cảnh báo giảm giá** — đăng ký email, chỉ báo khi giá xuống thật.
- 🔗 **Link affiliate có tracking** — tự gắn affiliate id + sub-id (CPS).
- 🚀 **Sẵn cho marketing** — SEO (metadata theo sản phẩm, sitemap, robots) + ảnh OG "thẻ deal"
  tự sinh để chia sẻ lên TikTok/Facebook.

## 🧱 Công nghệ

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- Ảnh OG động qua `next/og`
- Dữ liệu: in-memory repository + seed (production: **Postgres** qua Prisma — xem `prisma/schema.prisma`)

## ▶️ Chạy thử

```bash
npm install
npm run dev
```

Mở http://localhost:3000

## 🗂️ Cấu trúc

```
src/
  app/
    page.tsx                 # Trang chủ: deal thật + cảnh báo giảm ảo
    san-pham/[id]/page.tsx   # Chi tiết: biểu đồ giá, phán quyết, mua, cảnh báo
    san-pham/[id]/opengraph-image.tsx  # Thẻ deal tự sinh (share social)
    tim-kiem/page.tsx        # Tìm kiếm
    theo-doi/page.tsx        # Dán link Shopee để theo dõi
    api/{alert,track}/route.ts
    sitemap.ts · robots.ts
  components/                # ProductCard, PriceChart, VerdictBadge, forms...
  lib/
    types.ts · pricing.ts    # Logic phân loại deal thật / giảm ảo
    seed.ts · repository.ts  # Dữ liệu mẫu + lớp truy cập
    shopee/provider.ts       # Adapter Shopee (mock → cắm API thật)
prisma/schema.prisma         # Mô hình dữ liệu Postgres cho bản production
```

## 🔌 Cắm dữ liệu Shopee thật

1. Đăng ký **Shopee Affiliate Open Platform**, lấy `App ID` + `App Secret`.
2. Tạo `RealShopeeProvider implements ShopeeProvider` trong `src/lib/shopee/provider.ts`
   (gọi GraphQL: `productOfferV2`, `generateShortLink`, `conversionReport`, `listItemFeeds`).
3. Thay storage in-memory bằng Postgres theo `prisma/schema.prisma`.
4. Thêm cron chụp giá hằng ngày để dựng lịch sử giá thật.

Sao chép `.env.example` thành `.env.local` và điền cấu hình.

## 📈 Hướng tăng trưởng (đã thiết kế sẵn móc nối)

- **SEO tự động:** mỗi sản phẩm = 1 landing page nhắm từ khoá "giá [tên sản phẩm]".
- **Content "bóc phốt giảm ảo":** dùng ảnh OG thẻ deal để làm video TikTok/Reels.
- **Bot deal Telegram/Zalo:** đẩy deal thật mỗi ngày (roadmap).
- **Extension trình duyệt:** xem lịch sử giá ngay trên trang Shopee (roadmap).

## 🤖 Bot Telegram (tự đăng deal)

Tự động đăng deal thật lên channel Telegram mỗi ngày (ảnh thẻ deal + nút mua affiliate).

1. Chat **@BotFather** → `/newbot` → lấy **bot token**.
2. Tạo **channel**, thêm bot làm **admin** (quyền đăng bài).
3. Lấy **chat id**: dùng `@username` của channel, hoặc id dạng `-100...`.
4. Đặt env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CRON_SECRET`, `NEXT_PUBLIC_SITE_URL`.
5. Test thủ công: mở `https://<domain>/api/cron/telegram?secret=<CRON_SECRET>`.

Lịch chạy hằng ngày được khai báo trong `vercel.json` (Vercel Cron). Mỗi link gắn
sub-id `telegram` để đo đơn về từ kênh này.

## 🚀 Deploy

Đẩy lên GitHub rồi import vào **Vercel** (đặt biến `NEXT_PUBLIC_SITE_URL`, `SHOPEE_AFFILIATE_ID`).

---

*Dữ liệu hiện tại là dữ liệu mẫu phục vụ demo.*
