import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure the Be Vietnam Pro fonts used by the dynamic OG "deal card" are
  // bundled into the serverless function on Vercel (they are read via fs).
  outputFileTracingIncludes: {
    "/san-pham/[id]/opengraph-image": ["./src/app/_fonts/**"],
  },
};

export default nextConfig;
