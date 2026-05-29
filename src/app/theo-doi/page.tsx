import type { Metadata } from "next";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Theo dõi giá sản phẩm Shopee",
  description: "Dán link Shopee để theo dõi lịch sử giá và nhận cảnh báo khi giảm giá thật.",
};

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Theo dõi giá sản phẩm</h1>
      <p className="mt-2 text-slate-600">
        Dán link bất kỳ sản phẩm Shopee. Giá Thật sẽ ghi lại giá mỗi ngày, dựng
        biểu đồ lịch sử và <b>báo bạn khi có giảm giá thật</b> (không tính giảm ảo).
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <TrackForm />
      </div>

      <div className="mt-8 grid gap-3 text-sm text-slate-600">
        {[
          ["📌", "Lưu lịch sử giá", "Biết giá thật sự thay đổi thế nào theo thời gian."],
          ["🕵️", "Bóc giảm giá ảo", "Phát hiện chiêu nâng giá rồi gắn mác giảm sốc."],
          ["🔔", "Cảnh báo đúng lúc", "Chỉ báo khi giá xuống thật — không làm phiền vô ích."],
        ].map(([icon, title, desc]) => (
          <div key={title} className="flex gap-3 rounded-lg bg-white p-3 ring-1 ring-slate-100">
            <span className="text-xl">{icon}</span>
            <div>
              <p className="font-semibold text-slate-800">{title}</p>
              <p className="text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
