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
      <p className="mb-2 text-xs font-semibold text-slate-400">Chia sẻ deal này</p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={nativeShare}
          className="rounded-lg bg-[#8b5cf6] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#7c3aed]"
        >
          ↗ Chia sẻ
        </button>
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-lg ${l.color} px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90`}
          >
            {l.label}
          </a>
        ))}
        <button
          onClick={copy}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
        >
          {copied ? "✓ Đã copy" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
