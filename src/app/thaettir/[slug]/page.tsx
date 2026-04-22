import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchEpisodes } from "@/lib/rss";
import EpisodePlayer from "@/components/EpisodePlayer";
import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const episodes = await fetchEpisodes();
  return episodes.map((ep) => ({ slug: ep.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episodes = await fetchEpisodes();
  const episode = episodes.find((ep) => ep.slug === slug);
  if (!episode) return {};

  return {
    title: episode.title,
    description: episode.shortDescription,
    openGraph: {
      title: `${episode.title} | Chess After Dark`,
      description: episode.shortDescription,
      type: "article",
      images: episode.image ? [{ url: episode.image }] : undefined,
    },
  };
}

export default async function EpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const episodes = await fetchEpisodes();
  const episode = episodes.find((ep) => ep.slug === slug);

  if (!episode) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/thaettir"
        className="text-cad-light hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors"
      >
        ← Til baka í þætti
      </Link>

      <div className="mt-4">
        {/* Episode image */}
        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden mb-6">
          <Image
            src={episode.image}
            alt={episode.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 448px"
          />
          <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-sm px-3 py-1.5 rounded-lg font-medium">
            Þáttur #{episode.number}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-muted flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(episode.date).toLocaleDateString("is-IS", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-muted flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {episode.duration}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {episode.title}
        </h1>

        {/* Guest info */}
        <div className="text-white/60 text-sm mb-4">
          <span>Gestur: </span>
          <Link
            href={`/thaettir?gestur=${episode.guestSlug}`}
            className="text-cad-light hover:text-white underline underline-offset-2 decoration-dotted transition-colors"
          >
            {episode.guest}
          </Link>
          {" · "}
          <Link
            href={`/thaettir?gestur=${episode.guestSlug}`}
            className="text-cad-light hover:text-white text-xs transition-colors"
          >
            Sjá alla þætti →
          </Link>
        </div>

        <div className="whitespace-pre-line text-muted text-lg mb-8">{episode.description}</div>

        {/* Episode Player */}
        <div className="mb-8">
          <EpisodePlayer episode={episode} />
        </div>

        {/* Topics */}
        {episode.topics.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">
              Umræðuefni
            </h2>
            <div className="flex flex-wrap gap-2">
              {episode.topics.map((topic) => (
                <span
                  key={topic}
                  className="bg-cad-blue/10 text-cad-light text-sm px-3 py-1.5 rounded-lg"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
