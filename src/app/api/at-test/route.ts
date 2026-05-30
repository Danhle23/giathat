import { NextResponse } from "next/server";
import { fetchDatafeed, isAccessTradeConfigured } from "@/lib/accesstrade";

export const dynamic = "force-dynamic";

/**
 * Quick health check for the AccessTrade integration.
 * Open /api/at-test after setting ACCESSTRADE_API_KEY + ACCESSTRADE_CAMPAIGN.
 * Returns a few sample products (proves the key + campaign work). Never
 * exposes the API key.
 */
export async function GET() {
  if (!isAccessTradeConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Chưa cấu hình ACCESSTRADE_API_KEY / ACCESSTRADE_CAMPAIGN trên Vercel" },
      { status: 400 },
    );
  }

  try {
    const { items, total } = await fetchDatafeed({ limit: 5 });
    return NextResponse.json({
      ok: true,
      total,
      count: items.length,
      sample: items.slice(0, 3).map((it) => ({
        name: it.name,
        price: it.price,
        discount: it.discount,
        image: it.image,
        has_aff_link: Boolean(it.aff_link),
      })),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
