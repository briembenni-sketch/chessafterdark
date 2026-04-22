import overrides from "@/data/episode-overrides.json";

export type Category = "vidtol" | "skakspjall" | "mot-frettir" | "serstakt";
export type Tag =
  | "knattspyrna"
  | "politik"
  | "vidskipti"
  | "skak"
  | "listir"
  | "fjolmidlar"
  | "visindi"
  | "ithrottir"
  | "saga"
  | "taekni"
  | "log"
  | "heilsa";

export const CATEGORIES: Record<
  Category,
  { label: string; description: string; icon: string }
> = {
  vidtol: {
    label: "Viðtöl",
    description: "Gestaþættir",
    icon: "Mic",
  },
  skakspjall: {
    label: "Skákspjall",
    description: "Hýslar ræða skák",
    icon: "MessageSquare",
  },
  "mot-frettir": {
    label: "Mót & Fréttir",
    description: "Skákmót og fréttir",
    icon: "Trophy",
  },
  serstakt: {
    label: "Sérstakt",
    description: "Jól, afmæli, live",
    icon: "Sparkles",
  },
};

export const TAGS: Record<Tag, { label: string }> = {
  knattspyrna: { label: "Knattspyrna" },
  politik: { label: "Pólitík" },
  vidskipti: { label: "Viðskipti" },
  skak: { label: "Skák" },
  listir: { label: "Listir" },
  fjolmidlar: { label: "Fjölmiðlar" },
  visindi: { label: "Vísindi" },
  ithrottir: { label: "Íþróttir" },
  saga: { label: "Saga" },
  taekni: { label: "Tækni" },
  log: { label: "Lögfræði" },
  heilsa: { label: "Heilsa" },
};

// Chess-related regex — broad because this IS a chess podcast
const CHESS_REGEX =
  /skák|skak[^a]|chess|leikur|opnun|endatafl|taktík|stórmeistar|elo\b|grandmaster|gambi|carlsen|magnus|kasparov|fischer|tal\b|capablanca|botvinnik|anand|kramnik|kandidata|olympi|fide|mót |turnering|sigrað|sigur|tap |ólympíu|rapid|blitz|bullet|classical|rating|titill|heimsmeistar|gm\b|fm\b|im\b|wgm|nóvísi|aðalflokk|flokkur [a-e]|skákfélag|skáksam|taflmað|borðið|hvítur|svartur|bóndi|hest|biskup|hrók|drott|konungur|matt\b|skákborð|skákturn|skáksaga|skákheim|aðrir skákmenn|spila|partí|skákpartí|chess after dark/i;

// Tournament/event regex
const TOURNAMENT_REGEX =
  /heimsmeistaram|kandídata|ólympíul|íslandsmót|reykjavík open|skákmót|grand prix|fide|world cup|world chess|tata steel|wijk|sinquefield|st\.? louis|norway chess|candidates|olympiad|turnering|einvig|keppn|deild[^a-z]|úrslit|bikarmót|rapídmót|blitzmót/i;

export function classifyEpisode(episode: {
  title: string;
  description: string;
  guests: string[];
}): { category: Category; tags: Tag[] } {
  const text = `${episode.title} ${episode.description}`.toLowerCase();
  const hasGuest =
    episode.guests.length > 0 &&
    !episode.guests.every((g) =>
      ["birkir", "leifur"].some((h) => g.toLowerCase().includes(h))
    );

  // MANUAL OVERRIDE FIRST
  const override = (
    overrides as Record<string, { category: Category; tags: Tag[] }>
  )[episode.title];
  if (override) return override;

  const isChessHeavy = CHESS_REGEX.test(text);
  const isTournament = TOURNAMENT_REGEX.test(text);

  // TAGS (compute before category so we can use chess tag for category decision)
  const tags: Tag[] = [];
  const tagRules: [Tag, RegExp][] = [
    [
      "knattspyrna",
      /fótbolt|knattspyrn|\bksí\b|landslið|pepsi deild|úrvalsdeild|enska deildin|meistaradeild/i,
    ],
    [
      "politik",
      /stjórnm|ráðherra|alþingi|forseti|flokk|kosning|ríkisstj|þingmað/i,
    ],
    [
      "vidskipti",
      /viðskipt|fyrirtæk|forstjór|framkvæmdastjór|rekstur|fjárfest|hagfræð|markað/i,
    ],
    ["skak", CHESS_REGEX],
    [
      "listir",
      /tónlist|listam|leikar|rithöf|\bbók\b|málar|kvikmynd|leikhús/i,
    ],
    [
      "fjolmidlar",
      /fjölmiðl|blaðamað|ritstjór|útvarp|sjónvarp|dagblað/i,
    ],
    ["visindi", /vísind|prófessor|rannsókn|háskól|læknisfr|verkfræð/i],
    [
      "ithrottir",
      /handbolt|körfubolt|sund|frjálsar|ólympí|afreksíþrótt/i,
    ],
    ["saga", /sagnfr|saga íslands|víking|landnám|sjálfstæðisb/i],
    [
      "taekni",
      /tölvunarfr|forrit|\bai\b|gervigreind|tækni|startup|hugbúnað/i,
    ],
    ["log", /lögfr|hæstirétt|dómari|lögmað|saksóknar/i],
    ["heilsa", /heilbrigð|læknir|sálfræð|geðheils|næring/i],
  ];
  for (const [tag, regex] of tagRules) {
    if (regex.test(text)) tags.push(tag);
  }

  // PRIMARY CATEGORY
  // Priority: serstakt → mot-frettir → skakspjall (chess-focused) → vidtol (general guest interview)
  let category: Category;
  if (
    /jól|áramót|afmæli|\blive\b|100\. þáttur|200\. þáttur|300\. þáttur/i.test(
      text
    )
  ) {
    category = "serstakt";
  } else if (isTournament) {
    category = "mot-frettir";
  } else if (isChessHeavy) {
    // Chess-focused episode — even with a guest, chess is the main topic
    category = "skakspjall";
  } else if (hasGuest) {
    category = "vidtol";
  } else {
    category = "skakspjall";
  }

  return { category, tags };
}
