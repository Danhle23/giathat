import type { VerdictKind } from "@/lib/types";

const STYLES: Record<VerdictKind, { bg: string; text: string; dot: string; icon: string }> = {
  REAL_DEAL: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: "✅" },
  GOOD: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500", icon: "👍" },
  NORMAL: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400", icon: "➖" },
  FAKE: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500", icon: "⚠️" },
};

export function VerdictBadge({
  kind,
  label,
  size = "sm",
}: {
  kind: VerdictKind;
  label: string;
  size?: "sm" | "lg";
}) {
  const s = STYLES[kind];
  const pad = size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-1 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${s.bg} ${s.text} ${pad}`}
    >
      <span aria-hidden>{s.icon}</span>
      {label}
    </span>
  );
}
