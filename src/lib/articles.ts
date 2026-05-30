export interface Block {
  h?: string; // sub-heading
  p?: string; // paragraph
  list?: string[]; // bullet list
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readMins: number;
  emoji: string;
  blocks: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: "cach-nhan-biet-giam-gia-ao-shopee",
    title: "Cách nhận biết giảm giá ảo trên Shopee (2026)",
    description:
      "Nhiều shop nâng giá rồi gắn mác giảm 50%. Đây là cách kiểm tra một deal có thật hay không bằng lịch sử giá.",
    date: "2026-05-20",
    readMins: 4,
    emoji: "🕵️",
    blocks: [
      { p: "“Giảm 50%” trên Shopee không phải lúc nào cũng là giảm thật. Một chiêu phổ biến là nâng giá niêm yết lên cao rồi gạch ngang, khiến mức giảm trông hấp dẫn — trong khi giá bán thực tế chẳng rẻ hơn ngày thường là bao." },
      { h: "1. Đừng tin con số % giảm" },
      { p: "Phần trăm giảm được tính trên “giá niêm yết” do shop tự đặt. Shop hoàn toàn có thể đặt giá niêm yết ảo. Con số -50% vì thế gần như vô nghĩa nếu bạn không biết giá thật thường ngày." },
      { h: "2. So với GIÁ THƯỜNG NGÀY, không phải giá gạch" },
      { p: "Deal thật là khi giá hiện tại thấp hơn rõ rệt so với mức giá trung bình mà sản phẩm vẫn bán suốt thời gian qua. Muốn biết điều đó, bạn cần lịch sử giá." },
      { h: "3. Dùng lịch sử giá để kiểm chứng" },
      { p: "Công cụ như Soi Giá lưu lại giá theo từng ngày. Chỉ cần nhìn biểu đồ là biết: giá hôm nay có đang ở vùng thấp nhất, hay chỉ là mức giá quen thuộc được khoác áo “giảm sốc”." },
      { list: [
        "🟢 Giá hiện tại ≈ mức thấp nhất → deal thật, nên mua",
        "🟡 Thấp hơn trung bình một chút → giá tốt",
        "🔴 Bằng/cao hơn trung bình nhưng quảng cáo giảm sâu → giảm ảo",
      ] },
      { h: "Tóm lại" },
      { p: "Trước khi bấm mua, hãy tra lịch sử giá. Một phút kiểm tra giúp bạn không bị “giảm giá ảo” móc túi." },
    ],
  },
  {
    slug: "meo-san-deal-that-shopee",
    title: "7 mẹo săn deal thật, mua đúng giá trên Shopee",
    description:
      "Tổng hợp mẹo thực tế giúp bạn mua đúng giá, tránh bẫy giảm ảo và chốt deal đúng thời điểm.",
    date: "2026-05-24",
    readMins: 5,
    emoji: "🎯",
    blocks: [
      { p: "Mua sắm thông minh không phải là mua nhiều, mà là mua đúng giá. Dưới đây là 7 mẹo giúp bạn săn deal thật trên Shopee." },
      { list: [
        "Luôn tra lịch sử giá trước khi mua — biết giá thật thường ngày.",
        "Đặt cảnh báo giảm giá thay vì canh thủ công.",
        "Cẩn thận với “Flash Sale” giá không đổi so với ngày thường.",
        "So sánh nhiều shop cho cùng một sản phẩm.",
        "Cộng dồn mã giảm + hoàn xu để ra giá thực rẻ nhất.",
        "Ưu tiên các đợt sale lớn (ngày đôi) — giảm thường thật hơn.",
        "Đừng mua vì FOMO — nếu chưa phải giá thấp nhất, có thể chờ.",
      ] },
      { h: "Mẹo quan trọng nhất" },
      { p: "Trong tất cả, việc tra lịch sử giá là đòn bẩy lớn nhất: nó biến mọi quảng cáo “giảm sốc” thành con số có thể kiểm chứng." },
    ],
  },
  {
    slug: "nen-mua-ngay-hay-cho-giam-them",
    title: "Nên mua ngay hay chờ giảm thêm? Quyết định bằng lịch sử giá",
    description:
      "Một khung tư duy đơn giản dựa trên dữ liệu giá để biết khi nào nên chốt, khi nào nên chờ.",
    date: "2026-05-27",
    readMins: 3,
    emoji: "⏳",
    blocks: [
      { p: "Câu hỏi muôn thuở khi mua online: chốt ngay hay chờ thêm? Thay vì đoán, hãy để lịch sử giá trả lời." },
      { h: "Nếu giá đang ở vùng thấp nhất" },
      { p: "Khi giá hiện tại chạm hoặc sát mức thấp nhất nhiều tháng → khả năng giảm sâu hơn là thấp. Đây là lúc nên chốt." },
      { h: "Nếu giá đang ở mức trung bình" },
      { p: "Giá đang bình thường, dù quảng cáo có hấp dẫn → bạn có thể đặt cảnh báo và chờ một đợt giảm thật, đặc biệt gần các ngày sale lớn." },
      { h: "Nếu là “giảm ảo”" },
      { p: "Tuyệt đối đừng vội. Giá này không hề rẻ — chờ là lựa chọn đúng." },
      { p: "Cách nhanh nhất để áp dụng: tra sản phẩm trên Soi Giá, nhìn biểu đồ, rồi quyết." },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
