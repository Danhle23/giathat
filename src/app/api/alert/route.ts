import { NextResponse } from "next/server";
import { addAlert, getProduct } from "@/lib/repository";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.productId) {
    return NextResponse.json({ message: "Thiếu thông tin." }, { status: 400 });
  }
  if (!getProduct(body.productId)) {
    return NextResponse.json({ message: "Không tìm thấy sản phẩm." }, { status: 404 });
  }

  const alert = addAlert({
    productId: body.productId,
    email: String(body.email),
    targetPrice: Number(body.targetPrice) || 0,
  });

  // TODO: when real: enqueue confirmation email + register price-watch job.
  return NextResponse.json({ ok: true, id: alert.id });
}
