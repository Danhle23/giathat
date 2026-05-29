"use client";

import { useState } from "react";

/**
 * Fills its (relative) parent with the product photo, falling back to an
 * emoji-on-gradient tile if the image fails to load. Keep the parent
 * `relative overflow-hidden`.
 */
export function ProductImage({
  src,
  alt,
  emoji,
  gradient,
}: {
  src: string;
  alt: string;
  emoji: string;
  gradient: string; // e.g. "from-indigo-100 to-sky-100"
}) {
  const [ok, setOk] = useState(true);

  return (
    <>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient} text-5xl`}
      >
        {!ok && <span aria-hidden>{emoji}</span>}
      </div>
      {ok && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </>
  );
}
