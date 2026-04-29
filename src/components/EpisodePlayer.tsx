import { Music, Apple, MonitorPlay } from "lucide-react";
import type { Episode } from "@/lib/rss";
import { getSpotifyLink, getApplePodcastsLink, getYouTubeLink } from "@/lib/episode-links";

interface EpisodePlayerProps {
  episode: Episode;
}

export default function EpisodePlayer({ episode }: EpisodePlayerProps) {
  const spotifyLink = getSpotifyLink(episode);
  const appleLink = getApplePodcastsLink(episode);
  const youtubeLink = getYouTubeLink(episode);
  const hasAnyLink = spotifyLink || appleLink || youtubeLink;

  return (
    <div className="space-y-4">
      {/* Native audio player */}
      {episode.audioUrl && (
        <div className="bg-cad-mid rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3 text-sm">Hlusta hér</h3>
          <audio
            controls
            src={episode.audioUrl}
            className="w-full styled-audio"
            preload="none"
          />
        </div>
      )}

      {/* Spotify embed */}
      {episode.spotifyEmbedUrl && (
        <div className="bg-cad-mid rounded-xl p-4 border border-white/10">
          <h3 className="text-white font-semibold mb-3 text-sm">Spotify</h3>
          <iframe
            src={episode.spotifyEmbedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
            title={`Spotify player - ${episode.title}`}
          />
        </div>
      )}

      {/* Listen elsewhere links — only shown when direct links are available */}
      {hasAnyLink && (
        <div className="flex flex-wrap gap-3">
          {spotifyLink && (
            <a
              href={spotifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
            >
              <Music className="w-4 h-4" />
              Spotify
            </a>
          )}
          {appleLink && (
            <a
              href={appleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
            >
              <Apple className="w-4 h-4" />
              Apple Podcasts
            </a>
          )}
          {youtubeLink && (
            <a
              href={youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
            >
              <MonitorPlay className="w-4 h-4" />
              YouTube
            </a>
          )}
        </div>
      )}
    </div>
  );
}
