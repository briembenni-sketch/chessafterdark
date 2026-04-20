import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Þáttastjórnendur — Chess After Dark",
  description:
    "Kynntu þér Birki Karl Sigurðsson og Leif Þorsteinsson, stjórnendur eitt vinsælasta hlaðvarp Íslands.",
  openGraph: {
    title: "Þáttastjórnendur Chess After Dark",
    description:
      "Birkir Karl og Leifur — stjórnendur Chess After Dark síðan 2019",
    images: ["/images/hosts/both-blue.png"],
  },
};

export default function ThattastjornendurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
