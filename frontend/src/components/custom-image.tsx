"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  src?: string | null;
  alt: string;
};

const FALLBACK_IMAGE = "/default.png";

export function CustomImage({ src, alt }: Props) {
  const safeSrc = useMemo(() => {
    // Pas de propriété
    if (!src) {
      return FALLBACK_IMAGE;
    }

    // URL vide
    if (src.trim() === "") {
      return FALLBACK_IMAGE;
    }

    // Clearbit cassé
    if (src.includes("logo.clearbit.com")) {
      return FALLBACK_IMAGE;
    }

    return src;
  }, [src]);

  const [imgSrc, setImgSrc] = useState(safeSrc);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={32}
      height={32}
      unoptimized
      className="rounded-md object-cover"
      onError={() => {
        if (imgSrc !== FALLBACK_IMAGE) {
          setImgSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
