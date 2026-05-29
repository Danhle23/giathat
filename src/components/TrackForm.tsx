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
        className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#ee4d2d]"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-[#ee4d2d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d63e1f] disabled:opacity-60"
      >
        {status === "loading" ? "Đang xử lý…" : "Bắt đầu theo dõi giá"}
      </button>
      {status === "done" && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</p>
      )}
    </form>
  );
}
