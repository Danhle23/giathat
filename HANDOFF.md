# HANDOFF — Ngữ cảnh & việc đang dở (cập nhật 2026-06-03)

> File này bổ sung cho `CLAUDE.md`. Lần sau mở session mới, đọc **CLAUDE.md +
> file này** để nắm tiếp. Đây là nhật ký các việc đã làm gần đây + việc còn lại.

---

## 1) SEO content (ĐÃ XONG, đã deploy)

Đã thêm hệ thống SEO kéo traffic miễn phí từ Google:

- **Trang danh mục** `/danh-muc/[slug]` (programmatic SEO):
  - 6 slug: `kem-chong-nang`, `serum`, `son`, `sua-rua-mat`, `mat-na`, `nuoc-hoa`.
  - Nguồn dữ liệu: `src/lib/categories.ts` (slug → từ khóa + SEO copy + FAQ + helper
    `priceRange`, `inferCategory`, `categoryFaq`).
  - Mỗi trang: lưới ProductCard (lọc bằng `searchProducts`), H1 "Giá [dm] Shopee",
    intro nhắm từ khóa, breadcrumb, dải thống kê giá thật, **FAQ + JSON-LD FAQPage**,
    JSON-LD CollectionPage/ItemList, chip thương hiệu, `force-dynamic`.
  - OG image động: `src/app/danh-muc/[slug]/opengraph-image.tsx`.
- **Trang thương hiệu** `/thuong-hieu/[slug]` (`src/lib/brands.ts`):
  - Lọc catalog theo brand; `getBrandsInCatalog` chỉ lộ brand THỰC SỰ có hàng
    (trang rỗng → noindex, không vào sitemap).
  - ⚠️ Hiện **tất cả trang brand đang rỗng** vì catalog thật toàn shop nhỏ, không khớp
    tên brand quốc tế (CeraVe/Anessa/The Ordinary…). Sẽ tự kích hoạt khi data có brand
    khớp. Có thể thêm brand Việt/Hàn phổ biến vào `BRANDS` cho khớp data thật.
- **Trang sản phẩm** `/san-pham/[id]`: breadcrumb click được về `/danh-muc`,
  JSON-LD BreadcrumbList, lưới "sản phẩm cùng danh mục".
- **Bài viết** (`src/lib/articles.ts`): thêm 3 bài (giá serum hợp lý, kem chống nắng
  đáng mua 2026, nhận biết mỹ phẩm giảm giá ảo) + chip danh mục cuối mỗi bài.
- **Internal linking**: sitemap (danh mục + brand có hàng), footer & chip trang chủ
  đổi `/tim-kiem?q=` → `/danh-muc/[slug]`.
- `src/lib/text.ts`: hàm `normalize()` dùng chung cho search/category/brand.

## 2) Curation fix (ĐÃ XONG code, CẦN chạy sync để dọn DB)

`src/lib/sync.ts` trước chỉ có allowlist `BEAUTY_RE` → trang "Mặt nạ" dính **mặt nạ xe
HONDA**, các trang dính **kệ/khay đựng mỹ phẩm**. Đã thêm `EXCLUDE_RE` chặn phụ tùng xe
+ nội thất; mở rộng `BEAUTY_RE` ("kem chong nang" → "chong nang" để bắt xịt/sáp chống nắng).

➡️ **VIỆC CÒN LẠI:** chạy lại sync để dọn rác trong DB (Danh tự bấm — lệnh để lộ secret):
`GET https://giathat.vercel.app/api/cron/sync?secret=<CRON_SECRET>`
Rồi kiểm tra `https://giathat.vercel.app/danh-muc/mat-na` không còn mặt nạ xe.

## 3) Auto-post Threads (ĐÃ XONG setup, đang TẮT chờ bật)

Code: `src/lib/threads.ts` + route `/api/cron/threads` (test tay). Job
`/api/cron/telegram` (cron 1h sáng) đăng SONG SONG Telegram + Threads — vì **Vercel Hobby
giới hạn 2 cron job**, KHÔNG thêm cron thứ 3 vào `vercel.json` (deploy sẽ fail).

Đã làm xong qua trình duyệt (Claude in Chrome):
- Instagram **muadinhbanday** → Creator (Professional), danh mục Health/beauty.
- Tài khoản **Meta for Developers** đã tạo.
- App **"Soi Gia Auto Post"**:
  - App ID (Meta): `1292964112957411`
  - Threads App ID: `1558855969281716`
  - Quyền: `threads_basic` + `threads_content_publish` (Sẵn sàng thử nghiệm).
- Tài khoản Threads `muadinhbanday` đã là **tester** + đã **Accept** lời mời
  (Threads → Settings → More settings → Website permissions → Invites).
- Đã tạo **access token** (Settings → Công cụ tạo mã người dùng → Tạo mã truy cập).

Env trên Vercel (project `giathat`, Production+Preview):
- `THREADS_TOKEN` = (đã lưu, KHÔNG ghi ở đây — token Threads ~60 ngày)
- `THREADS_ENABLED` = `false`  ← để TẮT, chưa đăng
- (Không cần `THREADS_USER_ID`: code dùng alias `me`.)

➡️ **CÁCH BẬT (làm SAU khi AccessTrade duyệt, vì link aff còn 404):**
1. Vercel → giathat → Settings → Environment Variables → sửa `THREADS_ENABLED` = `true` → Redeploy.
2. Test: `GET https://giathat.vercel.app/api/cron/threads?secret=<CRON_SECRET>`
   → mong `{"ok":true,"posted":N}`. Kiểm tra bài mới trên Threads `@muadinhbanday`.
3. Sau đó cron 1h sáng tự đăng deal hằng ngày.

⏳ **Token hết hạn ~60 ngày**: gia hạn bằng `refreshThreadsToken()` trong `threads.ts`,
hoặc tạo lại token theo đúng các bước trên (Meta → app → Settings → Tạo mã truy cập)
rồi cập nhật lại `THREADS_TOKEN` trên Vercel.

## 4) Facebook Page auto-post (CHƯA LÀM — bạn từng muốn)

Threads & Facebook Pages **không chung 1 app** (Meta tách use case). Muốn đăng Page:
tạo app Meta thứ 2 với use case Pages, lấy Page access token, viết `src/lib/facebook.ts`
tương tự `threads.ts`, gọi thêm trong `/api/cron/telegram`. Chưa làm.

---

## Ràng buộc dự án (nhắc lại)
- Apple-light: nền trắng/parchment `#f5f5f7`, accent DUY NHẤT `#0066cc`, tối giản.
- Bắt buộc `npm run build` PASS + `npm run lint` sạch trước khi commit.
- Commit + push `main` (Vercel auto-deploy). Co-author trailer:
  `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`

## Đang chờ bên ngoài (không phải bug)
- **AccessTrade duyệt campaign Shopee** — đã ~2-3 ngày chưa duyệt. Link `go.isclix.com`
  còn 404 cho tới khi duyệt. Nên chủ động hỏi support AccessTrade (nút Support / chat).
- Cần vài ngày cron tích lũy lịch sử giá → verdict "giảm ảo" mới chính xác.
