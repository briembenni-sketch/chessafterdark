import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-bg-secondary border-t border-blue-main/30 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-3">♟ Chess After Dark</h3>
            <p className="text-muted text-sm">
              TRAUST · HEIÐARLEIKI · GAGNSÆI
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Tenglar</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/thaettir"
                className="text-muted text-sm hover:text-blue-light transition-colors"
              >
                Þættir
              </Link>
              <Link
                href="/hyslarnir"
                className="text-muted text-sm hover:text-blue-light transition-colors"
              >
                Hýslarnir
              </Link>
              <Link
                href="/samband"
                className="text-muted text-sm hover:text-blue-light transition-colors"
              >
                Samband
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Hlustaðu</h4>
            <nav className="flex flex-col gap-2">
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted text-sm hover:text-blue-light transition-colors"
              >
                Spotify
              </a>
              <a
                href="https://podcasts.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted text-sm hover:text-blue-light transition-colors"
              >
                Apple Podcasts
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted text-sm hover:text-blue-light transition-colors"
              >
                YouTube
              </a>
              <a
                href="https://twitch.tv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted text-sm hover:text-blue-light transition-colors"
              >
                Twitch
              </a>
            </nav>
          </div>
        </div>

        <div className="border-t border-blue-main/20 mt-8 pt-6 text-center text-muted text-sm">
          © {new Date().getFullYear()} Chess After Dark. Allur réttur áskilinn.
        </div>
      </div>
    </footer>
  );
}
