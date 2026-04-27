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
 * Used for frequency-based Skák classification (threshold: 5+).
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

    // Compound words with skák- prefix
    /\bskák-?[a-záéíóúýþæö]+\b/gi,

    // Chess-specific terminology
    /\bstórmeistar(i|inn|ar|arnir|a|ans|ann)\b/gi,
    /\balþjóðameistar(i|inn|a|ans|ar)\b/gi,
    /\bgrandmaster\b/gi,
    /\b(fide|elo)\s+(stig|rating|titil)/gi,

    // World-famous chess players
    /\b(magnús\s+carlsen|magnus\s+carlsen)\b/gi,
    /\bcarlsen\b/gi,
    /\bkasparov\b/gi,
    /\bbobby\s+fischer\b/gi,
    /\b(nakamura|hikaru\s+nakamura)\b/gi,
    /\bcaruana\b/gi,
    /\bding\s+liren\b/gi,
    /\bnepomniachtchi\b/gi,
    /\b(viswanathan\s+anand|anand)\b/gi,
    /\bkarpov\b/gi,
    /\b(judit\s+polgár|polgár)\b/gi,

    // Icelandic chess players (full names to avoid false positives)
    /\bhannes\s+hlífar\b/gi,
    /\bjóhann\s+hjartarson\b/gi,
    /\bhelgi\s+ólafsson\b/gi,
    /\bfriðrik\s+ólafsson\b/gi,
    /\bhjörvar\s+steinn\b/gi,
    /\bguðmundur\s+kjartansson\b/gi,
    /\bbragi\s+þorfinnsson\b/gi,
    /\bhéðinn\s+steingrímsson\b/gi,

    // Chess events
    /\bíslandsmót\s+í\s+skák\b/gi,
    /\breykjavík\s+open\b/gi,
    /\bheimsmeistaramót\s+í\s+skák\b/gi,
    /\bólympíuleikar\s+í\s+skák\b/gi,
    /\bkandídatamót\b/gi,

    // Chess concepts
    /\bendatafl\b/gi,
    /\bmiðtafl\b/gi,
    /\bbyrjun(?=\s+(með|á|gegn|í\s+skák))/gi,
    /\bgambi(t|tinn|tar)?\b/gi,
    /\bsikileyjar\s*vörn\b/gi,
    /\bspænsk\s*vörn\b/gi,
    /\bdrottningarbragð\b/gi,
    /\bkóngsindversk\s*vörn\b/gi,
  ];

  let count = 0;
  for (const pattern of patterns) {
    const m = text.match(pattern);
    if (m) count += m.length;
  }
  return count;
}

/**
 * Classify an episode into 1+ categories.
 * - Episode lands in every category whose keywords match title+description
 * - If no category matches any of the 4 main ones -> 'annad'
 * - Manual overrides in data/episode-overrides.json take precedence
 */
export function classifyEpisode(episode: {
  title: string;
  description: string;
  guests: string[];
}): Category[] {
  // MANUAL OVERRIDE FIRST (by title)
  const override = (overrides as unknown as Record<string, Category[]>)[episode.title];
  if (override && Array.isArray(override) && override.length > 0) {
    return override;
  }

  const text = `${episode.title} ${episode.description}`.toLowerCase();
  const matches: Category[] = [];

  // KNATTSPYRNA
  if (
    /fótbolt|knattspyrn|\bksí\b|landslið(?!.*skák)|pepsi deild|úrvalsdeild|enska deildin|meistaradeild|premier league|la liga|serie a|bundesliga|champions league|heimsmeistarakeppni(?!.*skák)|\bhm\b.*fótbolt|\bem\b.*fótbolt|eurocup|uefa|fifa|messi|ronaldo|haaland|mbappe|liverpool|arsenal|man utd|manchester|chelsea|real madrid|barcelona|bayern|psg/i.test(
      text
    )
  ) {
    matches.push("knattspyrna");
  }

  // POLITIK
  if (
    /stjórnm|ráðherra|alþingi|forseti íslands|formaður.*flokks|sjálfstæðisfl|framsóknarfl|samfylking|vinstri græn|miðflokk|viðreisn|píratar|flokkur fólksins|sósíalist|kosning|ríkisstj|þingmað|borgarstjór|bæjarstjór|utanríkismál|innanríkismál|efnahagsmál.*ríkis/i.test(
      text
    )
  ) {
    matches.push("politik");
  }

  // SKAK — frequency-based: 5+ chess-related mentions = chess is the subject
  if (countChessMentions(text) >= 5) {
    matches.push("skak");
  }

  // VIDSKIPTI
  if (
    /viðskipt|fyrirtæk|forstjór|framkvæmdastjór|rekstur fyrirtæk|fjárfest|hagfræð|kauphöll|hlutabréf|frumkvöðul|sprotafyrirtæk|stofnand.*fyrirtæk|\bceo\b|\bcfo\b|\bcto\b|markaðsset|atvinnulíf|efnahagsl|samtök atvinnulífs|\bsa\b\s|viðskiptaráð|iðnaðarráð|verslunarráð|bankast|útrás|ölgerð|icelandair|samherji|síldarvinnslan|festi|landsbank|arion|íslandsbank|kvika|marel|össur|alvotech/i.test(
      text
    )
  ) {
    matches.push("vidskipti");
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
