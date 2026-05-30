/** Brand logo — Apple-clean: a single-blue mark + quiet wordmark. */
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
        <path
          d="M10 14 L17 20 L22 16.5 L29 24"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M29 24 L23.5 24 M29 24 L29 18.5"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className="text-[19px] font-semibold tracking-tight text-[#1d1d1f]">
          Giá<span className="text-[#0066cc]">Thật</span>
        </span>
      )}
    </span>
  );
}
