"use client";

import { useEffect, useState } from "react";

/** Thin gradient bar at the very top that fills as you scroll the page. */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5">
      <div
        className="h-full bg-gradient-to-r from-[#8b5cf6] to-indigo-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
