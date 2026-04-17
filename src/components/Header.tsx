"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Forsíða" },
  { href: "/thaettir", label: "Þættir" },
  { href: "/hyslarnir", label: "Hýslarnir" },
  { href: "/vidburdir", label: "Viðburðir" },
  { href: "/samband", label: "Samband" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cad-dark/85 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logos/cad-logo-white.png"
            alt="Chess After Dark"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/55 hover:text-cad-light transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-white/[0.08] px-4 py-3 flex flex-col gap-3 bg-cad-dark/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/55 hover:text-cad-light transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
