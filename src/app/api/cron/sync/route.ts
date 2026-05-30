import { NextResponse } from "next/server";
import { syncDatafeed } from "@/lib/sync";
import { isDbConfigured } from "@/lib/db";
import { isAccessTradeConfigured } from "@/lib/accesstrade";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily sync: AccessTrade datafeed -> Postgres. Protected by CRON_SECRET
 * (Vercel Cron sends it automatically; also accepts ?secret= for manual runs).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    const qs = new URL(req.url).searchParams.get("secret");
    if (auth !== `Bearer ${secret}` && qs !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL chưa cấu hình" }, { status: 400 });
  }
  if (!isAccessTradeConfigured()) {
    return NextResponse.json({ ok: false, error: "AccessTrade chưa cấu hình" }, { status: 400 });
  }

  try {
    const result = await syncDatafeed();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
