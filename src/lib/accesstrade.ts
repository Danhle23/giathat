/**
 * AccessTrade Publisher API client.
 *
 * Docs: https://developers.accesstrade.vn  (Authorization: Token <api_key>)
 * The datafeed returns products + prices + image + a ready affiliate link
 * (`aff_link`) — so the catalog can auto-update daily with earning links.
 *
 * Configure via env: ACCESSTRADE_API_KEY, ACCESSTRADE_CAMPAIGN (e.g. "shopee").
 */

const API_BASE = "https://api.accesstrade.vn/v1";

export interface DatafeedItem {
  name: string;
  price: number; // original price
  discount: number; // sale price
  product_id: string;
  sku: string;
  url: string; // original product url
  aff_link: string; // ready-to-use affiliate deep link
  image: string;
  campaign: string;
  cate: string;
  domain: string;
  discount_amount?: number;
  discount_rate?: number;
  status_discount?: number;
}

export function isAccessTradeConfigured(): boolean {
  return Boolean(process.env.ACCESSTRADE_API_KEY && process.env.ACCESSTRADE_CAMPAIGN);
}

export async function fetchDatafeed(
  opts: { limit?: number; page?: number; onlyDiscounted?: boolean } = {},
): Promise<{ items: DatafeedItem[]; total: number }> {
  const key = process.env.ACCESSTRADE_API_KEY;
  const campaign = process.env.ACCESSTRADE_CAMPAIGN;
  if (!key || !campaign) {
    throw new Error("Chưa cấu hình ACCESSTRADE_API_KEY / ACCESSTRADE_CAMPAIGN");
  }

  const params = new URLSearchParams({
    campaign,
    limit: String(opts.limit ?? 20),
    page: String(opts.page ?? 1),
  });
  if (opts.onlyDiscounted) {
    params.set("status_discount", "1"); // only products with an active discount
  }

  const res = await fetch(`${API_BASE}/datafeeds?${params.toString()}`, {
    headers: { Authorization: `Token ${key}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AccessTrade datafeed ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as Record<string, unknown>;
  const items = (json.data ?? json.datafeeds ?? []) as DatafeedItem[];
  const total = Number(json.total ?? items.length);
  return { items, total };
}
