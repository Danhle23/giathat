import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { ARTICLES } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import { getBrandsInCatalog } from "@/lib/brands";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getAllProducts();
  const staticRoutes = ["", "/theo-doi", "/tim-kiem", "/bai-viet"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/danh-muc/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Only brands that actually have products — never expose empty brand pages.
  const brandRoutes = getBrandsInCatalog(products).map(({ brand }) => ({
    url: `${SITE_URL}/thuong-hieu/${brand.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/san-pham/${p.id}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const articleRoutes = ARTICLES.map((a) => ({
    url: `${SITE_URL}/bai-viet/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...productRoutes,
    ...articleRoutes,
  ];
}
