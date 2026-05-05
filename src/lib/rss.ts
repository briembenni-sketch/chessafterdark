import { XMLParser } from "fast-xml-parser";
import { episodes as fallbackEpisodes } from "@/data/episodes";
import { classifyEpisode, countByCategory, countChessMentions, type Category } from "@/lib/categorization";
import { resolvePlatformLinks, type PlatformLinks } from "@/lib/platform-links";

export interface Episode {
  number: number;
  slug: string;
  title: string;
  guest: string;
  guestSlug: string;
  guests?: string[];
  guestSlugs?: string[];
  date: string;
  duration: string;
  description: string;
  shortDescription: string;
  audioUrl: string;
  spotifyEmbedUrl?: string;
  image: string;
  topics: string[];
  categories: Category[];
  guid: string;
  platformLinks?: PlatformLinks;
}

const RSS_URL = "https://feeds.buzzsprout.com/1814614.rss";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/þ/g, "th")
    .replace(/ð/g, "d")
    .replace(/æ/g, "ae")
    .replace(/ö/g, "o")
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ý/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanTitle(rawTitle: string): string {
  return rawTitle.replace(/^#?\d+\s*[-–—.:]?\s*/, "").trim();
}

export function slugifyIcelandic(name: string): string {
  return name
    .toLowerCase()
    .replace(/þ/g, "th")
    .replace(/ð/g, "d")
    .replace(/æ/g, "ae")
    .replace(/ö/g, "o")
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u")
    .replace(/ý/g, "y")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractGuest(rawTitle: string): {
  name: string;
  slug: string;
  allGuests: string[];
  allSlugs: string[];
} {
  const clean = cleanTitle(rawTitle);

  // Get just the name part (before any dash/em-dash/comma indicating role)
  const namePart = clean.split(/\s*[–—]\s*/)[0].trim();

  // Split on common separators for multi-guest episodes
  const separators = /\s+(?:&|og|\+|\/)\s+/i;
  const allGuests = namePart.split(separators).map((s) => s.trim()).filter(Boolean);
  const allSlugs = allGuests.map(slugifyIcelandic);

  return {
    name: allGuests[0] || clean,
    slug: allSlugs[0] || slugifyIcelandic(clean),
    allGuests,
    allSlugs,
  };
}

function htmlToText(html: string): string {
  if (!html) return "";

  return html
    // Normalize self-closing <br> variations
    .replace(/<br\s*\/?>/gi, "\n")
    // Block-level closing tags → double newline
    .replace(/<\/(p|div|h[1-6]|li|ul|ol|blockquote)>/gi, "\n\n")
    .replace(/<(p|div|h[1-6]|blockquote)[^>]*>/gi, "\n\n")
    // List items → bullet-prefixed line
    .replace(/<li[^>]*>/gi, "\n• ")
    // Inline tags → space
    .replace(/<\/?(a|span|em|strong|b|i|u)[^>]*>/gi, " ")
    // Strip remaining tags
    .replace(/<[^>]+>/g, " ")
    // Decode common HTML entities
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&\w+;/g, " ")
    // Collapse spaces but preserve newlines
    .replace(/[ \t]+/g, " ")
    // Clean up excessive blank lines
    .replace(/\n{3,}/g, "\n\n")
    // Trim each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function makeShortDescription(fullText: string, maxLength = 160): string {
  const singleLine = fullText.replace(/\n+/g, " ").trim();
  if (singleLine.length <= maxLength) return singleLine;
  const cut = singleLine.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 100 ? lastSpace : maxLength) + "…";
}

function formatDuration(raw: string | number): string {
  if (typeof raw === "number") {
    const totalSec = raw;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  const str = String(raw);
  // Already formatted as H:MM:SS or MM:SS
  if (str.includes(":")) return str;
  const totalSec = parseInt(str, 10);
  if (isNaN(totalSec)) return str;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function autoTagTopics(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const topics: string[] = [];

  if (/knattspyrn|fótbolt|landslið|(?<![a-záéíóúýþæðö])kr(?![a-záéíóúýþæðö])|valur|stjörnun/i.test(`${title} ${description}`)) {
    topics.push("Knattspyrna");
  }
  if (/pólit|ráðherra|þingma|bæjarstjór|flokk/.test(text)) {
    topics.push("Pólitík");
  }
  if (/viðskipt|forstjór|fjármál|fyrirtæk|hlutabréf/.test(text)) {
    topics.push("Viðskipti");
  }
  if (/skák|stórmeistar|carlsen|fischer/.test(text)) {
    topics.push("Skák");
  }

  if (topics.length === 0) {
    topics.push("Almennt");
  }

  return topics;
}

function formatDate(pubDate: string): string {
  const d = new Date(pubDate);
  return d.toISOString().split("T")[0];
}

export function getDisplayCount(episodes: Episode[]): number {
  return Math.floor(episodes.length / 10) * 10;
}

export async function fetchEpisodes(): Promise<Episode[]> {
  try {
    const res = await fetch(RSS_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const feed = parser.parse(xml);
    const channel = feed?.rss?.channel;
    const items = channel?.item;
    if (!items) throw new Error("No items in feed");

    const itemArray = Array.isArray(items) ? items : [items];

    // Channel-level image fallback
    const channelItunesImage = channel?.["itunes:image"]?.["@_href"] || "";
    const channelImage = channel?.image?.url || "";
    const fallbackImage = channelItunesImage || channelImage || "/images/brand/cover-art.png";

    const mapped = itemArray.map((item: Record<string, unknown>, idx: number) => {
      const title = String(item.title || "");
      const rawDesc = String(item.description || "");
      const desc = htmlToText(rawDesc);
      const epNum =
        (item["itunes:episode"] as number) ||
        itemArray.length - idx;

      const enclosure = item.enclosure as Record<string, string> | undefined;
      const audioUrl = enclosure?.["@_url"] || "";

      const itunesImage = item["itunes:image"] as Record<string, string> | undefined;
      const image = itunesImage?.["@_href"] || fallbackImage;

      const duration = formatDuration(
        (item["itunes:duration"] as string | number) || "0"
      );

      const cleaned = cleanTitle(title);
      const shortDesc = makeShortDescription(desc);
      const guestInfo = extractGuest(title);

      const categories = classifyEpisode({
        title: cleaned,
        description: desc,
        guests: guestInfo.allGuests,
        episodeNumber: epNum,
      });

      return {
        number: epNum,
        slug: slugify(title),
        title: cleaned,
        guest: guestInfo.name,
        guestSlug: guestInfo.slug,
        ...(guestInfo.allGuests.length > 1
          ? { guests: guestInfo.allGuests, guestSlugs: guestInfo.allSlugs }
          : {}),
        date: formatDate(String(item.pubDate || "")),
        duration,
        description: desc,
        shortDescription: shortDesc,
        audioUrl,
        image,
        topics: autoTagTopics(title, desc),
        categories,
        guid: String(
          (typeof item.guid === "object" && item.guid !== null
            ? (item.guid as Record<string, unknown>)["#text"]
            : item.guid) || ""
        ),
        platformLinks: undefined as PlatformLinks | undefined,
      };
    });

    const counts = countByCategory(mapped);
    console.log(`[categorization] Episode distribution (${mapped.length} total):`);
    console.log(`  Knattspyrna: ${counts.knattspyrna}`);
    console.log(`  Pólitík:     ${counts.politik}`);
    console.log(`  Skák:        ${counts.skak}`);
    console.log(`  Viðskipti:   ${counts.vidskipti}`);
    console.log(`  Annað:       ${counts.annad}`);
    const skakEpisodes = mapped.filter(e => e.categories.includes("skak"));
    console.log(`[categorization] Skák titles:`);
    skakEpisodes.forEach(e => {
      const mentions = countChessMentions(`${e.title} ${e.description}`.toLowerCase());
      console.log(`  - "${e.title}" (${mentions} chess mentions)`);
    });

    // Resolve platform-specific direct links (non-blocking — failures must not
    // cause the entire episode fetch to fall back to stale static data)
    try {
      const platformLinksMap = await resolvePlatformLinks(
        mapped.map((ep) => ({
          number: ep.number,
          title: ep.title,
          guid: ep.guid,
          date: ep.date,
        }))
      );
      for (const ep of mapped) {
        const links = platformLinksMap.get(ep.guid);
        if (links) ep.platformLinks = links;
      }
    } catch (platformErr) {
      console.warn("[Platform Links] Resolution failed, continuing without links:", platformErr);
    }

    return mapped.sort((a, b) => b.number - a.number);
  } catch (err) {
    console.error("RSS fetch error, using fallback:", err);
    // Fall back to static data
    return fallbackEpisodes.map((ep, idx) => {
      const guestName = ep.guests[0] || "";
      const categories = classifyEpisode({
        title: ep.title,
        description: ep.description,
        guests: ep.guests,
        episodeNumber: ep.episodeNumber,
      });
      return {
        number: ep.episodeNumber,
        slug: ep.slug,
        title: ep.title,
        guest: guestName,
        guestSlug: slugifyIcelandic(guestName),
        date: ep.date,
        duration: "0:00",
        description: ep.description,
        shortDescription: ep.description.substring(0, 160),
        audioUrl: "",
        image: ep.thumbnail || "/images/brand/cover-art.png",
        topics: ep.topics,
        categories,
        guid: `fallback-${idx}`,
      };
    });
  }
}
