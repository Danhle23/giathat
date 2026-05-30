/**
 * Brand mark — a magnifying glass inspecting a falling price (down-arrow):
 * "soi ra giá thật". Single-blue, clean, distinctive.
 */
export function Logo({
  size = 30,
  withText = true,
  className = "",
}: {
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="36" height="36" rx="10" fill="#0066cc" />
        {/* magnifier lens */}
        <circle cx="17" cy="17" r="8.2" stroke="#fff" strokeWidth="2.4" />
        {/* handle */}
        <path d="M23 23 L29.5 29.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        {/* falling price = down arrow inside the lens */}
        <path
          d="M17 12.5 L17 20 M13.6 16.6 L17 20.2 L20.4 16.6"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className="text-[19px] font-semibold tracking-tight text-[#1d1d1f]">
          Soi<span className="text-[#0066cc]">Giá</span>
        </span>
      )}
    </span>
  );
}
