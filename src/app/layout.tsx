import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Chess After Dark – Skákhlaðvarp",
    template: "%s | Chess After Dark",
  },
  description:
    "Chess After Dark er íslenskt skákhlaðvarp með Birki Karl Sigurðssyni og Leifi Þorsteinssyni. Traust · Heiðarleiki · Gagnsæi.",
  openGraph: {
    type: "website",
    locale: "is_IS",
    siteName: "Chess After Dark",
    title: "Chess After Dark – Skákhlaðvarp",
    description:
      "Íslenskt skákhlaðvarp með Birki Karl og Leifi. Traust · Heiðarleiki · Gagnsæi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chess After Dark – Skákhlaðvarp",
    description:
      "Íslenskt skákhlaðvarp með Birki Karl og Leifi. Traust · Heiðarleiki · Gagnsæi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="is" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
