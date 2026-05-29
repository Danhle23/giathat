import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/repository";
import { ARTICLES } from "@/lib/articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/theo-doi", "/tim-kiem", "/bai-viet"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const productRoutes = getAllProducts().map((p) => ({
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

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
