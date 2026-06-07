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

---

## 5) Affiliate qua MXH Threads (ĐANG LÀM — kênh kiếm tiền chính hiện tại)

**Phát hiện quan trọng:** Shopee Affiliate của Danh ĐÃ DUYỆT, đang chạy, đã có hoa hồng
(~50k). Lấy link tại `affiliate.shopee.vn` → "Hoa hồng Sản phẩm" hoặc "Custom Link" →
ra link dạng `s.shopee.vn/xxxx` (gắn Sub_id `SoiGia` để tracking). Đây là kênh ăn tiền
THẬT, độc lập với AccessTrade. (Open API + Product Feed của Shopee thì CHƯA được cấp
quyền → chưa tự động hằng ngày qua server được; hiện làm thủ công qua Cowork.)

**Tài khoản Threads:** muadinhbanday (Grimm) — ~373 follower, vài nghìn view/bài.
Bio đã sửa: "Soi lịch sử giá trước khi mua, né giảm giá ảo / Mách deal làm đẹp & đồ
dùng đáng tiền / Link xịn ở dưới 👇". Link bio: giathat.vercel.app.

### Quy tắc đăng CHỐNG BÓP TƯƠNG TÁC (Threads 2026) — BẮT BUỘC tuân thủ
1. **KHÔNG để link affiliate trong thân bài.** Link luôn đặt ở **bài 2/comment đầu**
   của chuỗi thread (dùng "Add to thread" khi soạn, hoặc reply chính bài sau khi đăng).
   Lý do: Meta dìm mạnh bài có link dẫn ra ngoài.
2. Câu đầu phải "chặn tay lướt" (feed chỉ hiện ~1 dòng đầu).
3. Threads chấm điểm REPLY > like → kết bài bằng câu hỏi.
4. Giới hạn 500 ký tự/bài. Nếu hiện "-100" cạnh nút Post = đang dư 100 ký tự, phải cắt.
5. Giọng văn ĐỜI THƯỜNG, slang, ít emoji rao hàng, bỏ dấu hai chấm, đừng học thuật,
   đừng "AI quá". (Đây là yêu cầu rõ ràng của Danh.)

### Quy tắc COMMENT DẠO (comment marketing) — BẮT BUỘC
- **TUYỆT ĐỐI không thả link** trong comment bài người khác (= cờ spam, bị bóp/khóa).
  Link chỉ nằm ở bio. Comment để gây chú ý → người ta bấm vào profile → thấy bio.
- **KHÔNG bịa trải nghiệm cá nhân** ("mình xài rồi", "mình mua rồi") khi chưa thật sự
  dùng → KHÔNG trung thực, classifier sẽ chặn, và mất uy tín. (Đã từng mắc lỗi này,
  phải xóa & đăng lại.)
- Comment ĐÚNG VAI "người soi giá": góp ý về giá ("mấy món hot hay bị đẩy giá lúc đông
  người, nhớ soi giá tí"), hỏi gợi chuyện, khen có thật.
- Tối đa ~3 comment dạo/lần + 1 bài/lần, giãn cách. Đừng spam.

### Chiến lược nội dung (xoay vòng, rút ra từ quan sát feed)
Chủ đề đang hot trên Threads VN: skincare (brand tuyển UGC 200k/post), thủ thuật săn
sale Shopee (gạt xu/flash sale), bài kể chuyện/than thở (kéo comment cảm xúc).
Format thắng = **bóc phốt + mẹo**, KHÔNG quảng cáo lộ liễu. Luân phiên:
1. Bóc phốt "giảm giá ảo" (thế mạnh brand) — vd bài ghế công thái học Sihoo đã đăng.
2. Mẹo săn sale Shopee (dễ viral).
3. Review thật có khen có chê (tạo niềm tin).
4. Kể chuyện mua hớ (kéo comment).
→ Mỗi bài đính 1 link `s.shopee.vn` ở comment. Skincare ↔ đồ công nghệ luân phiên.

### Đã đăng (tính tới 2026-06-03)
- Bài Torriden kem gel dưỡng ẩm (s.shopee.vn/8fPh8nXnrf) — link trong thân (bài cũ,
  chưa tối ưu).
- Chuỗi bài ghế công thái học Sihoo M57 (s.shopee.vn/9pbeiWtYby) — link ở comment 2/2,
  CHUẨN format chống bóp. Giọng đời thường.
- 2 comment dạo: bài KOL @quachanhmakeupartist (makeup), bài @g14.hwn9 (săn sale).

### Link affiliate đã tạo sẵn (Sub_id=SoiGia, ăn hoa hồng)
- Torriden Kem gel số 1 (HH 19%, 100k+ bán): s.shopee.vn/8fPh8nXnrf
- Sihoo M57 ghế công thái học (HH 9%, ~4.77tr): s.shopee.vn/9pbeiWtYby
- (CM24 nước hoa, SKIN1004 chống nắng: đã tick chọn, lấy lại link trong Hoa hồng Sản phẩm)

### Nhật ký + kết quả (cập nhật 2026-06-03, phiên 2)
- Đã đăng thêm bài "mẹo săn sale" (thân bài không link, link Torriden ở comment 2/2).
- Đã comment dạo 3 bài, tất cả ĐÚNG VAI soi giá, không link, không bịa:
  1. @quachanhmakeupartist (KOL makeup, 6.4K view) — góp ý về giá
  2. @g14.hwn9 (săn sale Shopee) — bổ sung mẹo soi giá → **tác giả ĐÃ LIKE comment**
  3. @annie_nguyen2093 (hỏi review kcn cho da mụn) — tư vấn + lồng soi giá
- KẾT QUẢ tương tác (xem trong Activity): g14.hwn9 like comment; có 1 follow mới
  (trungranahihi._). Tài khoản ~373 follower, ~3.4K view/profile.
- Đã follow tocobo.vn (TOCOBO — brand kcn Hàn) để feed giàu nội dung niche kcn.

### Insight TRENDING (để bám trend lần sau)
- "Trending now" của Threads VN phần lớn là **drama showbiz/idol** (Karina, PiaLinh,
  Quincy, UPRIZE...) — KHÔNG hợp niche soi giá, ĐỪNG gượng bám.
- Mảng khai thác được: chip hot "bán hàng online / tặng quà / Starbucks", và
  **bài người dùng HỎI MUA/REVIEW sản phẩm** (vd "nên dùng kcn nào", "tìm mua...").
  → Đây là MỎ VÀNG để comment dạo: người ta có nhu cầu thật, tư vấn đúng lúc dễ kéo
  về profile nhất. Ưu tiên search "nên mua / review giúp / tìm mua + [sản phẩm]".

### Giới hạn nhịp đăng (TRÁNH BỊ BÓP/KHÓA)
- Mỗi phiên/ngày: tối đa ~1 bài + ~3 comment dạo. ĐỪNG đăng/comment dồn dập.
- Cowork (Claude) KHÔNG chạy 24/7 → "đăng đều hằng ngày" = mỗi lần Danh mở máy gọi.
  Auto thật cần AccessTrade duyệt hoặc Shopee Open API (đều đang chờ/chưa cấp).
- Việc nên làm mỗi phiên: (1) check Activity, rep lại tương tác để đẩy reach;
  (2) cập nhật trending; (3) 1 bài mới bám trend + tối đa 3 comment dạo bài "hỏi mua".

### Bài đã đăng (cập nhật 2026-06-06, phiên 3)
4 bài trên profile, xoay vòng chủ đề (đều format chuỗi 2/2, link ở comment):
1. Torriden kem dưỡng (link thân — bài cũ, chưa tối ưu)
2. Ghế công thái học Sihoo (bóc phốt) — s.shopee.vn/9pbeiWtYby
3. Mẹo săn sale Shopee — s.shopee.vn/8fPh8nXnrf
4. Mẹo chọn serum (đắt ≠ tốt, giảm sốc ≠ rẻ) — s.shopee.vn/8fPh8nXnrf
Follower dao động ~372-373, ~3.5K view/profile. g14.hwn9 (tác giả bài săn sale)
đã LIKE comment soi giá; +1 follow mới (trungranahihi._).

### KẾT LUẬN về TikTok (đã kiểm tra 2026-06-06)
- AccessTrade có "TIKTOK SHOP CPS" (HH upto 20%, Cost Per Sale) NHƯNG **Datafeed: No**
  → tạo link thủ công từng sản phẩm, KHÔNG tự động hằng ngày được.
- Vì vậy ĐỔI WEB sang "TikTok affiliate tự động" là BẤT KHẢ THI (web xây trên cơ chế
  datafeed). TikTok CPS giống hệt Shopee Affiliate (gắn tay), mà Danh chưa có sản phẩm/
  uy tín ở TikTok → đổi sang lúc này không lợi.
- Danh CHƯA đăng ký affiliate TikTok nào (chỉ là campaign hiển thị trên AccessTrade).
- AccessTrade Shopee đã treo >1 tuần chưa duyệt → web đang phụ thuộc sai chỗ.

### HƯỚNG WEB — ĐÃ LÀM (2026-06-06, commit e2b6b3a)
✅ Gỡ phụ thuộc AccessTrade: thêm khu "Sản phẩm tuyển chọn" trên trang chủ.
- src/lib/picks.ts — danh sách PICKS (sản phẩm chọn tay + link s.shopee.vn THẬT,
  ăn hoa hồng). Hiện có: Torriden (8fPh8nXnrf), Sihoo M57 (9pbeiWtYby).
- src/components/PickCard.tsx — thẻ bấm mua thẳng Shopee (rel nofollow sponsored).
- Trang chủ có section ngay sau hero. Đã live, link affiliate hoạt động.
→ Web giờ ĐÃ ăn tiền thật, không chờ AccessTrade.
THÊM SẢN PHẨM: lấy link ở Shopee Affiliate (Hoa hồng Sản phẩm/Custom Link, Sub_id
=SoiGia) rồi thêm 1 object vào mảng PICKS trong src/lib/picks.ts. KHÔNG cần DB/cron.

### TODO web tiếp theo (khi muốn)
- Thêm nhiều sản phẩm vào PICKS (đa danh mục: serum, son, chống nắng, đồ dùng).
- Có thể hiện PICKS thêm ở trang /danh-muc/[slug] cho khớp danh mục.
- Dài hạn: nếu Shopee cấp Open API → tự động hoá; còn không thì PICKS thủ công vẫn ổn.
