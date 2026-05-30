"use client";

import { useState } from "react";

export function AlertForm({ productId }: { productId: string }) {
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          email,
          targetPrice: Number(target.replace(/\D/g, "")) || 0,
        }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[14px] text-emerald-800">
        ✅ Đã đăng ký! Chúng tôi sẽ email cho bạn ngay khi có <b>đợt giảm giá thật</b>.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <p className="text-[14px] text-[#6e6e73]">
        🔔 Nhận email khi sản phẩm này <b className="text-[#1d1d1f]">giảm giá thật</b> (không tính giảm ảo):
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email của bạn"
        className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[14px] text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:border-[#0066cc]"
      />
      <input
        inputMode="numeric"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Giá mong muốn (VND) — để trống nếu cần báo mọi đợt giảm"
        className="rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[14px] text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:border-[#0066cc]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[#0066cc] px-4 py-2.5 text-[14px] font-medium text-white transition active:scale-95 disabled:opacity-60"
      >
        {status === "loading" ? "Đang đăng ký…" : "Đăng ký cảnh báo giá"}
      </button>
      {status === "error" && (
        <p className="text-xs text-rose-600">Có lỗi xảy ra, thử lại nhé.</p>
      )}
    </form>
  );
}
