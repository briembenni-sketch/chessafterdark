export interface Event {
  slug: string;
  title: string;
  category: "einvigi" | "upptaka" | "afmaeli" | "aramot" | "annad";
  categoryLabel: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  shortDescription: string;
  image?: string;
  highlights?: string[];
  featured?: boolean;
  status: "upcoming" | "live" | "past";
  twitchUrl?: string;
  ticketsUrl?: string;
  participants?: Array<{ name: string; subtitle?: string }>;
  episodeNumber?: number;
  icon?: string;
}

export const events: Event[] = [
  // ── UPCOMING ──
  {
    slug: "einvigi-aldarinnar-2-0",
    title: "Einvígi Aldarinnar 2.0",
    category: "einvigi",
    categoryLabel: "EINVÍGI",
    date: "2026-04-16",
    time: "20:00",
    location: "Arena Kópavogi",
    description:
      "Leifur Þorsteinsson mætir Andra Steini Hilmarssyni, bæjarfulltrúa í Kópavogi, í 10 hraðskáka einvígi. Báðir keppendur eru með í kringum 1.700 Eló-stig og keppnin þykir einkar jöfn. Alþjóðlegi skákmeistarinn Björn Þorfinnsson og Fide-meistarinn Ingvar Þór Jóhannesson lýsa viðburðinum í streyminu ásamt stórmeistara í leyni-hlutverki.",
    shortDescription:
      "Leifur mætir Andra Steini í 10 hraðskáka einvígi á Arena Kópavogi.",
    highlights: ["Arena Kópavogi", "10 hraðskákir", "Twitch streymi"],
    featured: true,
    status: "upcoming",
    twitchUrl: "https://twitch.tv/chessafterdark",
    participants: [
      { name: "Leifur Þorsteinsson", subtitle: "~1.700 Eló" },
      { name: "Andri Steinn Hilmarsson", subtitle: "~1.700 Eló" },
    ],
    icon: "crown",
  },

  // ── PAST ──
  {
    slug: "aramotakaefa-2024",
    title: "Áramótakæfa 2024",
    category: "aramot",
    categoryLabel: "ÁRAMÓTAKÆFA",
    date: "2025-01-02",
    location: "Upptaka",
    description:
      "Fyrsti þáttur ársins 2025 með Birni Þorfinnssyni ritstjóra DV og Þorbirni Atla hjá ACRO. Farið yfir fréttir ársins, skákhorn, winners og losers á hlutabréfamarkaði, og maður ársins útnefndur.",
    shortDescription:
      "Fyrsti þáttur ársins með Birni Þorfinnssyni og Þorbirni Atla.",
    highlights: ["Winners & Losers", "Maður ársins", "Skákhorn"],
    status: "past",
    icon: "party",
  },
  {
    slug: "5-ara-afmaeli-albert-florens",
    title: "5 ára afmælisþáttur · Albert í Flórens",
    category: "afmaeli",
    categoryLabel: "AFMÆLI · ÁRAMÓT",
    date: "2024-12-15",
    location: "Flórens, Ítalíu",
    description:
      "Í tilefni af 5 ára afmæli þáttarins skruppu Birkir og Leifur til Flórens til að taka viðtal við Albert Guðmundsson, einn fremsta knattspyrnumann Íslands. Farið yfir feril hjá Fiorentina, æskunni í Vesturbænum, tímanum í Hollandi og Genoa.",
    shortDescription:
      "Viðtal við Albert Guðmundsson í Flórens í tilefni af 5 ára afmæli þáttarins.",
    highlights: ["Flórens", "Þáttur #258", "Fiorentina"],
    status: "past",
    episodeNumber: 258,
    icon: "cake",
  },
  {
    slug: "birkir-bjarnason-113-landsleikir",
    title: "Birkir Bjarnason · 113 landsleikir",
    category: "upptaka",
    categoryLabel: "UPPTÖKUKVÖLD",
    date: "2024-10-01",
    location: "Upptaka",
    description:
      "Sérstök löng upptaka með Birki Bjarnasyni, landsleikjahæsta leikmanni Íslands með 113 leiki. Farið yfir ferilinn hjá Aston Villa, Basel, Sampdoria, Brescia og öðrum stórum liðum.",
    shortDescription:
      "Löng upptaka með landsleikjahæsta leikmanni Íslands.",
    highlights: ["113 landsleikir", "Aston Villa", "Sampdoria"],
    status: "past",
    icon: "stadium",
  },
  {
    slug: "einvigi-aldarinnar-1",
    title: "Einvígi Aldarinnar · Hörður vs Heimir",
    category: "einvigi",
    categoryLabel: "EINVÍGI",
    date: "2024-04-01",
    location: "Reykjavík",
    description:
      "Hörður Magnússon, fjölmiðlamaður og fyrrverandi knattspyrnumaður, mætti Heimi Guðjónssyni knattspyrnuþjálfara í hraðskákeinvígi sem markaði upphaf einvígjaraðar Chess After Dark.",
    shortDescription:
      "Hörður Magnússon og Heimir Guðjónsson mættust í fyrsta Einvígi Aldarinnar.",
    highlights: ["Reykjavík", "10 hraðskákir", "Streamað á Twitch"],
    status: "past",
    icon: "trophy",
  },
  {
    slug: "gylfi-sigurdsson-vidbod",
    title: "Gylfi Sigurðsson · Sérstakt viðtal",
    category: "upptaka",
    categoryLabel: "UPPTÖKUKVÖLD",
    date: "2024-06-20",
    location: "Upptaka",
    description:
      "Eitt umræddasta viðtal ársins þar sem Gylfi Sigurðsson fyrrum landsliðsmaður opnaði sig um ferilinn, árin í Englandi og framtíðaráformin.",
    shortDescription:
      "Sérstakt viðtal við Gylfa Sigurðsson um ferilinn og framtíðina.",
    highlights: ["Swansea", "Everton", "Landsliðið"],
    status: "past",
    icon: "stadium",
  },
  {
    slug: "jolakvold-chess-after-dark-2024",
    title: "Jólaþáttur Chess After Dark",
    category: "annad",
    categoryLabel: "SÉRSTAKUR ÞÁTTUR",
    date: "2024-12-23",
    location: "Upptaka",
    description:
      "Árlegi jólaþátturinn þar sem strákunum brá í leiðinni yfir árið, bestu augnablikin, og jólaglgg var drukkinn beint í streymi.",
    shortDescription:
      "Árlegi jólaþátturinn með yfirliti yfir árið.",
    highlights: ["Jólagleði", "Ársyfirlit", "Beint streymi"],
    status: "past",
    icon: "party",
  },
];
