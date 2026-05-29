/**
 * REAL Shopee affiliate short links, keyed by product id (the slug in seed.ts).
 *
 * How to get a link:
 *   Shopee Affiliate dashboard → "Tạo link" / Shortlink → dán URL sản phẩm
 *   → copy link dạng https://s.shopee.vn/XXXX (hoặc https://shp.ee/XXXX).
 *   Link này đã gắn affiliate id của bạn → click + mua sẽ tính hoa hồng.
 *
 * Bỏ dấu // và dán link vào dòng tương ứng. Sản phẩm không có link ở đây sẽ
 * fallback về link tìm kiếm Shopee (KHÔNG tính hoa hồng).
 */
export const AFFILIATE_LINKS: Record<string, string> = {
  "tai-nghe-soundcore-r50i": "https://s.shopee.vn/2Vow4Fd0Dc",
  // "sac-du-phong-anker-20000": "https://s.shopee.vn/XXXXXXXX",
  // "sac-du-phong-anker-20000": "https://s.shopee.vn/XXXXXXXX",
  // "ban-phim-co-akko-3068": "https://s.shopee.vn/XXXXXXXX",
  // "chuot-logitech-mx-master-3s": "https://s.shopee.vn/XXXXXXXX",
  // "noi-chien-khong-dau-locklock-5l5": "https://s.shopee.vn/XXXXXXXX",
  // "robot-hut-bui-xiaomi-e10": "https://s.shopee.vn/XXXXXXXX",
  // "ao-thun-nam-cotton-basic": "https://s.shopee.vn/XXXXXXXX",
  // "giay-sneaker-nam-tr-01": "https://s.shopee.vn/XXXXXXXX",
  // "serum-vitamin-c-melano": "https://s.shopee.vn/XXXXXXXX",
  // "kem-chong-nang-anessa": "https://s.shopee.vn/XXXXXXXX",
  // "bim-bobby-size-l": "https://s.shopee.vn/XXXXXXXX",
  // "may-do-huyet-ap-omron-7121": "https://s.shopee.vn/XXXXXXXX",
};
