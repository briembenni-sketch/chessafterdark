import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";

export interface PlatformLinks {
  youtube?: string;
  spotify?: string;
  apple?: string;
}

interface CacheEntry extends PlatformLinks {
  discovered_at: string;
}

type CacheFile = Record<string, CacheEntry>;
type OverrideFile = Record<string, Partial<PlatformLinks>>;

const YOUTUBE_CHANNEL_ID = "UCbZmvhcoFDon9L8M5keZ-hQ";
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

const APPLE_SHOW_ID = "1592499624";
const APPLE_LOOKUP_URL = `https://itunes.apple.com/lookup?id=${APPLE_SHOW_ID}&entity=podcastEpisode&limit=200`;

const SPOTIFY_SHOW_ID = "1k1Ak6f8wFba3DzJzrNLTO";
const SPOTIFY_SHOW_URL = `https://open.spotify.com/show/${SPOTIFY_SHOW_ID}`;

const CACHE_PATH = path.join(process.cwd(), "src", "data", "platform-links-cache.json");
const OVERRIDES_PATH = path.join(process.cwd(), "src", "data", "episode-platform-links.json");

// How old a cached entry can be before re-fetching (30 days in ms)
const CACHE_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

interface EpisodeStub {
  number: number;
  title: string;
  guid: string;
  date: string;
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/chess\s+after\s+dark/gi, "")
    .replace(/#?\d+\s*[-–—.:]\s*/, "")
    .replace(/#\d+\s*/, "")
    .replace(/[^\w\sáéíóúýþæðö]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleSimilarity(a: string, b: string): number {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (na === nb) return 1;
  if (!na || !nb) return 0;

  const wordsA = na.split(" ");
  const wordsB = nb.split(" ");
  const setA = new Set(wordsA);
  const setB = new Set(wordsB);

  let matches = 0;
  for (const w of setA) {
    if (setB.has(w)) matches++;
  }

  const union = new Set([...setA, ...setB]).size;
  return union > 0 ? matches / union : 0;
}

function extractEpisodeNumber(title: string): number | null {
  const m = title.match(/#(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function matchByNumberThenTitle<T extends { title: string }>(
  episode: EpisodeStub,
  candidates: T[]
): T | null {
  // Try matching by episode number first
  for (const c of candidates) {
    const num = extractEpisodeNumber(c.title);
    if (num !== null && num === episode.number) return c;
  }

  // Fall back to fuzzy title match
  let best: T | null = null;
  let bestScore = 0;
  for (const c of candidates) {
    const score = titleSimilarity(episode.title, c.title);
    if (score > bestScore && score >= 0.5) {
      bestScore = score;
      best = c;
    }
  }
  return best;
}

function readCache(): CacheFile {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      return JSON.parse(fs.readFileSync(CACHE_PATH, "utf-8"));
    }
  } catch {
    // ignore
  }
  return {};
}

function writeCache(cache: CacheFile): void {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch {
    // non-fatal
  }
}

function readOverrides(): OverrideFile {
  try {
    if (fs.existsSync(OVERRIDES_PATH)) {
      const data = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf-8"));
      // Remove _README key
      delete data._README;
      return data;
    }
  } catch {
    // ignore
  }
  return {};
}

function isCacheFresh(entry: CacheEntry, episodeDate: string): boolean {
  const epAge = Date.now() - new Date(episodeDate).getTime();
  // Recent episodes (< 30 days old) always re-fetch
  if (epAge < CACHE_MAX_AGE_MS) return false;
  // Older episodes: cache is always valid
  return true;
}

async function fetchYouTubeVideos(): Promise<{ title: string; url: string }[]> {
  try {
    const res = await fetch(YOUTUBE_RSS_URL, { next: { revalidate: 86400 } });
    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const feed = parser.parse(xml);

    const entries = feed?.feed?.entry;
    if (!entries) return [];

    const arr = Array.isArray(entries) ? entries : [entries];
    return arr.map((entry: Record<string, unknown>) => ({
      title: String((entry as Record<string, Record<string, string>>)?.["media:group"]?.["media:title"] || entry.title || ""),
      url: `https://www.youtube.com/watch?v=${entry["yt:videoId"]}`,
    }));
  } catch (err) {
    console.warn("[Platform Links] YouTube fetch failed:", err);
    return [];
  }
}

interface AppleEpisode {
  trackId: number;
  trackName: string;
  title: string;
}

async function fetchAppleEpisodes(): Promise<AppleEpisode[]> {
  try {
    const res = await fetch(APPLE_LOOKUP_URL, { next: { revalidate: 86400 } });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || [])
      .filter((r: Record<string, string>) => r.kind === "podcast-episode")
      .map((r: Record<string, unknown>) => ({
        trackId: r.trackId as number,
        trackName: String(r.trackName || ""),
        title: String(r.trackName || ""),
      }));
  } catch (err) {
    console.warn("[Platform Links] Apple fetch failed:", err);
    return [];
  }
}

interface SpotifyEpisode {
  id: string;
  name: string;
  title: string;
}

/**
 * Scrapes the Spotify show page HTML to extract episode IDs and names.
 *
 * Spotify's show page embeds an `initialState` blob (base64-encoded JSON)
 * containing the first ~12 episodes. No credentials are needed.
 *
 * This is inherently limited to the most recent episodes. Older episodes
 * are only available via manual overrides in episode-platform-links.json.
 * Cached entries persist across builds, so over time new episodes accumulate.
 */
async function fetchSpotifyEpisodes(): Promise<SpotifyEpisode[]> {
  try {
    const res = await fetch(SPOTIFY_SHOW_URL, {
      next: { revalidate: 86400 },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    if (!res.ok) {
      console.warn(`[Platform Links] Spotify show page returned ${res.status}`);
      return [];
    }

    const html = await res.text();

    // Extract the base64-encoded initialState from the page
    const stateMatch = html.match(
      /<script id="initialState"[^>]*>([^<]+)<\/script>/
    );
    if (!stateMatch) {
      console.warn("[Platform Links] Spotify: no initialState found in HTML");
      return [];
    }

    const decoded = Buffer.from(stateMatch[1], "base64").toString("utf-8");
    const state = JSON.parse(decoded);

    // Episodes are nested under the show entity's pages.items
    const showEntity =
      state?.entities?.items?.[`spotify:show:${SPOTIFY_SHOW_ID}`];
    const pageItems = showEntity?.pages?.items || [];

    const episodes: SpotifyEpisode[] = [];
    for (const item of pageItems) {
      const epData = item?.entity?.data;
      if (!epData?.uri || !epData?.name) continue;
      const id = String(epData.uri).replace("spotify:episode:", "");
      episodes.push({ id, name: epData.name, title: epData.name });
    }

    console.log(
      `[Platform Links] Spotify: scraped ${episodes.length} episodes from show page (no credentials needed)`
    );
    return episodes;
  } catch (err) {
    console.warn("[Platform Links] Spotify show page scrape failed:", err);
    return [];
  }
}

export async function resolvePlatformLinks(
  episodes: EpisodeStub[]
): Promise<Map<string, PlatformLinks>> {
  const result = new Map<string, PlatformLinks>();
  const cache = readCache();
  const overrides = readOverrides();

  // Determine which episodes need fetching
  const needsFetch: EpisodeStub[] = [];
  for (const ep of episodes) {
    const override = overrides[String(ep.number)];
    const cached = cache[ep.guid];

    // Start with cached/override values
    const links: PlatformLinks = {};
    if (cached) {
      if (cached.youtube) links.youtube = cached.youtube;
      if (cached.spotify) links.spotify = cached.spotify;
      if (cached.apple) links.apple = cached.apple;
    }
    // Override takes priority
    if (override) {
      if (override.youtube) links.youtube = override.youtube;
      if (override.spotify) links.spotify = override.spotify;
      if (override.apple) links.apple = override.apple;
    }

    result.set(ep.guid, links);

    // Check if we need to re-fetch
    const hasAllPlatforms = links.youtube && links.spotify && links.apple;
    if (!hasAllPlatforms && (!cached || !isCacheFresh(cached, ep.date))) {
      needsFetch.push(ep);
    }
  }

  if (needsFetch.length === 0) {
    logStats(episodes, result);
    return result;
  }

  // Fetch platform data in parallel
  const [ytVideos, appleEpisodes, spotifyEpisodes] = await Promise.all([
    fetchYouTubeVideos(),
    fetchAppleEpisodes(),
    fetchSpotifyEpisodes(),
  ]);

  let ytMatched = 0, ytMissed = 0;
  let appleMatched = 0, appleMissed = 0;
  let spotifyMatched = 0, spotifyMissed = 0;

  for (const ep of needsFetch) {
    const links = result.get(ep.guid) || {};
    const override = overrides[String(ep.number)];

    // YouTube
    if (!links.youtube && !(override?.youtube)) {
      const match = matchByNumberThenTitle(ep, ytVideos);
      if (match) {
        links.youtube = match.url;
        ytMatched++;
      } else {
        ytMissed++;
      }
    }

    // Apple Podcasts
    if (!links.apple && !(override?.apple)) {
      const match = matchByNumberThenTitle(ep, appleEpisodes);
      if (match) {
        links.apple = `https://podcasts.apple.com/is/podcast/id${APPLE_SHOW_ID}?i=${match.trackId}`;
        appleMatched++;
      } else {
        appleMissed++;
      }
    }

    // Spotify
    if (!links.spotify && !(override?.spotify)) {
      const match = matchByNumberThenTitle(ep, spotifyEpisodes);
      if (match) {
        links.spotify = `https://open.spotify.com/episode/${match.id}`;
        spotifyMatched++;
      } else {
        spotifyMissed++;
      }
    }

    result.set(ep.guid, links);

    // Update cache
    cache[ep.guid] = {
      ...links,
      discovered_at: new Date().toISOString(),
    };
  }

  console.log(`[Platform Links] YouTube: ${ytMatched} matched, ${ytMissed} missed`);
  console.log(`[Platform Links] Apple: ${appleMatched} matched, ${appleMissed} missed`);
  console.log(`[Platform Links] Spotify: ${spotifyMatched} matched, ${spotifyMissed} missed`);
  console.log(`[Platform Links] Manual overrides applied: ${Object.keys(overrides).length}`);

  writeCache(cache);
  logStats(episodes, result);
  return result;
}

function logStats(episodes: EpisodeStub[], result: Map<string, PlatformLinks>) {
  let yt = 0, apple = 0, spotify = 0;
  for (const ep of episodes) {
    const links = result.get(ep.guid);
    if (links?.youtube) yt++;
    if (links?.apple) apple++;
    if (links?.spotify) spotify++;
  }
  console.log(`[Platform Links] Coverage: YouTube ${yt}/${episodes.length}, Apple ${apple}/${episodes.length}, Spotify ${spotify}/${episodes.length}`);
}
