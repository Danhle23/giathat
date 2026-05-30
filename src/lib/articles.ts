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
  {
    slug: "gia-serum-bao-nhieu-la-hop-ly",
    title: "Giá serum bao nhiêu là hợp lý? Cách định giá trước khi mua",
    description:
      "Serum chênh giá cả trăm nghìn giữa các shop. Đây là cách xác định mức giá hợp lý cho một chai serum trước khi xuống tiền.",
    date: "2026-05-28",
    readMins: 5,
    emoji: "💧",
    blocks: [
      { p: "“Serum này bao nhiêu là hợp lý?” là câu hỏi khó, vì cùng một chai có thể chênh nhau cả trăm nghìn giữa hai gian hàng — và mức giá “niêm yết” thì gần như vô nghĩa. Hợp lý hay không không nằm ở con số tuyệt đối, mà ở chỗ nó so với giá thường ngày của chính sản phẩm đó như thế nào." },
      { h: "1. Bỏ qua giá niêm yết, nhìn giá thường ngày" },
      { p: "Giá gạch ngang do shop tự đặt nên không phản ánh giá trị thật. Mức giá hợp lý là vùng giá mà sản phẩm vẫn được bán ổn định suốt nhiều tuần — không phải con số xuất hiện đúng dịp flash sale rồi biến mất." },
      { h: "2. Lấy mốc theo dung tích (giá mỗi ml)" },
      { p: "Một mẹo nhanh để so các chai khác dung tích: chia giá cho số ml. Serum 30ml giá 250.000đ tương đương ~8.300đ/ml; cùng hoạt chất mà một nơi bán 12.000đ/ml thì rõ ràng kém hợp lý hơn." },
      { list: [
        "Niacinamide / B5 phổ thông: thường rẻ nhất theo ml — đừng trả giá cao.",
        "Vitamin C, Retinol: nhỉnh hơn vì dễ biến chất, cần đóng gói tốt.",
        "Cùng hoạt chất, chênh giá lớn thường đến từ thương hiệu chứ không phải hiệu quả.",
      ] },
      { h: "3. Đối chiếu với lịch sử giá" },
      { p: "Cách chắc chắn nhất là nhìn biểu đồ giá. Nếu giá hôm nay nằm ở vùng thấp nhất nhiều tháng → hợp lý, nên chốt. Nếu đang ở mức trung bình mà vẫn quảng cáo “giảm sâu” → chưa hợp lý, có thể chờ." },
      { p: "Trên Soi Giá, bạn có thể mở mục serum để xem các chai đang bán kèm lịch sử giá thật, rồi tự đối chiếu mức giá hợp lý cho chai mình định mua. Muốn tổng quát hơn về thời điểm, đọc thêm bài “Nên mua ngay hay chờ giảm thêm?”." },
      { h: "Tóm lại" },
      { p: "Giá serum hợp lý = mức thấp so với chính lịch sử giá của nó, không phải con số % giảm trên màn hình. Một phút tra giá giúp bạn không trả thừa cho một chai serum." },
    ],
  },
  {
    slug: "kem-chong-nang-nao-dang-mua-2026",
    title: "Kem chống nắng nào đáng mua 2026? Chọn đúng & soi giá thật",
    description:
      "Khung chọn kem chống nắng theo loại da và cách soi giá thật để mua đúng giá, không dính bẫy giảm ảo dịp sale.",
    date: "2026-05-29",
    readMins: 6,
    emoji: "☀️",
    blocks: [
      { p: "Kem chống nắng tốt nhất là loại bạn chịu bôi lại mỗi ngày — nên “đáng mua” phụ thuộc vào loại da và cảm giác trên da, rồi mới tới giá. Dưới đây là khung chọn nhanh kèm cách soi giá để không mua hớ trong các đợt sale 2026." },
      { h: "1. Chọn theo loại da trước" },
      { list: [
        "Da dầu / mụn: ưu tiên kết cấu mỏng, nhẹ, ít bóng (gel, essence, tone-up dạng nước).",
        "Da khô: chọn loại có thêm dưỡng ẩm, tránh cồn khô làm căng da.",
        "Da nhạy cảm: ưu tiên công thức tối giản, có thành phần làm dịu, đã quen thuộc với da.",
        "Cần đi nắng nhiều: nhìn chỉ số PA (++++ là cao nhất) hơn là chỉ nhìn SPF.",
      ] },
      { h: "2. SPF50+ / PA++++ là đủ cho phần lớn nhu cầu" },
      { p: "Con số SPF cao hơn không tăng hiệu quả tương ứng — quan trọng là bôi đủ lượng và bôi lại. Đừng trả thêm tiền chỉ vì bao bì ghi số to hơn." },
      { h: "3. Soi giá thật trước khi chốt" },
      { p: "Kem chống nắng là mặt hàng bị gắn mác “giảm sốc” liên tục. Cách kiểm tra: xem giá hôm nay có thật sự thấp hơn vùng giá thường ngày hay không. Nếu chỉ là giá quen được khoác áo flash sale → chưa đáng vội." },
      { list: [
        "🟢 Giá chạm vùng thấp nhất → đáng mua, nên chốt.",
        "🟡 Thấp hơn trung bình một chút → giá tốt, mua được.",
        "🔴 Bằng/cao hơn ngày thường mà quảng cáo giảm sâu → giảm ảo, nên chờ.",
      ] },
      { p: "Bạn có thể mở mục kem chống nắng trên Soi Giá để xem các loại đang bán kèm lịch sử giá thật, đối chiếu trước khi mua. Để hiểu kỹ chiêu nâng giá rồi gạch ngang, đọc thêm bài “Cách nhận biết mỹ phẩm giảm giá ảo”." },
      { h: "Tóm lại" },
      { p: "Kem chống nắng đáng mua = hợp loại da + bạn chịu bôi lại + mua đúng giá thật. Chọn đúng loại trước, rồi để lịch sử giá quyết định thời điểm chốt." },
    ],
  },
  {
    slug: "cach-nhan-biet-my-pham-giam-gia-ao",
    title: "Cách nhận biết mỹ phẩm giảm giá ảo (không bị shop dắt mũi)",
    description:
      "Mỹ phẩm là ngách bị làm giá ảo nhiều nhất. 5 dấu hiệu nhận biết giảm giá ảo và cách kiểm chứng bằng lịch sử giá.",
    date: "2026-05-30",
    readMins: 5,
    emoji: "🧴",
    blocks: [
      { p: "Mỹ phẩm là một trong những ngách bị “làm giá” nhiều nhất trên Shopee: vòng đời sản phẩm dài, người mua khó nhớ giá cũ, nên shop dễ nâng giá niêm yết rồi gắn mác giảm sâu. Đây là cách nhận ra chiêu này trước khi xuống tiền." },
      { h: "5 dấu hiệu của một deal mỹ phẩm giảm giá ảo" },
      { list: [
        "Phần trăm giảm rất to (-50%, -70%) nhưng giá bán cuối gần như mọi ngày.",
        "“Giá gốc” cao bất thường so với các shop khác cùng sản phẩm.",
        "Flash sale lặp lại liên tục — đợt nào cũng “sắp hết giờ”.",
        "Set/combo gộp để khó so giá lẻ từng món.",
        "Tăng giá ngầm sát ngày sale lớn rồi “giảm” về đúng giá cũ.",
      ] },
      { h: "Cách kiểm chứng trong 1 phút" },
      { p: "Mọi dấu hiệu trên chỉ là nghi ngờ — thứ kết luận được là lịch sử giá. Nhìn biểu đồ giá theo ngày: nếu mức “giảm” hôm nay vẫn nằm trong vùng giá quen thuộc, đó là giảm ảo; nếu nó phá xuống dưới vùng thường ngày, đó mới là deal thật." },
      { list: [
        "🟢 Giá hiện tại ≈ thấp nhất lịch sử → deal thật.",
        "🟡 Thấp hơn trung bình chút ít → giá tốt.",
        "🔴 Bằng/cao hơn trung bình nhưng treo biển giảm sâu → giảm ảo.",
      ] },
      { p: "Soi Giá lưu lại giá từng ngày cho mỹ phẩm Shopee, nên bạn không cần nhớ giá cũ — chỉ cần nhìn biểu đồ. Có thể bắt đầu từ các mục như serum, son hay kem chống nắng để đối chiếu nhanh." },
      { h: "Tóm lại" },
      { p: "Đừng tin con số % giảm; hãy tin lịch sử giá. Một phút tra giá giúp bạn tránh trả tiền thật cho một mức “giảm” chỉ có trên giấy." },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
