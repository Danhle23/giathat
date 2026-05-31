import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { searchProducts } from "@/lib/catalog";
import { getCategory, priceRange } from "@/lib/categories";
import { vnd } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Soi Giá — giá theo danh mục";

async function loadFonts() {
  const dir = join(process.cwd(), "src/app/_fonts");
  const [regular, bold] = await Promise.all([
    readFile(join(dir, "BeVietnamPro-Regular.ttf")),
    readFile(join(dir, "BeVietnamPro-Bold.ttf")),
  ]);
  return [
    { name: "Be Vietnam Pro", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Be Vietnam Pro", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) {
    return new ImageResponse(<div style={{ width: "100%", height: "100%" }} />, size);
  }

  const range = priceRange(await searchProducts(cat.keyword));
  const fontData = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: "64px",
          fontFamily: "Be Vietnam Pro",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: "#0066cc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            ₫
          </div>
          <span style={{ fontSize: "26px", fontWeight: 700, color: "#1d1d1f" }}>Soi Giá</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "#eff6ff",
              color: "#0066cc",
              fontSize: "24px",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            DANH MỤC
          </div>
          <div style={{ fontSize: "68px", fontWeight: 700, color: "#1d1d1f", lineHeight: 1.1 }}>
            Giá {cat.label.toLowerCase()} Shopee
          </div>
          <div style={{ display: "flex", marginTop: "20px", fontSize: "30px", color: "#6e6e73" }}>
            {range
              ? `${range.count} sản phẩm · từ ${vnd(range.low)} · kèm lịch sử giá thật`
              : "Theo dõi lịch sử giá · bắt giảm giá ảo"}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fontData },
  );
}
