"use client";

import { useState } from "react";

/** Share the current product link to social + copy. Spreads your affiliate reach. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: "Facebook", color: "bg-[#1877f2]", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "Telegram", color: "bg-[#229ed9]", href: `https://t.me/share/url?url=${u}&text=${t}` },
    { label: "X", color: "bg-black", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copy();
    }
  }

  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-[#6e6e73]">Chia sẻ</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={nativeShare}
          className="rounded-full bg-[#0066cc] px-3 py-1.5 text-[12px] font-medium text-white transition active:scale-95"
        >
          ↗ Chia sẻ
        </button>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full ${l.color} px-3 py-1.5 text-[12px] font-medium text-white transition active:scale-95`}
          >
            {l.label}
          </a>
        ))}
        <button
          onClick={copy}
          className="rounded-full border border-black/15 px-3 py-1.5 text-[12px] font-medium text-[#1d1d1f] transition hover:bg-[#f5f5f7]"
        >
          {copied ? "✓ Đã copy" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
