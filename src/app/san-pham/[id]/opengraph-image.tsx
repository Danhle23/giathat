import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getProduct } from "@/lib/catalog";
import { computeStats, getVerdict, genuineDiscountPct } from "@/lib/pricing";
import { vnd } from "@/lib/format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Giá Thật - thẻ deal";

const COLORS: Record<string, { bg: string; fg: string; label: string }> = {
  REAL_DEAL: { bg: "#ecfdf5", fg: "#059669", label: "DEAL THẬT" },
  GOOD: { bg: "#eff6ff", fg: "#0284c7", label: "GIÁ TỐT" },
  NORMAL: { bg: "#f1f5f9", fg: "#475569", label: "GIÁ BÌNH THƯỜNG" },
  FAKE: { bg: "#fff1f2", fg: "#e11d48", label: "GIẢM GIÁ ẢO" },
};

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

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const fonts = await loadFonts();

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", fontSize: 48, fontFamily: "Be Vietnam Pro" }}>
          Giá Thật
        </div>
      ),
      { ...size, fonts },
    );
  }

  const stats = computeStats(product);
  const verdict = getVerdict(stats);
  const real = genuineDiscountPct(stats);
  const c = COLORS[verdict.kind];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: 64,
          fontFamily: "Be Vietnam Pro",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", width: 56, height: 56, background: "#0066cc", color: "#fff", borderRadius: 14, alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700 }}>
            G
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: "#0f172a" }}>
            <span>Giá</span>
            <span style={{ color: "#0066cc" }}>Thật</span>
          </div>
        </div>

        {/* Verdict pill */}
        <div style={{ display: "flex", marginTop: 48 }}>
          <div style={{ display: "flex", background: c.bg, color: c.fg, fontSize: 30, fontWeight: 700, padding: "12px 28px", borderRadius: 999 }}>
            {c.label}
          </div>
        </div>

        {/* Product name */}
        <div style={{ display: "flex", marginTop: 24, fontSize: 46, fontWeight: 700, color: "#0f172a", lineHeight: 1.2, maxWidth: 1000 }}>
          {product.name}
        </div>

        {/* Price row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, marginTop: "auto" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, color: "#0066cc" }}>
            {vnd(product.currentPrice)}
          </div>
          {product.listedPrice > product.currentPrice && (
            <div style={{ display: "flex", fontSize: 40, color: "#94a3b8", textDecoration: "line-through", paddingBottom: 16 }}>
              {vnd(product.listedPrice)}
            </div>
          )}
        </div>

        <div style={{ display: "flex", marginTop: 16, fontSize: 34, color: verdict.kind === "FAKE" ? "#e11d48" : "#059669", fontWeight: 700 }}>
          {real > 0 ? `Rẻ hơn thật ${real}% so với giá thường ngày` : "Không rẻ hơn giá thường ngày!"}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
