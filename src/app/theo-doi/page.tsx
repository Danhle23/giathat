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
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="dot-grid absolute inset-0 opacity-50" />
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />
          <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-[#ee4d2d]/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-2xl px-4 py-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ee4d2d]/20 bg-white/70 px-3 py-1 text-xs font-semibold text-[#ee4d2d] backdrop-blur">
            🔔 Cảnh báo giảm giá thật
          </span>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Theo dõi giá sản phẩm bạn muốn mua
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-slate-500">
            Dán link Shopee bất kỳ. Giá Thật ghi lại giá mỗi ngày, dựng biểu đồ và
            <b> báo bạn khi có giảm giá thật</b> (không tính giảm ảo).
          </p>

          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-lg shadow-slate-200/50">
            <TrackForm />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map(([icon, title, desc]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm"
            >
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#ee4d2d]/10 to-amber-100 text-2xl">
                {icon}
              </div>
              <p className="mt-3 font-semibold text-slate-800">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
