import type { Metadata } from "next";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Theo dõi giá sản phẩm Shopee",
  description: "Dán link Shopee để theo dõi lịch sử giá và nhận cảnh báo khi giảm giá thật.",
};

const FEATURES = [
  ["📌", "Lưu lịch sử giá", "Biết giá thật sự thay đổi thế nào theo thời gian."],
  ["🕵️", "Bóc giảm giá ảo", "Phát hiện chiêu nâng giá rồi gắn mác giảm sốc."],
  ["🔔", "Cảnh báo đúng lúc", "Chỉ báo khi giá xuống thật — không làm phiền vô ích."],
];

export default function TrackPage() {
  return (
    <div>
      {/* Header band */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="dot-grid-light absolute inset-0 opacity-60" />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl" />
          <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[#8b5cf6]/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-violet-300 backdrop-blur">
            🔔 Cảnh báo giảm giá thật
          </span>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Theo dõi giá sản phẩm bạn muốn mua
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-slate-400">
            Dán link Shopee bất kỳ. Giá Thật ghi lại giá mỗi ngày, dựng biểu đồ và
            <b className="text-white"> báo bạn khi có giảm giá thật</b> (không tính giảm ảo).
          </p>

          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-left shadow-2xl shadow-black/40 backdrop-blur">
            <TrackForm />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(([icon, title, desc]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#8b5cf6]/25 to-indigo-500/10 text-2xl">
                {icon}
              </div>
              <p className="mt-3 font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
