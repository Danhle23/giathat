@AGENTS.md

# Giá Thật — Project State & Handoff

Web theo dõi **lịch sử giá mỹ phẩm Shopee**, phát hiện **giảm giá ảo**, kiếm tiền qua
**affiliate AccessTrade**. Niche: **Làm đẹp / mỹ phẩm**.

- **Live:** https://giathat.vercel.app
- **Repo:** https://github.com/Danhle23/giathat (owner: Danhle23)
- **Local:** ~/Projects/giathat · `npm run dev`

## Stack
- Next.js 16 (App Router, TS) · Tailwind v4 · deploy Vercel (auto-deploy on push to `main`)
- Postgres (Neon) qua lib `postgres` · dữ liệu sản phẩm + lịch sử giá
- Nguồn sản phẩm: **AccessTrade datafeed** (campaign Shopee = id `322`)

## Design system (QUAN TRỌNG)
**Apple-style, light.** Đừng quay lại dark/tím.
- Nền trắng `#ffffff` / parchment `#f5f5f7`. Màu nhấn DUY NHẤT: xanh `#0066cc`.
- Font: system (SF Pro) qua stack `-apple-system,...`; `.font-display` = tracking tight.
- Tối giản: KHÔNG ticker/toast/tilt/blob/spotlight/gradient. Thẻ trắng viền mảnh, bo 18px, pill CTA.

## Luồng dữ liệu (tự động)
1. Cron daily `/api/cron/sync` → kéo AccessTrade datafeed (nhiều trang) →
   **curate về NICHE LÀM ĐẸP** bằng keyword (`BEAUTY_RE` trong `src/lib/sync.ts`) →
   upsert `products` + 1 `price_snapshots`/ngày → xóa sản phẩm ngoài batch.
2. Site đọc qua `src/lib/catalog.ts` (React `cache`, fallback mock nếu DB lỗi).
3. Verdict "deal thật/giảm ảo" ở `src/lib/pricing.ts` — **guard: cần ≥3 ngày lịch sử** mới phán.
4. Nút "Mua" dùng `product.affLink` (link `go.isclix.com` từ datafeed).

## File chính
- `src/lib/sync.ts` — datafeed → DB + curation niche (sửa `BEAUTY_RE` để đổi ngách)
- `src/lib/catalog.ts` — đọc sản phẩm (DB + fallback)
- `src/lib/accesstrade.ts` · `src/lib/db.ts` · `src/lib/telegram.ts` · `src/lib/pricing.ts`
- API: `/api/cron/sync`, `/api/cron/telegram`, `/api/at-test`, `/api/at-products`

## Env (Vercel → Production)
NEXT_PUBLIC_SITE_URL, ACCESSTRADE_API_KEY, ACCESSTRADE_CAMPAIGN=shopee, DATABASE_URL (Neon),
CRON_SECRET (=`giathat-secret-123`), TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID,
TELEGRAM_BOT_ENABLED (=`false`, bật `true` SAU khi campaign được duyệt).

Chạy sync tay: `GET /api/cron/sync?secret=<CRON_SECRET>`

## ✅ Đã xong
Redesign Apple-light; niche làm đẹp (~56 sản phẩm); pipeline DB + cron; sản phẩm/ảnh/link thật;
SEO (sitemap, JSON-LD, bài viết); bot Telegram (đang tạm tắt); form cảnh báo/theo dõi.

## ⏳ Đang chờ (BÊN NGOÀI — không phải bug)
- **AccessTrade duyệt campaign Shopee.** Tài khoản đang bị "khóa tham gia" do quy trình xác thực
  mới (tháng 5). Đã nộp form xác thực (khai website giathat.vercel.app, chọn "Publisher Cũ"),
  chờ ~48h. **Cho tới khi duyệt, link `go.isclix.com` trả 404** → chưa ăn được hoa hồng.
- Lịch sử giá cần vài ngày cron tích lũy → verdict "bóc giảm ảo" mới chính xác.

## Việc của người dùng (Danh)
1. Hoàn tất AccessTrade: **payment info** + **xác thực CCCD** + chờ duyệt campaign.
2. Sau khi duyệt → test 1 link "Mua" (hết 404) → set `TELEGRAM_BOT_ENABLED=true` + Redeploy.
3. Làm **content làm đẹp** (TikTok/Threads), để link `giathat.vercel.app` ở bio, kéo người.
4. Đủ 1.000 follower TikTok → mở **TikTok Shop Affiliate** (dòng tiền thứ 2).

Commission Shopee qua AccessTrade: **24%/bill**.
