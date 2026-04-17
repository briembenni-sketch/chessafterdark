import { notFound } from "next/navigation";
import Link from "next/link";
import { episodes } from "@/data/episodes";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return episodes.map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = episodes.find((ep) => ep.slug === slug);
  if (!episode) return {};

  return {
    title: episode.title,
    description: episode.description,
    openGraph: {
      title: `${episode.title} | Chess After Dark`,
      description: episode.description,
      type: "article",
    },
  };
}

export default async function EpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const episode = episodes.find((ep) => ep.slug === slug);

  if (!episode) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/thaettir"
        className="text-blue-light hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← Til baka í þætti
      </Link>

      <div className="mt-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-blue-main/20 text-blue-bright text-sm font-bold px-3 py-1 rounded">
            Þáttur #{episode.episodeNumber}
          </span>
          <span className="text-muted">{episode.date}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {episode.title}
        </h1>

        <p className="text-muted text-lg mb-8">{episode.description}</p>

        {/* Embedded players */}
        <div className="mb-8 space-y-4">
          <div className="bg-bg-secondary rounded-xl p-4 border border-blue-main/20">
            <h2 className="text-white font-semibold mb-3">Hlusta á Spotify</h2>
            <iframe
              src={`https://open.spotify.com/embed/episode/${episode.spotifyEmbedId}?theme=0`}
              width="100%"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-lg"
              title={`Spotify player - ${episode.title}`}
            />
          </div>

          <div className="flex gap-3">
            <a
              href={episode.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-main/20 hover:bg-blue-main/40 text-blue-light hover:text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Opna í Spotify
            </a>
            <a
              href={episode.applePodcastsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-main/20 hover:bg-blue-main/40 text-blue-light hover:text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              Opna í Apple Podcasts
            </a>
          </div>
        </div>

        {/* Guests */}
        {episode.guests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">Gestir</h2>
            <div className="flex flex-wrap gap-3">
              {episode.guests.map((guest) => (
                <span
                  key={guest}
                  className="bg-bg-secondary border border-blue-main/30 text-blue-light px-4 py-2 rounded-lg"
                >
                  {guest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Topics */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">
            Umræðuefni
          </h2>
          <div className="flex flex-wrap gap-2">
            {episode.topics.map((topic) => (
              <span
                key={topic}
                className="bg-blue-main/10 text-blue-light text-sm px-3 py-1.5 rounded-lg"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Show Notes */}
        <div className="bg-bg-secondary rounded-xl p-6 border border-blue-main/20">
          <h2 className="text-xl font-semibold text-white mb-3">
            Sýningarnótur
          </h2>
          <p className="text-muted leading-relaxed">{episode.showNotes}</p>
        </div>
      </div>
    </div>
  );
}
