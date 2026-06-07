/**
 * "Sản phẩm tuyển chọn" — danh sách sản phẩm chọn tay, gắn link Shopee
 * Affiliate THẬT (s.shopee.vn / shp.ee). Khu này ĐỘC LẬP với datafeed
 * AccessTrade: nút "Mua" trỏ thẳng link affiliate đã gắn mã → ăn hoa hồng ngay,
 * không phụ thuộc việc AccessTrade duyệt campaign.
 *
 * Cách thêm: lấy link tại Shopee Affiliate (Hoa hồng Sản phẩm / Custom Link →
 * Sub_id = "SoiGia"), dán vào `affLink` dưới đây.
 */
export interface Pick {
  /** id ngắn (slug) */
  id: string;
  name: string;
  /** Nhãn danh mục hiển thị + emoji minh hoạ (ảnh fallback) */
  category: string;
  emoji: string;
  /** Link Shopee Affiliate thật (đã gắn mã, ăn hoa hồng) */
  affLink: string;
  /** Giá hiện tại (VND) */
  price: number;
  /** Giá gạch ngang (tuỳ chọn) */
  listedPrice?: number;
  /** Lý do chọn — 1 câu ngắn, thật, đúng chất "người soi giá" */
  note: string;
}

export const PICKS: Pick[] = [
  {
    id: "torriden-dive-in-serum",
    name: "Torriden DIVE IN Kem gel số 1 (dưỡng ẩm)",
    category: "Serum / Dưỡng ẩm",
    emoji: "💧",
    affLink: "https://s.shopee.vn/8fPh8nXnrf",
    price: 343200,
    listedPrice: 580800,
    note: "Cấp ẩm nhẹ, thấm nhanh, hợp cả da dầu. Canh đúng vùng giá tốt là hời.",
  },
  {
    id: "sihoo-m57-ghe-cong-thai-hoc",
    name: "Ghế công thái học Sihoo M57 (bảo hành 36 tháng)",
    category: "Đồ dùng / Ghế",
    emoji: "🪑",
    affLink: "https://s.shopee.vn/9pbeiWtYby",
    price: 4770000,
    listedPrice: 5300000,
    note: "Phân khúc tầm trung đáng tiền: chỉnh tựa đầu + đỡ lưng, khung chắc.",
  },
];
