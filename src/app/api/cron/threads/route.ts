import { NextResponse } from "next/server";
import { postDealsToThreads, postTestThread } from "@/lib/threads";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily job (Vercel Cron) that posts genuine deals to Threads (Meta).
 *
 * Security: if CRON_SECRET is set, the request must carry it either as
 * `Authorization: Bearer <CRON_SECRET>` (Vercel Cron does this automatically)
 * or `?secret=<CRON_SECRET>` (handy for a manual test in the browser).
 *
 * Normal run stays silent until THREADS_ENABLED=true.
 * `?test=1` does ONE safe intro post (homepage link only, no affiliate link)
 * ignoring THREADS_ENABLED — to verify the token works. Still secret-gated.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  if (secret) {
    const auth = req.headers.get("authorization");
    const qs = url.searchParams.get("secret");
    if (auth !== `Bearer ${secret}` && qs !== secret) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const result =
    url.searchParams.get("test") === "1"
      ? await postTestThread()
      : await postDealsToThreads();
  return NextResponse.json(result);
}
