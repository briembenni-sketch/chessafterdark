import Link from "next/link";
import { episodes } from "@/data/episodes";

export default function Home() {
  const latestEpisode = episodes[0];
  const recentEpisodes = episodes.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-bg-secondary py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-blue-light text-sm tracking-[0.3em] uppercase mb-4">
              TRAUST · HEIÐARLEIKI · GAGNSÆI
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Chess After Dark
            </h1>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
              Íslenskt skákhlaðvarp með Birki Karl Sigurðssyni og Leifi
              Þorsteinssyni
            </p>
          </div>

          {/* Latest Episode */}
          <div className="bg-bg-primary border border-blue-main/30 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
            <p className="text-blue-bright text-sm font-semibold mb-2">
              Nýjasti þáttur
            </p>
            <h2 className="text-2xl font-bold text-white mb-3">
              {latestEpisode.title}
            </h2>
            <p className="text-muted mb-4">{latestEpisode.description}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/thaettir/${latestEpisode.slug}`}
                className="inline-flex items-center gap-2 bg-blue-main hover:bg-blue-bright text-white px-5 py-2.5 rounded-lg transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Hlusta
              </Link>
              <Link
                href="/thaettir"
                className="inline-flex items-center text-blue-light hover:text-white px-5 py-2.5 border border-blue-main/50 rounded-lg transition-colors"
              >
                Allir þættir
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Episodes Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-8">Nýjustu þættir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEpisodes.map((ep) => (
              <Link
                key={ep.slug}
                href={`/thaettir/${ep.slug}`}
                className="bg-bg-secondary border border-blue-main/20 rounded-xl p-5 hover:border-blue-bright/50 transition-colors group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue-main/20 text-blue-bright text-xs font-bold px-2 py-1 rounded">
                    #{ep.episodeNumber}
                  </span>
                  <span className="text-muted text-sm">{ep.date}</span>
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-light transition-colors">
                  {ep.title}
                </h3>
                <p className="text-muted text-sm line-clamp-2">
                  {ep.description}
                </p>
                {ep.guests.length > 0 && (
                  <p className="text-blue-light text-sm mt-3">
                    Gestur: {ep.guests.join(", ")}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Links */}
      <section className="bg-bg-secondary py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-white mb-6">
            Hlustaðu þar sem þér hentar
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Spotify", href: "https://open.spotify.com" },
              { name: "Apple Podcasts", href: "https://podcasts.apple.com" },
              { name: "YouTube", href: "https://youtube.com" },
              { name: "Twitch", href: "https://twitch.tv" },
            ].map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-main/20 hover:bg-blue-main/40 text-blue-light hover:text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                {platform.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
