import type { Metadata } from "next";
import SambandContent from "./SambandContent";

export const metadata: Metadata = {
  title: "Hafa samband | Chess After Dark",
  description:
    "Hafðu samband við Chess After Dark. Gestabókanir, styrkir, fjölmiðlafyrirspurnir og samfélagsmiðlar.",
  openGraph: {
    title: "Hafa samband | Chess After Dark",
    description: "Tölum saman. Hugmyndir, samstarf, viðtöl.",
    images: ["/images/brand/cover-art.png"],
  },
};

export default function SambandPage() {
  return <SambandContent />;
}
