import type { Product } from "../types";
import { getAllProducts, getProduct, searchProducts } from "../repository";

/**
 * Adapter boundary between Giá Thật and Shopee.
 *
 * The MVP ships with `MockShopeeProvider` (served from the seed catalog).
 * When the Shopee Affiliate Open Platform credentials are approved, add a
 * `RealShopeeProvider implements ShopeeProvider` that calls the GraphQL API
 * (generateShortLink, productOfferV2, conversionReport, listItemFeeds...) and
 * swap the export at the bottom. Nothing else in the app changes.
 */
export interface ShopeeProvider {
  list(): Promise<Product[]>;
  get(id: string): Promise<Product | undefined>;
  search(query: string): Promise<Product[]>;
  /** Build a trackable affiliate link with a per-user sub-id (CPS tracking). */
  affiliateLink(product: Product, subId?: string): string;
}

const AFFILIATE_ID = process.env.SHOPEE_AFFILIATE_ID ?? "giathat";

class MockShopeeProvider implements ShopeeProvider {
  async list() {
    return getAllProducts();
  }
  async get(id: string) {
    return getProduct(id);
  }
  async search(query: string) {
    return searchProducts(query);
  }
  affiliateLink(product: Product, subId = "web") {
    // Mirrors the shape of a real Shopee affiliate short link: deep link to the
    // product carrying the affiliate id + sub-ids used to attribute commission.
    // Using URL keeps it valid even when product.url already has a query string.
    const url = new URL(product.url);
    url.searchParams.set("utm_source", "affiliates");
    url.searchParams.set("utm_medium", "giathat");
    url.searchParams.set("utm_campaign", AFFILIATE_ID);
    url.searchParams.set("af_sub1", subId);
    url.searchParams.set("af_sub2", product.id);
    return url.toString();
  }
}

export const shopee: ShopeeProvider = new MockShopeeProvider();
