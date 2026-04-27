"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const, delay },
  }),
};

export default function HeroSection({
  latestEpisodeSlug,
  episodeCount,
}: {
  latestEpisodeSlug: string;
  episodeCount: number;
}) {
  return (
    <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Background ambience */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(0,79,254,0.2) 0%, transparent 60%)",
          backgroundColor: "#0a1428",
        }}
      />
      {/* Large decorative blurred circle — top right */}
      <div
        className="absolute -top-20 -right-20 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: "radial-gradient(rgba(0,79,254,0.15), transparent)",
          filter: "blur(80px)",
        }}
      />
      {/* Secondary glow — bottom left */}
      <div
        className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none"
        style={{
          background: "radial-gradient(rgba(0,79,254,0.1), transparent)",
          filter: "blur(100px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          {/* Right column (cover art) — shows first on mobile */}
          <motion.div
            className="flex justify-center lg:justify-end order-first lg:order-last"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Blue glow behind image */}
              <div
                className="absolute inset-0 scale-90 rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(rgba(0,79,254,0.35), transparent)",
                  filter: "blur(40px)",
                }}
              />
              <div className="relative">
                <Image
                  src="/images/brand/cover-art.png"
                  alt="Chess After Dark cover art"
                  width={480}
                  height={480}
                  className="relative rounded-[24px] border border-cad-electric/30 w-72 md:w-80 lg:w-96 animate-float"
                  style={{ aspectRatio: "1" }}
                  priority
                />
                {/* Floating pill */}
                <div className="absolute bottom-4 right-4 bg-cad-electric text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                  Þáttur #{episodeCount} nýr
                </div>
              </div>
            </div>
          </motion.div>

          {/* Left column — text content */}
          <div className="text-center lg:text-left order-last lg:order-first">
            {/* Logo image */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="mb-4"
            >
              <Image
                src="/images/logos/cad-logo-white.png"
                alt="Chess After Dark"
                width={500}
                height={180}
                priority
                className="h-auto w-full max-w-[320px] md:max-w-[460px] mb-5 mx-auto lg:mx-0"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="text-cad-light text-sm tracking-[0.2em] uppercase mb-6"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
            >
              EKKERT BORÐFAST
            </motion.p>

            {/* Description */}
            <motion.p
              className="text-white/75 text-lg md:text-xl max-w-lg mb-8 mx-auto lg:mx-0"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              Hlaðvarp um knattspyrnu, fjármál, pólitík og margt fleira.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
            >
              <Link
                href={`/thaettir/${latestEpisodeSlug}`}
                className="group inline-flex items-center gap-3 bg-cad-electric hover:bg-cad-bright text-white px-6 py-3.5 rounded-[10px] transition-all duration-200 font-medium hover:scale-[1.02]"
              >
                <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </span>
                Hlusta á nýjasta þátt
              </Link>
              <Link
                href="/thaettir"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-6 py-3.5 rounded-[10px] transition-all duration-200 hover:scale-[1.02]"
              >
                Allir þættir
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="mt-10 grid grid-cols-3 gap-px bg-cad-electric/15 rounded-lg overflow-hidden max-w-2xl mx-auto lg:mx-0"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
            >
              {[
                { value: `${Math.floor(episodeCount / 10) * 10}+`, label: 'Þættir' },
                { value: '2.5M+', label: 'Spilanir' },
                { value: '1M+', label: 'Klukkutímar hlustaðir' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-cad-dark px-6 py-8 flex flex-col items-center justify-center text-center"
                >
                  <div
                    className="text-4xl sm:text-5xl md:text-6xl font-medium text-white leading-none"
                    style={{
                      fontFeatureSettings: '"tnum" 1, "lnum" 1',
                      fontVariantNumeric: 'tabular-nums lining-nums',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="mt-3 text-[11px] uppercase tracking-widest text-cad-light font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
