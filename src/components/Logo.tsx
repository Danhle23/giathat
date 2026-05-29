/**
 * Brand logo: a price line dipping down into a verified "check" data point,
 * inside a gradient badge — "giá giảm thật, đã kiểm chứng".
 */
export function Logo({
  size = 34,
  withText = true,
  className = "",
}: {
  size?: number;
  withText?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="gt-badge" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ee4d2d" />
            <stop offset="1" stopColor="#ff9a3c" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="36" height="36" rx="11" fill="url(#gt-badge)" />
        <path
          d="M10 18.5 L15 22.5 L19 25.5 L29.5 12"
          stroke="#fff"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="29.5" cy="12" r="2.7" fill="#fff" />
      </svg>
      {withText && (
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          Giá
          <span className="bg-gradient-to-r from-[#ee4d2d] to-amber-500 bg-clip-text text-transparent">
            Thật
          </span>
        </span>
      )}
    </span>
  );
}
