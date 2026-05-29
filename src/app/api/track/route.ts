import { NextResponse } from "next/server";
import { addTrackedUrl } from "@/lib/repository";

const SHOPEE_RE = /shopee\.vn\/.+/i;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const url = String(body?.url ?? "").trim();

  if (!SHOPEE_RE.test(url)) {
    return NextResponse.json(
      { message: "Vui lòng dán một link sản phẩm Shopee hợp lệ (shopee.vn/...)." },
      { status: 400 },
    );
  }

  addTrackedUrl(url);

  // In the MVP we only register the URL. The real version resolves the product
  // via the Shopee adapter and starts capturing a daily price snapshot.
  return NextResponse.json({
    ok: true,
    message:
      "✅ Đã ghi nhận! Chúng tôi sẽ bắt đầu theo dõi giá sản phẩm này hằng ngày và cảnh báo khi có giảm giá thật.",
  });
}
