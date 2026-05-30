import { NextResponse } from "next/server";
import { getSql, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Health check for the DB after a sync: how many products + a few samples
 * with their price-snapshot counts. Confirms the pipeline end-to-end.
 */
export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL chưa cấu hình" }, { status: 400 });
  }
  try {
    const sql = getSql();
    const [{ count }] = await sql<{ count: number }[]>`SELECT count(*)::int AS count FROM products`;
    const rows = await sql`
      SELECT p.id, p.name, p.current_price, p.listed_price, p.aff_link IS NOT NULL AS has_link,
             (SELECT count(*)::int FROM price_snapshots s WHERE s.product_id = p.id) AS snapshots
      FROM products p
      ORDER BY p.updated_at DESC
      LIMIT 3
    `;
    const cats = await sql`
      SELECT category, count(*)::int AS n FROM products
      GROUP BY category ORDER BY n DESC LIMIT 20
    `;
    return NextResponse.json({ ok: true, products: count, categories: cats, sample: rows });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
