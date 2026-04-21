import Link from "next/link";
import Image from "next/image";
import { fetchEpisodes } from "@/lib/rss";
import { Music, Apple, MonitorPlay, Tv, Play, Calendar, Clock, ArrowRight } from "lucide-react";
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
  const recentEpisodes = episodes.slice(0, 6);

  // Build category counts from topics
  const topicCounts: Record<string, number> = {};
  for (const ep of episodes) {
    for (const t of ep.topics) {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    }
  }

  const categories = [
    { emoji: "⚽", name: "Knattspyrna", slug: "knattspyrna", count: topicCounts["Knattspyrna"] || 0 },
    { emoji: "🏛️", name: "Pólitík", slug: "politik", count: topicCounts["Pólitík"] || 0 },
    { emoji: "💼", name: "Viðskipti", slug: "vidskipti", count: topicCounts["Viðskipti"] || 0 },
    { emoji: "♟️", name: "Skák", slug: "skak", count: topicCounts["Skák"] || 0 },
  ];

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

      {/* 2. Platform Strip */}
      <section className="py-10" style={{ backgroundColor: "#0f1f3d" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Spotify", icon: Music, href: "https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO" },
              { name: "Apple Podcasts", icon: Apple, href: "https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624" },
              { name: "YouTube", icon: MonitorPlay, href: "https://www.youtube.com/@chessafterdark7953" },
              { name: "Twitch", icon: Tv, href: "https://twitch.tv" },
            ].map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-5 py-2.5 rounded-full transition-all text-sm hover:scale-[1.02]"
              >
                <platform.icon className="w-4 h-4" />
                {platform.name}
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

          <div className="bg-gradient-to-r from-cad-electric/20 to-transparent p-px rounded-2xl mt-6">
            <div className="bg-cad-dark rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="md:w-64 shrink-0">
                <div className="aspect-square rounded-xl overflow-hidden relative group">
                  <EpisodeImage
                    src={latestEpisode.image}
                    alt={latestEpisode.title}
                    fill
                    className="object-cover object-center"
                  />
                  <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                    #{latestEpisode.number}
                  </span>
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link
                      href={`/thaettir/${latestEpisode.slug}`}
                      className="w-12 h-12 bg-cad-electric hover:bg-cad-bright rounded-full flex items-center justify-center transition-colors"
                    >
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-center">
                {latestEpisode.topics.length > 0 && (
                  <span className="text-cad-light text-xs font-medium tracking-[0.2em] uppercase mb-2">
                    ● {latestEpisode.topics[0]}
                  </span>
                )}
                <h2 className="text-2xl font-medium text-white mb-3">
                  {latestEpisode.title}
                </h2>
                <p className="text-white/75 text-sm leading-relaxed mb-4">
                  {latestEpisode.shortDescription}
                </p>
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
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 4. Categories (Flokkar) */}
      <AnimatedSection className="bg-cad-dark py-20 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-cad-electric rounded-full" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
              Flokkar
            </span>
          </div>
          <h2 className="text-2xl font-medium text-white mb-8 ml-4">
            Skoðaðu eftir efni
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/thaettir?flokkur=${cat.slug}`}
                className="bg-cad-electric/10 border border-cad-electric/30 hover:bg-[rgba(0,79,254,0.15)] hover:border-[rgba(0,79,254,0.5)] rounded-2xl p-5 transition-all duration-300 group hover:-translate-y-[2px] focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark focus-visible:outline-none"
              >
                <span className="text-3xl mb-3 block">{cat.emoji}</span>
                <h3 className="text-white font-medium mb-1">{cat.name}</h3>
                <p className="text-white/50 text-sm">{cat.count} þættir</p>
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
                className="group border border-white/10 hover:border-cad-electric/50 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
              >
                {/* Thumbnail with play overlay */}
                <div className={`aspect-video relative overflow-hidden bg-gradient-to-br ${cardGradients[idx % cardGradients.length]}`}>
                  <EpisodeImage
                    src={ep.image}
                    alt={ep.title}
                    fill
                    className="object-cover object-center"
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
                      ● {ep.topics[0]}
                    </span>
                  )}
                  <h3 className="text-white font-medium mt-1 mb-2 group-hover:text-cad-light transition-colors">
                    {ep.title}
                  </h3>
                  <p className="text-white/50 text-sm line-clamp-2">{ep.shortDescription}</p>
                  {ep.guest && (
                    <p className="text-cad-light text-xs mt-3">
                      Gestur: {ep.guest}
                    </p>
                  )}
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
      <section className="bg-cad-electric py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-medium text-white mb-4">
            Yfir {episodes.length} þættir bíða þín
          </h3>
          <p className="text-white/80 text-lg mb-8">
            Hlaðvarps&shy;safnið er opið og frjálst. Byrjaðu að hlusta í dag.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/thaettir"
              className="inline-flex items-center gap-2 bg-white text-cad-electric px-7 py-3.5 rounded-[10px] font-medium hover:bg-white/90 transition-colors hover:scale-[1.02]"
            >
              Skoða alla þætti
            </Link>
            <Link
              href={`/thaettir/${latestEpisode.slug}`}
              className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white px-7 py-3.5 rounded-[10px] font-medium transition-all hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 fill-current" />
              Hlusta núna
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
