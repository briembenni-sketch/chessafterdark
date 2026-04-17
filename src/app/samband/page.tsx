import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Samband",
  description:
    "Hafðu samband við Chess After Dark. Netfang, samfélagsmiðlar og staðsetning.",
  openGraph: {
    title: "Samband | Chess After Dark",
    description:
      "Hafðu samband við Chess After Dark. Netfang, samfélagsmiðlar og staðsetning.",
  },
};

export default function SambandPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Samband</h1>
      <p className="text-muted mb-12">
        Hafðu samband við okkur eða fylgdu okkur á samfélagsmiðlum.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="bg-bg-secondary border border-blue-main/20 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Hafa samband
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-blue-light text-sm font-semibold mb-1">
                Netfang
              </h3>
              <a
                href="mailto:chessafterdark@chessafterdark.is"
                className="text-white hover:text-blue-light transition-colors"
              >
                chessafterdark@chessafterdark.is
              </a>
            </div>

            <div>
              <h3 className="text-blue-light text-sm font-semibold mb-1">
                Heimilisfang
              </h3>
              <p className="text-muted">
                Hlíðasmári 8
                <br />
                201 Kópavogur
              </p>
            </div>
          </div>
        </div>

        {/* Social media */}
        <div className="bg-bg-secondary border border-blue-main/20 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Samfélagsmiðlar
          </h2>

          <div className="flex flex-col gap-3">
            {[
              { name: "Spotify", href: "https://open.spotify.com" },
              { name: "Apple Podcasts", href: "https://podcasts.apple.com" },
              { name: "YouTube", href: "https://youtube.com" },
              { name: "Twitch", href: "https://twitch.tv" },
              { name: "Instagram", href: "https://instagram.com" },
              { name: "Twitter / X", href: "https://twitter.com" },
            ].map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-blue-main/10 hover:bg-blue-main/20 text-blue-light hover:text-white px-4 py-3 rounded-lg transition-colors"
              >
                <span>{platform.name}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
