import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hýslarnir",
  description:
    "Kynntu þér hýslana Chess After Dark: Birki Karl Sigurðsson og Leif Þorsteinsson.",
  openGraph: {
    title: "Hýslarnir | Chess After Dark",
    description:
      "Kynntu þér hýslana Chess After Dark: Birki Karl Sigurðsson og Leif Þorsteinsson.",
  },
};

const hosts = [
  {
    name: "Birkir Karl Sigurðsson",
    bio: "Birkir Karl er ástríðufullur skákmaður og einn af stofnendum Chess After Dark. Hann hefur spilað skák frá bernsku og tekur virkan þátt í íslensku skáksamfélaginu. Birkir Karl leggur áherslu á traust og gagnsæi í skákumræðu.",
    social: {
      instagram: "#",
      twitter: "#",
    },
  },
  {
    name: "Leifur Þorsteinsson",
    bio: "Leifur er meðstofnandi Chess After Dark og hefur brennandi áhuga á skák og skáksögu. Hann nýtur þess að rýna í leiki heimsmeistaranna og deila þekkingu sinni með hlustendum. Leifur leggur áherslu á heiðarleika og gagnrýna hugsun.",
    social: {
      instagram: "#",
      twitter: "#",
    },
  },
];

export default function HyslarPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Hýslarnir</h1>
      <p className="text-muted mb-12">
        Kynntu þér fólkið á bak við Chess After Dark.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hosts.map((host) => (
          <div
            key={host.name}
            className="bg-bg-secondary border border-blue-main/20 rounded-xl p-6 md:p-8"
          >
            {/* Avatar placeholder */}
            <div className="w-24 h-24 rounded-full bg-blue-main/20 flex items-center justify-center mb-6 text-3xl">
              ♟
            </div>

            <h2 className="text-2xl font-bold text-white mb-4">{host.name}</h2>
            <p className="text-muted leading-relaxed mb-6">{host.bio}</p>

            <div className="flex gap-3">
              <a
                href={host.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-main/20 hover:bg-blue-main/40 text-blue-light hover:text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Instagram
              </a>
              <a
                href={host.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-main/20 hover:bg-blue-main/40 text-blue-light hover:text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Twitter / X
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
