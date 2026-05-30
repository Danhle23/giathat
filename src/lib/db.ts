import postgres from "postgres";

/**
 * Postgres connection (Neon/Supabase). Lazy singleton.
 * Configure via env: DATABASE_URL (postgresql://...).
 */
let _sql: ReturnType<typeof postgres> | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL chưa cấu hình");
  if (!_sql) {
    _sql = postgres(url, { ssl: "require", max: 1 });
  }
  return _sql;
}

/** Idempotent schema creation. Safe to call before every sync. */
export async function ensureSchema() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            text PRIMARY KEY,
      name          text NOT NULL,
      image         text,
      url           text,
      aff_link      text,
      listed_price  integer NOT NULL,
      current_price integer NOT NULL,
      category      text,
      shop          text,
      discount_rate real,
      updated_at    timestamptz DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS price_snapshots (
      product_id  text NOT NULL,
      price       integer NOT NULL,
      captured_on date NOT NULL,
      PRIMARY KEY (product_id, captured_on)
    )
  `;
}
