/**
 * Brand logo: a downward price trend with an arrowhead ("giá giảm thật"),
 * inside a circular gradient badge. White wordmark for dark surfaces.
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
            <stop stopColor="#ff8a3d" />
            <stop offset="1" stopColor="#ee4d2d" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#gt-badge)" />
        {/* downward price trend */}
        <path
          d="M10 14 L17 20 L22 16.5 L29 24"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* arrowhead pointing down-right */}
        <path
          d="M29 24 L23.5 24 M29 24 L29 18.5"
          stroke="#fff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withText && (
        <span className="text-lg font-extrabold tracking-tight text-white">
          Giá
          <span className="bg-gradient-to-r from-[#ff8a3d] to-amber-300 bg-clip-text text-transparent">
            Thật
          </span>
        </span>
      )}
    </span>
  );
}
