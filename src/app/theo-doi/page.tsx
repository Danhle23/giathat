import type { Metadata } from "next";
import { TrackForm } from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Theo dõi giá sản phẩm Shopee",
  description: "Dán link Shopee để theo dõi lịch sử giá và nhận cảnh báo khi giảm giá thật.",
};

const FEATURES = [
  ["📈", "Lưu lịch sử giá", "Biết giá thật sự thay đổi thế nào theo thời gian."],
  ["🕵️", "Bóc giảm giá ảo", "Phát hiện chiêu nâng giá rồi gắn mác giảm sốc."],
  ["🔔", "Cảnh báo đúng lúc", "Chỉ báo khi giá xuống thật — không làm phiền vô ích."],
];

export default function TrackPage() {
  return (
    <div>
      <section className="border-b border-black/5 bg-[#f5f5f7]">
        <div className="mx-auto max-w-2xl px-5 py-16 text-center">
          <h1 className="font-display text-3xl font-semibold text-[#1d1d1f] sm:text-4xl">
            Theo dõi giá sản phẩm bạn muốn mua
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[17px] text-[#6e6e73]">
            Dán link Shopee bất kỳ. Soi Giá ghi lại giá mỗi ngày, dựng biểu đồ và
            <b className="text-[#1d1d1f]"> báo bạn khi có giảm giá thật</b>.
          </p>

          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-black/[0.08] bg-white p-5 text-left">
            <TrackForm />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-5 py-14">
        <div className="grid gap-5 sm:grid-cols-3">
          {FEATURES.map(([icon, title, desc]) => (
            <div key={title} className="rounded-2xl border border-black/[0.08] bg-white p-6 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#f5f5f7] text-2xl">
                {icon}
              </div>
              <p className="mt-4 text-[17px] font-semibold text-[#1d1d1f]">{title}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[#6e6e73]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
