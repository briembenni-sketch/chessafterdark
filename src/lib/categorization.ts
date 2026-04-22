import overrides from "@/data/episode-overrides.json";

export type Category =
  | "knattspyrna"
  | "politik"
  | "skak"
  | "vidskipti"
  | "annad";

export const CATEGORIES: Record<Category, { label: string; icon: string }> = {
  knattspyrna: { label: "Knattspyrna", icon: "Goal" },
  politik: { label: "Pólitík", icon: "Landmark" },
  skak: { label: "Skák", icon: "Crown" },
  vidskipti: { label: "Viðskipti", icon: "Briefcase" },
  annad: { label: "Annað", icon: "MoreHorizontal" },
};

export const CATEGORY_ORDER: Category[] = [
  "knattspyrna",
  "politik",
  "skak",
  "vidskipti",
  "annad",
];

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

  // SKAK
  if (
    /\bskák|skákmað|skákmeistar|stórmeistar|alþjóðameistar|\belo\b|grandmaster|\bfide\b|opnun|sikil|spænsk|drottningar|indversk|kóngsindversk|endatafl|taktík|gambi|carlsen|kasparov|fischer|nakamura|hikaru|caruana|ding liren|nepomnia|anand|karpov|íslandsmót í skák|reykjavík open|skákþing|skáksamband|skáksetur|skákskóli|skák-|skák\s/i.test(
      text
    )
  ) {
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
