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
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
        ✅ Đã đăng ký! Chúng tôi sẽ email cho bạn ngay khi có <b>đợt giảm giá thật</b>.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <p className="text-sm text-slate-300">
        🔔 Nhận email khi sản phẩm này <b className="text-white">giảm giá thật</b> (không tính giảm ảo):
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email của bạn"
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#ee4d2d]"
      />
      <input
        inputMode="numeric"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Giá mong muốn (VND) — để trống nếu cần báo mọi đợt giảm"
        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#ee4d2d]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:opacity-60"
      >
        {status === "loading" ? "Đang đăng ký…" : "Đăng ký cảnh báo giá"}
      </button>
      {status === "error" && (
        <p className="text-xs text-rose-400">Có lỗi xảy ra, thử lại nhé.</p>
      )}
    </form>
  );
}
