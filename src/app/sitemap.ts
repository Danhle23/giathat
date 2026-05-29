import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/repository";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/theo-doi", "/tim-kiem"].map((path) => ({
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

  return [...staticRoutes, ...productRoutes];
}
