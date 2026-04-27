"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

function getHosts(displayCount: number) {
  return [
    {
      name: "Birkir Karl Sigur\ðsson",
      label: "STJ\ÓRNANDI 01",
      role: "STOFNANDI \· \Þ\ÁTTASTJ\ÓRNANDI",
      image: "/images/hosts/birkir-blue.png",
      bio: "Birkir Karl er annar stofnandi Chess After Dark og hefur st\ýrt \þ\ættinum me\ð Leifi fr\á 2019. K\ópavogsb\úi sem starfar \í vi\ðskiptal\ífinu og lifir og hr\ærist \í umr\æ\ðunni um p\ólit\ík, efnahags\ál og \íslenska knattspyrnu. Birkir er \þekktur fyrir \óhr\æddar spurningar og a\ð draga fram hli\ðar \á gestum sem sjaldnast f\ást annars sta\ðar.",
      stats: [
        { value: `${displayCount}+`, label: "\þ\ættir" },
        { value: "2019", label: "s\í\ðan" },
      ],
      social: { instagram: "https://www.instagram.com/chessafterdark/" },
    },
    {
      name: "Leifur \Þorsteinsson",
      label: "STJ\ÓRNANDI 02",
      role: "STOFNANDI \· \Þ\ÁTTASTJ\ÓRNANDI",
      image: "/images/hosts/leifur-blue.png",
      bio: "Leifur stofna\ði Chess After Dark me\ð Birki \ári\ð 2019. Hugmyndin var upphaflega myndhla\ðvarp \þar sem gestir tefldu \á me\ðan \þeir sv\öru\ðu spurningum, enda ekki \á allra manna f\æri a\ð tefla me\ðan \þeir eru spur\ðir spj\örunum \úr. \Í dag starfar Leifur sem vi\ðskiptastj\óri hj\á CreditInfo.",
      stats: [
        { value: `${displayCount}+`, label: "\þ\ættir" },
        { value: "2019", label: "s\í\ðan" },
      ],
      social: { instagram: "https://www.instagram.com/leifmeister13/" },
    },
  ];
}

export default function ThattastjornendurContent({ displayCount }: { displayCount: number }) {
  const hosts = getHosts(displayCount);

  return (
    <div>
      {/* SECTION 1: Hero */}
      <motion.section
        className="py-20 md:py-20 md:pb-15 px-5 md:px-8 text-center"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,79,254,0.15) 0%, #0a1428 60%)",
        }}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-cad-light text-xs tracking-widest uppercase mb-4">
          F\ÓLKI\Ð \Á BAK VI\Ð HLA\ÐVARPI\Ð
        </p>
        <h1 className="text-4xl md:text-5xl font-medium text-white mb-4">
          \Þ\áttastj\órnendur
        </h1>
        <p className="text-white/60 leading-relaxed max-w-[520px] mx-auto">
          Birkir Karl og Leifur hafa st\ýrt Chess After Dark s\í\ðan 2019. Saman
          hafa \þeir byggt upp eitt vins\ælasta hla\ðvarp landsins.
        </p>
      </motion.section>

      {/* SECTION 2: Host Cards */}
      <section className="px-5 md:px-8 py-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {hosts.map((host, idx) => (
            <motion.div
              key={host.name}
              className="bg-cad-mid border border-cad-electric/15 rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-cad-electric/40"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: idx * 0.15,
              }}
            >
              {/* Image */}
              <div className="aspect-square relative overflow-hidden group">
                <Image
                  src={host.image}
                  alt={`${host.name}, \þ\áttastj\órnandi Chess After Dark`}
                  fill
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute top-4 left-4 text-white/30 text-xs tracking-widest">
                  {host.label}
                </span>
              </div>

              {/* Body */}
              <div className="p-6">
                <h2 className="text-2xl font-medium text-white">{host.name}</h2>
                <p className="text-cad-light text-xs tracking-widest mt-1 mb-4">
                  {host.role}
                </p>
                <p className="text-white/65 text-sm leading-relaxed">
                  {host.bio}
                </p>

                {/* Stats */}
                <div className="pt-4 mt-4 border-t border-white/[0.08] flex gap-6">
                  {host.stats.map((stat) => (
                    <div key={stat.label}>
                      <span className="text-lg font-medium text-white block">
                        {stat.value}
                      </span>
                      <span className="text-xs text-white/45">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div className="flex gap-2 mt-3">
                  <a
                    href={host.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${host.name} \á Instagram`}
                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-colors"
                  >
                    <InstagramIcon className="w-4 h-4" />
                  </a>
                  {/* Chess icon */}
                  <span
                    aria-label="Sk\ák"
                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-white/50 text-sm"
                  >
                    \♟
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Um hla\ðvarpi\ð */}
      <motion.section
        className="bg-cad-mid py-16 md:py-20 px-5 md:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="aspect-square relative rounded-[20px] overflow-hidden">
            <Image
              src="/images/hosts/both-blue.png"
              alt="Birkir Karl og Leifur \Þorsteinsson saman"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-cad-light text-xs tracking-widest uppercase mb-3">
              UM HLA\ÐVARPI\Ð
            </p>
            <h2 className="text-2xl md:text-3xl font-medium text-white leading-tight mb-6">
              Fr\á 2019 hafa Birkir og Leifur fengi\ð \áhugaver\ða gesti \í spjall.
            </h2>
            <p className="text-white/70 mb-4 leading-relaxed">
              \Í \þ\áttunum leyfa \þeir gestum a\ð spreyta sig \á sk\ákbor\ðinu me\ðan
              \þeir spyrja \þ\á spj\örunum \úr um knattspyrnu, fj\árm\ál, p\ólit\ík og
              margt fleira.
            </p>
            <p className="text-white/70 mb-6 leading-relaxed">
              Hla\ðvarpi\ð hefur or\ði\ð eitt vins\ælasta \á \Íslandi og drifkraftur \í
              \íslenskri sk\ák.
            </p>
            <span className="inline-block bg-cad-electric/10 border border-cad-electric/30 px-4 py-2 rounded-lg text-cad-light text-xs tracking-widest">
              TRAUST \· HEI\ÐARLEIKI \· GAGNS\ÆI
            </span>
          </div>
        </div>
      </motion.section>

      {/* SECTION 4: CTA */}
      <section className="bg-cad-dark border-t border-white/[0.05] py-12 md:py-12 px-5 md:px-8 text-center">
        <p className="text-cad-light text-xs tracking-widest uppercase mb-3">
          HLUSTA\ÐU
        </p>
        <h3 className="text-2xl font-medium text-white mb-6">
          Tilb\úin a\ð hlusta?
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/thaettir"
            className="bg-cad-electric hover:bg-cad-bright text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          >
            N\ýjasti \þ\áttur
          </Link>
          <Link
            href="/thaettir"
            className="border border-white/20 hover:border-white/40 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors"
          >
            Allir \þ\ættir
          </Link>
        </div>
      </section>
    </div>
  );
}
