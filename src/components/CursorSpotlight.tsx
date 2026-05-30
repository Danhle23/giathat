"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A soft glow that follows the cursor inside its parent element.
 * Drop it as a direct child of a `relative overflow-hidden` container.
 */
export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent) return;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = parent.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    const onLeave = () => setPos(null);

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
      style={{ opacity: pos ? 1 : 0 }}
    >
      {pos && (
        <div
          className="absolute h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b5cf6]/20 blur-3xl"
          style={{ left: pos.x, top: pos.y }}
        />
      )}
    </div>
  );
}
