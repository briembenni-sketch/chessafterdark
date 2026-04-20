import { Music, Apple, MonitorPlay } from "lucide-react";
import type { Episode } from "@/lib/rss";

interface EpisodePlayerProps {
  episode: Episode;
}

export default function EpisodePlayer({ episode }: EpisodePlayerProps) {
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

      {/* Listen elsewhere links */}
      <div className="flex flex-wrap gap-3">
        <a
          href="https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
        >
          <Music className="w-4 h-4" />
          Spotify
        </a>
        <a
          href="https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
        >
          <Apple className="w-4 h-4" />
          Apple Podcasts
        </a>
        <a
          href="https://www.youtube.com/@chessafterdark7953"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-4 py-2 rounded-lg transition-all text-sm"
        >
          <MonitorPlay className="w-4 h-4" />
          YouTube
        </a>
      </div>
    </div>
  );
}
