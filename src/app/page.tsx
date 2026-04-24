import Link from "next/link";
import Image from "next/image";
import { fetchEpisodes } from "@/lib/rss";
import { CATEGORIES, CATEGORY_ORDER, countByCategory } from "@/lib/categorization";
import { Play, Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react";
import {
  SiSpotify, SiApplepodcasts, SiYoutube, SiTwitch, SiInstagram,
} from "react-icons/si";
import EpisodeImage from "@/components/EpisodeImage";
import HeroSection from "@/components/HeroSection";
import AnimatedSection from "@/components/AnimatedSection";
import { events } from "@/data/events";

export const revalidate = 3600;

const cardGradients = [
  "from-[#1e5fb5] to-[#0f2a5c]",
  "from-[#1a4f9e] to-[#0d2248]",
  "from-[#2168b8] to-[#112e5a]",
  "from-[#1856a5] to-[#0b1e42]",
  "from-[#1e5fb5] to-[#0a1a3d]",
  "from-[#1d5aad] to-[#0e2550]",
];

export default async function Home() {
  const episodes = await fetchEpisodes();
  const latestEpisode = episodes[0];
  const recentEpisodes = episodes.slice(1, 7);

  // Build category counts from the canonical categorization system
  const counts = countByCategory(episodes);
  const categoryCards = CATEGORY_ORDER.map((cat) => ({
    key: cat,
    label: CATEGORIES[cat].label,
    count: counts[cat],
    href: `/thaettir?flokkur=${cat}`,
  }));

  // Find upcoming event within 30 days
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcomingEvent = events.find((e) => {
    const eventDate = new Date(e.date);
    return eventDate >= now && eventDate <= thirtyDaysFromNow;
  });

  return (
    <>
      {/* 1. Hero Section */}
      <HeroSection
        latestEpisodeSlug={latestEpisode.slug}
        episodeCount={episodes.length}
      />

      {/* 2. Social Row */}
      <section className="py-12 border-t border-cad-electric/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-[3px] h-4 bg-cad-electric" />
            <span className="text-[11px] uppercase tracking-widest text-cad-light font-medium">
              Hlustaðu & Fylgdu
            </span>
          </div>
          <div className="flex items-center gap-10 flex-wrap">
            {[
              { name: "Spotify", url: "https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO", Icon: SiSpotify },
              { name: "Apple Podcasts", url: "https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624", Icon: SiApplepodcasts },
              { name: "YouTube", url: "https://www.youtube.com/@chessafterdark7953", Icon: SiYoutube },
              { name: "Twitch", url: "https://twitch.tv/chessafterdark", Icon: SiTwitch },
              { name: "Instagram", url: "https://www.instagram.com/chessafterdark/", Icon: SiInstagram },
            ].map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chess After Dark á ${name}`}
                className="group relative text-cad-light/60 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Icon className="w-7 h-7" />
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-cad-light opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                  {name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Episode (Nýjasti þáttur) */}
      <AnimatedSection className="bg-cad-mid py-20 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-cad-electric rounded-full" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
              Nýjasti þáttur
            </span>
          </div>

          <Link
            href={`/thaettir/${latestEpisode.slug}`}
            aria-label={`Skoða þátt: ${latestEpisode.title}`}
            className="block bg-gradient-to-r from-cad-electric/20 to-transparent p-px rounded-2xl mt-6 group transition-all duration-200 hover:from-cad-electric/30"
          >
            <div className="bg-cad-dark rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="md:w-64 shrink-0">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <EpisodeImage
                    src={latestEpisode.image}
                    alt={latestEpisode.title}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                    #{latestEpisode.number}
                  </span>
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 bg-cad-electric rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-center">
                {latestEpisode.topics.length > 0 && (
                  <span className="text-cad-light text-xs font-medium tracking-[0.2em] uppercase mb-2">
                    {latestEpisode.topics[0]}
                  </span>
                )}
                <h2 className="text-2xl font-medium text-white mb-3 group-hover:text-cad-electric transition-colors">
                  {latestEpisode.title}
                </h2>
                <p className="text-white/75 text-sm leading-relaxed mb-4">
                  {latestEpisode.shortDescription}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-white/50 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(latestEpisode.date).toLocaleDateString("is-IS", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {latestEpisode.duration}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-cad-electric font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Skoða þátt
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </AnimatedSection>

      {/* 4. Categories (Flokkar) */}
      <AnimatedSection className="bg-cad-dark py-20 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="block w-[3px] h-4 bg-cad-electric" />
              <span className="text-[11px] uppercase tracking-widest text-cad-light font-medium">
                Flokkar
              </span>
            </div>
            <h2 className="text-3xl font-medium text-white">
              Skoðaðu eftir efni
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {categoryCards.map((card) => (
              <Link
                key={card.key}
                href={card.href}
                className="group block p-6 rounded-xl bg-cad-mid border border-cad-electric/10 hover:border-cad-electric/40 hover:-translate-y-0.5 hover:bg-cad-mid/80 transition-all"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-lg font-medium text-white group-hover:text-cad-electric transition-colors">
                    {card.label}
                  </h3>
                  <span className="text-2xl font-medium text-cad-light/40 group-hover:text-cad-electric/80 transition-colors tabular-nums">
                    {card.count}
                  </span>
                </div>
                <p className="text-[11px] uppercase tracking-widest text-cad-light/60 font-medium">
                  Þættir
                </p>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 5. Recent Episodes (Nýlegir þættir) */}
      <AnimatedSection className="bg-cad-mid py-20 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-cad-electric rounded-full" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
              Nýlegir þættir
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recentEpisodes.map((ep, idx) => (
              <Link
                key={ep.slug}
                href={`/thaettir/${ep.slug}`}
                aria-label={`Skoða þátt: ${ep.title}`}
                className="group border border-white/10 hover:border-cad-electric/40 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cad-electric/5"
              >
                {/* Thumbnail with play overlay */}
                <div className={`aspect-video relative overflow-hidden bg-gradient-to-br ${cardGradients[idx % cardGradients.length]}`}>
                  <EpisodeImage
                    src={ep.image}
                    alt={ep.title}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Episode pill — top-left */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                    #{ep.number} · {ep.duration}
                  </div>
                  {/* Play button overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-cad-dark fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-cad-dark">
                  {ep.topics.length > 0 && (
                    <span className="text-cad-light text-xs font-medium tracking-[0.2em] uppercase">
                      {ep.topics[0]}
                    </span>
                  )}
                  <h3 className="text-white font-medium mt-1 mb-2 group-hover:text-cad-electric transition-colors">
                    {ep.title}
                  </h3>
                  <p className="text-white/50 text-sm line-clamp-2">{ep.shortDescription}</p>
                  <div className="flex items-center justify-between mt-3">
                    {ep.guest && (
                      <p className="text-cad-light text-xs">
                        Gestur: {ep.guest}
                      </p>
                    )}
                    <span className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-cad-electric font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Skoða þátt
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 6. Upcoming Event Teaser (conditional) */}
      {upcomingEvent && (
        <AnimatedSection className="bg-cad-dark py-20 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-cad-electric rounded-full" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
                Næsti viðburður
              </span>
            </div>

            <Link
              href={`/vidburdir`}
              className="block bg-gradient-to-r from-cad-electric/20 to-transparent p-px rounded-2xl hover:from-cad-electric/30 transition-all"
            >
              <div className="bg-cad-dark rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <span className="text-cad-light text-xs font-medium tracking-[0.2em] uppercase mb-3 block">
                    {upcomingEvent.categoryLabel}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
                    {upcomingEvent.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">
                    {upcomingEvent.shortDescription}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(upcomingEvent.date).toLocaleDateString("is-IS", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    {upcomingEvent.time && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {upcomingEvent.time}
                      </span>
                    )}
                    <span>{upcomingEvent.location}</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-2 bg-cad-electric hover:bg-cad-bright text-white px-6 py-3 rounded-[10px] font-medium transition-colors">
                    Sjá nánar <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </AnimatedSection>
      )}

      {/* 7. Hosts Teaser (Þáttastjórnendur) */}
      <AnimatedSection className="bg-cad-dark py-20 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-cad-electric rounded-full" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
              Þáttastjórnendur
            </span>
          </div>

          <p className="text-white/70 text-lg max-w-2xl mb-10">
            Frá 2019 hafa Birkir Karl og Leifur stjórnað umræðunni um knattspyrnu, pólitík, viðskipti og margt fleira.
          </p>

          {/* Centerpiece: both hosts image */}
          <div className="flex justify-center mb-10">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-0 bg-cad-electric/20 rounded-3xl blur-[40px]" />
              <Image
                src="/images/hosts/both-blue.png"
                alt="Birkir Karl og Leifur Þorsteinsson"
                width={800}
                height={500}
                className="relative rounded-2xl w-full object-cover object-center"
                priority
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "Birkir Karl Sigurðsson", role: "Þáttastjórnandi", image: "/images/hosts/birkir-blue.png" },
              { name: "Leifur Þorsteinsson", role: "Þáttastjórnandi", image: "/images/hosts/leifur-blue.png" },
            ].map((host) => (
              <div
                key={host.name}
                className="flex items-center gap-5 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-200"
              >
                <div className="w-20 h-20 shrink-0 rounded-full overflow-hidden relative">
                  <Image
                    src={host.image}
                    alt={host.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium text-lg">{host.name}</h3>
                  <p className="text-white/50 text-sm mb-2">{host.role}</p>
                  <Link
                    href="/thattastjornendur"
                    className="text-cad-light text-sm hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    Lesa meira <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* 8. Final CTA Band */}
      <section className="relative overflow-hidden py-20 px-6 border-t border-white/5">
        {/* Subtle background gradient — not solid blue */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,79,254,0.15) 0%, transparent 60%)'
          }}
        />

        {/* Decorative blurred blue orbs */}
        <div
          className="absolute top-[-100px] left-[10%] w-[400px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,79,254,0.25) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        <div
          className="absolute bottom-[-100px] right-[10%] w-[400px] h-[400px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0,79,254,0.2) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />

        {/* Content */}
        <div className="relative max-w-[680px] mx-auto text-center z-10">
          <div className="text-cad-light text-xs tracking-[0.3em] mb-4">
            BYRJAÐU AÐ HLUSTA
          </div>
          <h3 className="text-4xl md:text-5xl font-medium mb-5 tracking-tight">
            Yfir {episodes.length} þættir bíða þín
          </h3>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
            Hlaðvarpssafnið er opið og frjálst. Byrjaðu að hlusta í dag.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href={`/thaettir/${latestEpisode.slug}`}
              className="bg-cad-electric hover:bg-cad-blue text-white px-6 py-3.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2.5 group"
            >
              <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-cad-electric text-[10px] group-hover:scale-110 transition-transform">
                ▶
              </span>
              Hlusta núna
            </Link>
            <Link
              href="/thaettir"
              className="bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white px-6 py-3.5 rounded-xl text-sm transition-all"
            >
              Skoða alla þætti
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
