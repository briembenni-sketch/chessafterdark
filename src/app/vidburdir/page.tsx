import type { Metadata } from "next";
import { VidburdirContent } from "./VidburdirContent";

export const metadata: Metadata = {
  title: "Viðburðir — Chess After Dark",
  description:
    "Komandi og liðnir viðburðir Chess After Dark — einvígi, upptökur og sérstakir þættir.",
  openGraph: {
    title: "Viðburðir Chess After Dark",
    description: "Frá einvígjum stórmeistara til afmælisþátta.",
    images: ["/images/brand/cover-art.png"],
  },
};

export default function VidburdirPage() {
  return <VidburdirContent />;
}
