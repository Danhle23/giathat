import { NextResponse } from "next/server";
import { postDealsToThreads } from "@/lib/threads";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily job (Vercel Cron) that posts genuine deals to Threads (Meta).
 *
 * Security: if CRON_SECRET is set, the request must carry it either as
 * `Authorization: Bearer <CRON_SECRET>` (Vercel Cron does this automatically)
 * or `?secret=<CRON_SECRET>` (handy for a manual test in the browser).
 *
 * Stays silent until THREADS_ENABLED=true — so this is safe to deploy now.
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

  const result = await postDealsToThreads();
  return NextResponse.json(result);
}
