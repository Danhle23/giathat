"use client";

import { useState } from "react";

export function TrackForm() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message ?? "Link không hợp lệ.");
      }
    } catch {
      setStatus("error");
      setMessage("Có lỗi xảy ra, thử lại nhé.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Dán link sản phẩm Shopee vào đây…"
        className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-[#1d1d1f] outline-none placeholder:text-[#86868b] focus:border-[#0066cc]"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-[#0066cc] px-4 py-3 text-[15px] font-medium text-white transition active:scale-[0.98] disabled:opacity-60"
      >
        {status === "loading" ? "Đang xử lý…" : "Bắt đầu theo dõi giá"}
      </button>
      {status === "done" && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-[14px] text-emerald-800">{message}</p>
      )}
      {status === "error" && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[14px] text-rose-700">{message}</p>
      )}
    </form>
  );
}
