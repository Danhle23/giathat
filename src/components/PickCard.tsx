import type { Pick } from "@/lib/picks";
import { vnd } from "@/lib/format";

/**
 * Thẻ "sản phẩm tuyển chọn" — bấm là sang thẳng Shopee qua link affiliate
 * thật (ăn hoa hồng). Khác ProductCard (trỏ vào trang chi tiết /san-pham),
 * thẻ này là CTA mua trực tiếp. Giữ style Apple-light: thẻ trắng viền mảnh
 * bo 18px, accent xanh #0066cc.
 */
export function PickCard({ pick }: { pick: Pick }) {
  const off =
    pick.listedPrice && pick.listedPrice > pick.price
      ? Math.round((1 - pick.price / pick.listedPrice) * 100)
      : 0;

  return (
    <a
      href={pick.affLink}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="group flex flex-col overflow-hidden rounded-[18px] border border-black/[0.08] bg-white transition duration-200 hover:border-black/[0.16] active:scale-[0.99]"
    >
      <div className="relative grid aspect-square place-items-center bg-[#f5f5f7] text-6xl">
        <span>{pick.emoji}</span>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
            −{off}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <p className="text-[12px] font-medium text-[#86868b]">{pick.category}</p>
        <h3 className="mt-0.5 line-clamp-2 text-[14px] font-semibold leading-snug text-[#1d1d1f]">
          {pick.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[12px] leading-relaxed text-[#6e6e73]">
          {pick.note}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-[17px] font-semibold text-[#1d1d1f]">{vnd(pick.price)}</span>
          {pick.listedPrice && pick.listedPrice > pick.price && (
            <span className="text-[12px] text-[#86868b] line-through">{vnd(pick.listedPrice)}</span>
          )}
        </div>
        <span className="mt-2 inline-block rounded-full bg-[#0066cc] px-3 py-1.5 text-center text-[13px] font-medium text-white">
          Mua trên Shopee ›
        </span>
      </div>
    </a>
  );
}
