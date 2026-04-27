"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Music, Headphones } from "lucide-react";

const navLinks = [
  { href: "/", label: "Forsíða", exact: true },
  { href: "/thaettir", label: "Þættir" },
  { href: "/thattastjornendur", label: "Þáttastjórnendur" },
  { href: "/samband", label: "Hafa samband", exact: true },
];

function YoutubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z" />
    </svg>
  );
}

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

const platformLinks = [
  { href: "https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO", label: "Spotify", icon: Music },
  { href: "https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624", label: "Apple Podcasts", icon: Headphones },
  { href: "https://www.youtube.com/@chessafterdark7953", label: "YouTube", icon: YoutubeIcon },
  { href: "https://www.instagram.com/chessafterdark/", label: "Instagram", icon: InstagramIcon },
];

function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link
      href="/"
      className="flex items-center group"
      aria-label="Chess After Dark heim"
    >
      <Image
        src="/images/logos/cad-logo-blue.png"
        alt="Chess After Dark"
        width={180}
        height={48}
        priority
        className={`${small ? "h-8" : "h-10"} w-auto transition-opacity group-hover:opacity-80`}
      />
    </Link>
  );
}

export default function Header({ episodeCount }: { episodeCount?: number }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      setScrolled(window.scrollY > 20);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    // Set initial state via rAF (handles page loads mid-scroll)
    window.requestAnimationFrame(update);

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  // Close menu on route change
  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      window.requestAnimationFrame(() => setIsOpen(false));
    }
  }, [pathname]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="fixed top-0 left-0 z-[60] bg-cad-electric text-white px-4 py-2 text-sm font-medium rounded-br-lg -translate-y-full focus:translate-y-0 transition-transform"
      >
        Fara í efni
      </a>

      {/* ── Desktop header ── */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out border-b ${
          scrolled
            ? "bg-cad-dark/85 backdrop-blur-md border-cad-electric/10 shadow-lg shadow-cad-dark/20"
            : "bg-transparent border-white/5"
        }`}
        style={{ willChange: "background-color, backdrop-filter" }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
          {/* Left — Logo */}
          <Logo />

          {/* Center — Navigation */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-[13px] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark ${
                    active
                      ? "bg-white/[0.08] text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-cad-electric rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right — CTA */}
          <Link
            href="/thaettir"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-cad-electric text-white rounded-[10px] text-[13px] font-medium hover:bg-cad-blue hover:-translate-y-px transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark"
          >
            <svg
              viewBox="0 0 12 14"
              fill="currentColor"
              className="w-[10px] h-[12px]"
            >
              <path d="M0 0v14l12-7z" />
            </svg>
            Hlusta
          </Link>
        </div>
      </header>

      {/* ── Mobile header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[18px] h-16 bg-[rgba(10,20,40,0.9)] backdrop-blur-xl border-b border-white/[0.06]">
        <Logo small />

        <div className="flex items-center gap-2">
          {/* Play button */}
          <Link
            href="/thaettir"
            className="w-9 h-9 flex items-center justify-center bg-cad-electric rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark"
            aria-label="Hlusta á þætti"
          >
            <svg
              viewBox="0 0 12 14"
              fill="currentColor"
              className="w-[10px] h-[12px]"
            >
              <path d="M0 0v14l12-7z" />
            </svg>
          </Link>

          {/* Menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark ${
              isOpen
                ? "bg-cad-electric/15 border-cad-electric/40 text-white"
                : "bg-white/[0.06] border-white/10 text-white"
            }`}
            aria-label={isOpen ? "Loka valmynd" : "Opna valmynd"}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M1 1l12 12M1 13L13 1" />
              </svg>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="block w-3.5 h-[1.5px] bg-white rounded-full" />
                <span className="block w-3.5 h-[1.5px] bg-white rounded-full" />
              </div>
            )}
          </button>
        </div>
      </header>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            className="lg:hidden fixed inset-0 z-50 flex flex-col bg-[rgba(10,20,40,0.98)] backdrop-blur-[30px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between px-[18px] h-16 border-b border-white/[0.06]">
              <Logo small />
              <div className="flex items-center gap-2">
                <Link
                  href="/thaettir"
                  className="w-9 h-9 flex items-center justify-center bg-cad-electric rounded-lg text-white"
                  aria-label="Hlusta á þætti"
                  onClick={() => setIsOpen(false)}
                >
                  <svg
                    viewBox="0 0 12 14"
                    fill="currentColor"
                    className="w-[10px] h-[12px]"
                  >
                    <path d="M0 0v14l12-7z" />
                  </svg>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-cad-electric/15 border border-cad-electric/40 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark"
                  aria-label="Loka valmynd"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M1 1l12 12M1 13L13 1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nav list */}
            <nav className="px-5 py-5 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const active = isActive(link.href, link.exact);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] transition-all duration-200 ${
                        active
                          ? "bg-cad-electric/[0.12] border border-cad-electric/30 text-white font-medium"
                          : "text-white/75 hover:bg-white/[0.05] border border-transparent"
                      }`}
                      style={{
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      <span className="flex items-center gap-3">
                        {link.label}
                        {link.href === "/thaettir" && episodeCount && (
                          <span className="text-white/30 text-xs">{episodeCount}</span>
                        )}
                      </span>
                      {active && (
                        <svg
                          width="6"
                          height="10"
                          viewBox="0 0 6 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-cad-light"
                        >
                          <path d="M1 1l4 4-4 4" />
                        </svg>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Platform links */}
            <motion.div
              className="px-5 pt-5 border-t border-white/[0.08]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <p className="text-white/40 text-[10px] tracking-widest mb-2.5 uppercase">
                Hlustaðu
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {platformLinks.map((p) => (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square flex items-center justify-center bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/70 hover:bg-white/[0.08] transition-colors"
                    aria-label={p.label}
                  >
                    <p.icon size={14} />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
