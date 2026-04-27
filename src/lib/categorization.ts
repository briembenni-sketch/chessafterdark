/**
 * Episode categorization for Chess After Dark.
 *
 * Keywords are tuned for Icelandic + English mixed content. Edge cases
 * handled via `data/episode-overrides.json`. To override an episode's
 * classification, add `{ "<episodeTitle>": ["skak", "vidskipti"] }` to
 * that file.
 */

import overrides from "@/data/episode-overrides.json";

export type Category =
  | "knattspyrna"
  | "politik"
  | "skak"
  | "vidskipti"
  | "annad";

export const CATEGORIES: Record<Category, { label: string }> = {
  knattspyrna: { label: "Knattspyrna" },
  politik: { label: "Pólitík" },
  skak: { label: "Skák" },
  vidskipti: { label: "Viðskipti" },
  annad: { label: "Annað" },
};

export const CATEGORY_ORDER: Category[] = [
  "knattspyrna",
  "politik",
  "skak",
  "vidskipti",
  "annad",
];

/**
 * Count chess-related mentions in text. Each regex match contributes 1.
 * Used for frequency-based Skák classification (threshold: 2+).
 */
export function countChessMentions(text: string): number {
  const patterns: RegExp[] = [
    // Core word "skák" with Icelandic inflections
    /\bskák(a|ar|ir|inn|ina|inu|arinn|arinnar|arinni|um|irnir|anna|við|fyrir|ariðar)?\b/gi,
    /\bskákmað(ur|inn|inum|sins|menn|mennirnir|manna|mönnum)\b/gi,
    /\bskákmeistar(i|inn|ar|arnir|a|ans)\b/gi,
    /\bskákmót(s|i|ið|inu|um|in)?\b/gi,
    /\bskákþing(s|i|ið|inu)?\b/gi,
    /\bskáksamband(s|i|ið|inu)?\b/gi,
    /\bskákskól(i|inn|ans|um)\b/gi,
    /\bskákstig\b/gi,

    // Compound words with skák- prefix
    /\bskák-?[a-záéíóúýþæö]+\b/gi,

    // Chess-specific terminology
    /\bstórmeistar(i|inn|ar|arnir|a|ans|ann)\b/gi,
    /\bstórmeistarar\b/gi,
    /\balþjóðameistar(i|inn|a|ans|ar)\b/gi,
    /\balþjóðlegur meistari\b/gi,
    /\bgrandmaster\b/gi,
    /\b(fide|elo)\s+(stig|rating|titil)/gi,

    // World-famous chess players
    /\b(magnús\s+carlsen|magnus\s+carlsen)\b/gi,
    /\bcarlsen\b/gi,
    /\bkasparov\b/gi,
    /\bbobby\s+fischer\b/gi,
    /\b(nakamura|hikaru\s+nakamura|hikaru)\b/gi,
    /\b(fabiano\s+caruana|caruana)\b/gi,
    /\bding\s+liren\b/gi,
    /\bgukesh\b/gi,
    /\bnepomniachtchi\b/gi,
    /\b(viswanathan\s+anand|anand)\b/gi,
    /\bkarpov\b/gi,
    /\b(judit\s+polgár|polgár)\b/gi,

    // Icelandic chess players
    /\bhannes\s+hlífar\b/gi,
    /\bjóhann\s+hjartarson\b/gi,
    /\bhelgi\s+ólafsson\b/gi,
    /\bhelgi\s+áss\b/gi,
    /\bfriðrik\s+ólafsson\b/gi,
    /\bhjörvar\s+steinn\b/gi,
    /\bguðmundur\s+kjartansson\b/gi,
    /\bbragi\s+þorfinnsson\b/gi,
    /\bhéðinn\s+steingrímsson\b/gi,
    /\bhenrik\s+danielsen\b/gi,

    // Chess events
    /\bíslandsmót\b/gi,
    /\breykjavík\s+open\b/gi,
    /\breykjavíkurskákmót\b/gi,
    /\bheimsmeistaramót\b/gi,
    /\bólympíumót\b/gi,
    /\bólympíuleikar\s+í\s+skák\b/gi,
    /\bkandídatamót\b/gi,
    /\bcandidates\b/gi,
    /\bworld\s+championship\b/gi,

    // Chess concepts and pieces
    /\bendatafl\b/gi,
    /\bmiðtafl\b/gi,
    /\bopnun\b/gi,
    /\bmátstaða\b/gi,
    /\bpeð\b/gi,
    /\briddari\b/gi,
    /\bbiskup\b/gi,
    /\bhrókur\b/gi,
    /\bdrottning\b/gi,
    /\bkóngur\b/gi,
    /\bgambi(t|tinn|tar)?\b/gi,
    /\bsicilian\b/gi,
    /\bsikileyjar\s*vörn\b/gi,
    /\bspænsk\s*vörn\b/gi,
    /\bdrottningarbragð\b/gi,
    /\bkóngsindversk\s*vörn\b/gi,
    /\bbyrjun(?=\s+(með|á|gegn|í\s+skák))/gi,
  ];

  let count = 0;
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) count += m.length;
  }
  return count;
}

// ── Keyword regexes for non-chess categories ──

const KNATTSPYRNA_RE =
  /fótbolt|knattspyrn|\bksí\b|úrvalsdeild|pepsi[- ]deild|bestu deildin|meistaradeild|champions\s+league|premier\s+league|la liga|serie a|bundesliga|landslið(?!.*skák)|landsliðið|\beurocup\b|uefa|fifa|messi|ronaldo|haaland|mbappe|liverpool|arsenal|man\s+(city|utd|united)|manchester|chelsea|real\s+madrid|barcelona|bayern|psg|enska deildin|heimsmeistarakeppni(?!.*skák)|\bhm\b.*fótbolt|\bem\b.*fótbolt|markmaður|framherji|varnarmaður|þjálfari|markvörður|\bkr\b|valur|víkingur|\bfh\b|stjarnan|breiðablik/i;

const POLITIK_RE =
  /stjórnm|ráðherra|forsætisráðherra|fjármálaráðherra|alþingi|forseti íslands|formaður.*flokks|sjálfstæðisfl|framsókn|samfylking|vinstri græn|\bvg\b|miðflokk|viðreisn|píratar|flokkur fólksins|sósíalist|kosning|þingkosning|forsetakosning|ríkisstj|stjórnarandstaða|þingmað|þingmenn|borgarstjór|bæjarstjór|utanríkismál|innanríkismál|efnahagsmál.*ríkis/i;

const VIDSKIPTI_RE =
  /viðskipt|fyrirtæk|forstjór|framkvæmdastjór|stjórnarformaður|rekstur|velta|hagnaður|tap|fjárfest|fjárfestir|frumkvöðul|sprotafyrirtæk|startup|hagfræð|kauphöll|nasdaq\s+iceland|hlutabréf|\bipo\b|útboð|arðsemi|\bebitda\b|markaðsvirði|viðskiptavinur|stofnand.*fyrirtæk|\bceo\b|\bcfo\b|\bcto\b|markaðsset|atvinnulíf|efnahagsl|samtök atvinnulífs|\bsa\b\s|viðskiptaráð|iðnaðarráð|verslunarráð|bankast|útrás|ölgerð|icelandair|samherji|síldarvinnslan|festi|landsbank|arion|íslandsbank|kvika|marel|össur|alvotech/i;

/**
 * Classify an episode into 1+ categories.
 * - Episode lands in every category whose keywords match title+description
 * - Skák uses frequency-based matching (2+ chess mentions)
 * - If an episode matches both Skák and another category with 5+ chess
 *   mentions, Skák is weighted as primary (listed first)
 * - If no category matches -> 'annad'
 * - Manual overrides in data/episode-overrides.json take full precedence
 */
export function classifyEpisode(episode: {
  title: string;
  description: string;
  guests: string[];
}): Category[] {
  // MANUAL OVERRIDE (by title) — loaded last, full override
  const override = (overrides as unknown as Record<string, Category[]>)[episode.title];
  if (override && Array.isArray(override) && override.length > 0) {
    return override;
  }

  const text = `${episode.title} ${episode.description}`.toLowerCase();
  const matches: Category[] = [];

  // KNATTSPYRNA
  if (KNATTSPYRNA_RE.test(text)) {
    matches.push("knattspyrna");
  }

  // POLITIK
  if (POLITIK_RE.test(text)) {
    matches.push("politik");
  }

  // SKAK — frequency-based: 2+ chess-related mentions
  const chessMentions = countChessMentions(text);
  if (chessMentions >= 2) {
    matches.push("skak");
  }

  // VIDSKIPTI
  if (VIDSKIPTI_RE.test(text)) {
    matches.push("vidskipti");
  }

  // Tie-breaking: if Skák + another category and 5+ chess mentions,
  // ensure Skák is listed first (primary category)
  if (
    chessMentions >= 5 &&
    matches.includes("skak") &&
    matches.length > 1 &&
    matches[0] !== "skak"
  ) {
    const idx = matches.indexOf("skak");
    matches.splice(idx, 1);
    matches.unshift("skak");
  }

  // ANNAD — only if none of the above matched
  if (matches.length === 0) {
    matches.push("annad");
  }

  return matches;
}

/**
 * Count episodes per category. An episode counts once per category it's in.
 */
export function countByCategory(
  episodes: { categories: Category[] }[]
): Record<Category, number> {
  const counts: Record<Category, number> = {
    knattspyrna: 0,
    politik: 0,
    skak: 0,
    vidskipti: 0,
    annad: 0,
  };
  for (const ep of episodes) {
    for (const cat of ep.categories) {
      counts[cat]++;
    }
  }
  return counts;
}
