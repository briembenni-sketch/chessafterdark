export interface Episode {
  slug: string;
  title: string;
  episodeNumber: number;
  date: string;
  description: string;
  guests: string[];
  topics: string[];
  thumbnail: string;
  spotifyUrl: string;
  spotifyEmbedId: string;
  applePodcastsUrl: string;
  showNotes: string;
}

export const episodes: Episode[] = [
  {
    slug: "opnunarkenningar-fyrir-byrjendur",
    title: "Opnunarkenningar fyrir byrjendur",
    episodeNumber: 6,
    date: "2026-04-10",
    description:
      "Við förum yfir mikilvægustu opnunarkenningarnar og hvernig byrjendur geta bætt leik sinn frá fyrstu skrefum.",
    guests: ["Guðmundur Óskarsson"],
    topics: ["Opnanir", "Byrjendur", "Kennsla"],
    thumbnail: "/images/ep6.jpg",
    spotifyUrl: "https://open.spotify.com/episode/example6",
    spotifyEmbedId: "example6",
    applePodcastsUrl: "https://podcasts.apple.com/episode/example6",
    showNotes:
      "Í þessum þætti ræddum við helstu opnanir sem byrjendur ættu að þekkja, þar á meðal Ítölsku opnunina, Spænsku opnunina og Sicilísku vörnina.",
  },
  {
    slug: "midleikurinn-er-lykilinn",
    title: "Miðleikurinn er lykillinn",
    episodeNumber: 5,
    date: "2026-03-27",
    description:
      "Miðleikurinn er þar sem flest skák ræðst. Við skoðum aðferðir og hugsun sem skipta máli.",
    guests: [],
    topics: ["Miðleikur", "Stefna", "Taktík"],
    thumbnail: "/images/ep5.jpg",
    spotifyUrl: "https://open.spotify.com/episode/example5",
    spotifyEmbedId: "example5",
    applePodcastsUrl: "https://podcasts.apple.com/episode/example5",
    showNotes:
      "Birkir og Leifur fara yfir mikilvægi miðleiksins, peðabyggingar, hlutaskipti og hvernig á að meta stöðu.",
  },
  {
    slug: "magnus-carlsen-og-heimsmeistaramotid",
    title: "Magnus Carlsen og heimsmeistaramótið",
    episodeNumber: 4,
    date: "2026-03-13",
    description:
      "Við ræðum feril Magnus Carlsen og áhrif hans á skákheiminn, ásamt nýjustu fréttum af heimsmeistaramótinu.",
    guests: ["Friðrik Ólafsson"],
    topics: ["Magnus Carlsen", "Heimsmeistaramót", "Fréttir"],
    thumbnail: "/images/ep4.jpg",
    spotifyUrl: "https://open.spotify.com/episode/example4",
    spotifyEmbedId: "example4",
    applePodcastsUrl: "https://podcasts.apple.com/episode/example4",
    showNotes:
      "Gesturinn Friðrik Ólafsson deildi sinni reynslu af alþjóðlegum skákmótum og ræddi framtíð Magnus á sviðinu.",
  },
  {
    slug: "lokaleikur-med-turnum",
    title: "Lokaleikur með turnum",
    episodeNumber: 3,
    date: "2026-02-27",
    description:
      "Turnalokaleikur er einn algengasti lokaleikurinn. Við skoðum helstu meginreglur og dæmi.",
    guests: [],
    topics: ["Lokaleikur", "Turnar", "Tækni"],
    thumbnail: "/images/ep3.jpg",
    spotifyUrl: "https://open.spotify.com/episode/example3",
    spotifyEmbedId: "example3",
    applePodcastsUrl: "https://podcasts.apple.com/episode/example3",
    showNotes:
      "Við fórum yfir Lucena stöðuna, Philidor vörnina og aðrar mikilvægar turnalokaleiksstöður.",
  },
  {
    slug: "skak-og-gervigreind",
    title: "Skák og gervigreind",
    episodeNumber: 2,
    date: "2026-02-13",
    description:
      "Hvernig hefur gervigreind breytt skákheiminum? Við skoðum áhrif Stockfish og AlphaZero.",
    guests: ["Helgi Þórðarson"],
    topics: ["Gervigreind", "Stockfish", "AlphaZero", "Tækni"],
    thumbnail: "/images/ep2.jpg",
    spotifyUrl: "https://open.spotify.com/episode/example2",
    spotifyEmbedId: "example2",
    applePodcastsUrl: "https://podcasts.apple.com/episode/example2",
    showNotes:
      "Helgi Þórðarson, tölvunarfræðingur og skákaðdáandi, ræddi um þróun skákvéla og hvernig þær hafa breytt undirbúningi spilaranna.",
  },
  {
    slug: "hvad-er-chess-after-dark",
    title: "Hvað er Chess After Dark?",
    episodeNumber: 1,
    date: "2026-01-30",
    description:
      "Fyrsti þátturinn! Við kynnum okkur, hlaðvarpið og hvað er framundan.",
    guests: [],
    topics: ["Kynning", "Skák", "Hlaðvarp"],
    thumbnail: "/images/ep1.jpg",
    spotifyUrl: "https://open.spotify.com/episode/example1",
    spotifyEmbedId: "example1",
    applePodcastsUrl: "https://podcasts.apple.com/episode/example1",
    showNotes:
      "Birkir Karl og Leifur kynna sig og hlaðvarpið Chess After Dark. Þeir ræða ástríðu sína fyrir skák og hvað hlustendur geta vænst.",
  },
];
