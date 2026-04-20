"use client";

import Image from "next/image";
import { useState } from "react";

const FALLBACK = "/images/brand/cover-art.png";

export default function EpisodeImage({
  src,
  alt,
  fill,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      onError={() => setImgSrc(FALLBACK)}
    />
  );
}
