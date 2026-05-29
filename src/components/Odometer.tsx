"use client";

import { useEffect, useRef, useState } from "react";

function Reel({
  digit,
  delayMs,
  duration,
}: {
  digit: number;
  delayMs: number;
  duration: number;
}) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-bottom">
      <span
        className="absolute left-0 top-0 flex flex-col"
        style={{
          transform: `translateY(-${digit * 10}%)`,
          transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          transitionDelay: `${delayMs}ms`,
        }}
      >
        {Array.from({ length: 10 }).map((_, n) => (
          <span key={n} className="flex h-[1em] items-center justify-center leading-none">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

type Part = { ch: string; digit: number | null; delay: number };

/** Pure: split a formatted number into characters with per-digit roll delays. */
function describe(str: string): Part[] {
  const totalDigits = str.replace(/\D/g, "").length;
  let di = -1;
  return str.split("").map((ch) => {
    if (!/\d/.test(ch)) return { ch, digit: null, delay: 0 };
    di += 1;
    return { ch, digit: Number(ch), delay: (totalDigits - 1 - di) * 55 };
  });
}

/** Rolling-digit (odometer) counter that animates 0 → value when in view. */
export function Odometer({
  value,
  className = "",
  duration = 1100,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const parts = describe(value.toLocaleString("vi-VN"));

  return (
    <span ref={ref} className={`inline-flex tabular-nums ${className}`}>
      {parts.map((p, i) =>
        p.digit === null ? (
          <span key={i} className="px-[0.01em]">
            {p.ch}
          </span>
        ) : (
          <Reel key={i} digit={started ? p.digit : 0} delayMs={p.delay} duration={duration} />
        ),
      )}
    </span>
  );
}
