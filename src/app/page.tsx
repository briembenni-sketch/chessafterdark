import Link from "next/link";
import Image from "next/image";
import { fetchEpisodes } from "@/lib/rss";
import { Music, Apple, MonitorPlay, Tv, Play, Calendar, Clock, ArrowRight } from "lucide-react";
import EpisodeImage from "@/components/EpisodeImage";

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
    { emoji: "⚽", name: "Knattspyrna", count: topicCounts["Knattspyrna"] || 0 },
    { emoji: "🏛️", name: "Pólitík", count: topicCounts["Pólitík"] || 0 },
    { emoji: "💼", name: "Viðskipti", count: topicCounts["Viðskipti"] || 0 },
    { emoji: "♟️", name: "Skák", count: topicCounts["Skák"] || 0 },
  ];

  return (
    <>
      {/* Hero Section — Split Layout */}
      <section
        className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(0,79,254,0.15), #0a1428 60%)",
        }}
      >
        {/* Decorative blurred circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-cad-bright/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cad-blue/8 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
            {/* Left: Text */}
            <div className="flex-1 text-center md:text-left">
              {/* Live pill badge */}
              <div className="animate-fade-in-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-dot" />
                <span className="text-white/80 text-xs tracking-widest uppercase font-medium">
                  Í beinni á fimmtudagskvöldum
                </span>
              </div>

              {/* Title */}
              <h1 className="animate-fade-in-up-delay-1 text-5xl md:text-7xl font-medium text-white mb-4">
                Chess After Dark
              </h1>

              {/* Subtitle */}
              <p className="animate-fade-in-up-delay-2 text-cad-light text-xs md:text-sm tracking-[0.3em] uppercase mb-4">
                EKKERT BORÐFAST
              </p>

              {/* Description */}
              <p className="animate-fade-in-up-delay-2 text-muted text-lg md:text-xl max-w-lg mb-8">
                Hlaðvarp um knattspyrnu, fjármál, pólitík og margt fleira
              </p>

              {/* CTAs */}
              <div className="animate-fade-in-up-delay-3 flex flex-wrap justify-center md:justify-start gap-4">
                <Link
                  href={`/thaettir/${latestEpisode.slug}`}
                  className="inline-flex items-center gap-2 bg-cad-electric hover:bg-cad-bright text-white px-6 py-3 rounded-xl transition-colors font-medium"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Hlusta á nýjasta þátt
                </Link>
                <Link
                  href="/thaettir"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Allir þættir
                </Link>
              </div>
            </div>

            {/* Right: Cover Art */}
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="relative">
                {/* Blue glow behind image */}
                <div className="absolute inset-0 bg-cad-electric/30 rounded-3xl blur-[60px] scale-90" />
                <Image
                  src="/images/brand/cover-art.png"
                  alt="Chess After Dark cover art"
                  width={480}
                  height={480}
                  className="relative rounded-2xl animate-float w-72 md:w-96"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up-delay-4 flex flex-wrap justify-center md:justify-start items-center gap-6 md:gap-0 text-white/60 text-sm mt-12">
            <span className="font-semibold text-white">{episodes.length}+</span>
            <span className="ml-1">þættir</span>
            <span className="hidden md:inline mx-6 text-white/20">|</span>
            <span className="font-semibold text-white">5M+</span>
            <span className="ml-1">spilanir</span>
            <span className="hidden md:inline mx-6 text-white/20">|</span>
            <span className="font-semibold text-white">2019</span>
            <span className="ml-1">síðan</span>
          </div>
        </div>
      </section>

      {/* Nýjasti þáttur Section */}
      <section className="bg-cad-mid py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-cad-electric rounded-full" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Nýjasti þáttur
            </span>
          </div>

          <div className="bg-gradient-to-r from-cad-electric/20 to-transparent p-px rounded-2xl">
            <div className="bg-cad-dark rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="md:w-64 shrink-0">
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  <EpisodeImage
                    src={latestEpisode.image}
                    alt={latestEpisode.title}
                    fill
                    className="object-cover object-center"
                  />
                  <span className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg font-medium">
                    #{latestEpisode.number}
                  </span>
                  <Link
                    href={`/thaettir/${latestEpisode.slug}`}
                    className="absolute bottom-3 right-3 w-12 h-12 bg-cad-electric hover:bg-cad-bright rounded-full flex items-center justify-center transition-colors"
                  >
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  </Link>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-center">
                {latestEpisode.topics.length > 0 && (
                  <span className="text-cad-light text-xs font-semibold tracking-widest uppercase mb-2">
                    {latestEpisode.topics[0]}
                  </span>
                )}
                <h2 className="text-2xl font-semibold text-white mb-3">
                  {latestEpisode.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  {latestEpisode.shortDescription}
                </p>
                <div className="flex items-center gap-4 text-muted text-sm">
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
      </section>

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
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-5 py-2.5 rounded-full transition-all text-sm"
              >
                <platform.icon className="w-4 h-4" />
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Flokkar Section */}
      <section className="bg-cad-dark py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-cad-electric rounded-full" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Flokkar
            </span>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-8 ml-4">
            Skoðaðu eftir efni
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="bg-cad-electric/10 border border-cad-electric/30 hover:bg-cad-electric/20 rounded-2xl p-5 transition-colors cursor-pointer group"
              >
                <span className="text-3xl mb-3 block">{cat.emoji}</span>
                <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
                <p className="text-muted text-sm">{cat.count} þættir</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nýlegir þættir */}
      <section className="bg-cad-mid py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-cad-electric rounded-full" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Nýlegir þættir
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEpisodes.map((ep, idx) => (
              <Link
                key={ep.slug}
                href={`/thaettir/${ep.slug}`}
                className="group border border-white/10 hover:border-cad-electric rounded-2xl overflow-hidden transition-all hover:scale-[1.02]"
              >
                {/* Thumbnail with fallback */}
                <div className={`aspect-video relative overflow-hidden bg-gradient-to-br ${cardGradients[idx % cardGradients.length]}`}>
                  <EpisodeImage
                    src={ep.image}
                    alt={ep.title}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-lg font-medium">
                    #{ep.number} · {ep.duration}
                  </div>
                </div>

                <div className="p-5 bg-cad-dark">
                  {ep.topics.length > 0 && (
                    <span className="text-cad-light text-xs font-semibold tracking-widest uppercase">
                      {ep.topics[0]}
                    </span>
                  )}
                  <h3 className="text-white font-semibold mt-1 mb-2 group-hover:text-cad-light transition-colors">
                    {ep.title}
                  </h3>
                  <p className="text-muted text-sm line-clamp-2">{ep.shortDescription}</p>
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
      </section>

      {/* Hýslarnir Section */}
      <section className="bg-cad-dark py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-cad-electric rounded-full" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/70">
              Hýslarnir
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
              { name: "Birkir Karl Sigurðsson", role: "Hýsill", image: "/images/hosts/birkir-blue.png" },
              { name: "Leifur Þorsteinsson", role: "Hýsill", image: "/images/hosts/leifur-blue.png" },
            ].map((host) => (
              <div
                key={host.name}
                className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-2xl p-6"
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
                  <h3 className="text-white font-semibold text-lg">{host.name}</h3>
                  <p className="text-muted text-sm mb-2">{host.role}</p>
                  <Link
                    href="/hyslarnir"
                    className="text-cad-light text-sm hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    Lesa meira <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
