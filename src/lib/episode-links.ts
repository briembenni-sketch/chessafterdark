import type { Episode } from "@/lib/rss";

const SPOTIFY_SHOW_URL = "https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO";
const APPLE_SHOW_URL = "https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@chessafterdark7953";

export function getSpotifyLink(episode: Episode): string | null {
  return episode.platformLinks?.spotify || null;
}

export function getApplePodcastsLink(episode: Episode): string | null {
  return episode.platformLinks?.apple || null;
}

export function getYouTubeLink(episode: Episode): string | null {
  return episode.platformLinks?.youtube || null;
}

export { SPOTIFY_SHOW_URL, APPLE_SHOW_URL, YOUTUBE_CHANNEL_URL };
