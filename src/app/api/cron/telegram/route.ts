import { NextResponse } from "next/server";
import { postDealsToTelegram } from "@/lib/telegram";

export const dynamic = "force-dynamic";

/**
 * Daily job (Vercel Cron) that posts genuine deals to the Telegram channel.
 *
 * Security: if CRON_SECRET is set, the request must carry it either as
 * `Authorization: Bearer <CRON_SECRET>` (Vercel Cron does this automatically)
 * or `?secret=<CRON_SECRET>` (handy for a manual test in the browser).
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

  const result = await postDealsToTelegram();
  return NextResponse.json(result);
}
