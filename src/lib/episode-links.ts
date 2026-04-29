import type { Episode } from "@/lib/rss";

const SPOTIFY_SHOW_URL = "https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO";
const APPLE_SHOW_URL = "https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@chessafterdark7953";

export function getSpotifyLink(episode: Episode): string {
  const query = `#${episode.number} ${episode.title}`;
  return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getApplePodcastsLink(episode: Episode): string {
  // Apple Podcasts requires an iTunes episode ID for deep links.
  // The Buzzsprout RSS feed does not expose this ID, so we fall back
  // to the show homepage.
  return APPLE_SHOW_URL;
}

export function getYouTubeLink(episode: Episode): string {
  const query = `Chess After Dark #${episode.number} ${episode.title}`;
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export { SPOTIFY_SHOW_URL, APPLE_SHOW_URL, YOUTUBE_CHANNEL_URL };
