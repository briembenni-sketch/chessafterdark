import Link from "next/link";
import Image from "next/image";
import { fetchEpisodes } from "@/lib/rss";
import { Music, Apple, MonitorPlay, Tv, Play, Calendar, Clock, ArrowRight } from "lucide-react";
import EpisodeImage from "@/components/EpisodeImage";
import HeroSection from "@/components/HeroSection";
import AnimatedSection from "@/components/AnimatedSection";

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

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        latestEpisodeSlug={latestEpisode.slug}
        episodeCount={episodes.length}
      />

      {/* Nýjasti þáttur Section */}
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

      {/* Platform Links */}
      <section className="bg-cad-mid pb-16">
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

      {/* Flokkar Section */}
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

      {/* Nýlegir þættir */}
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

      {/* Þáttastjórnendur Section */}
      <AnimatedSection className="bg-cad-dark py-20 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-cad-electric rounded-full" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/60">
              Þáttastjórnendur
            </span>
          </div>

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
    </>
  );
}
