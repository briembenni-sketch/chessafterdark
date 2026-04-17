import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a1428] border-t border-white/[0.05] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cad-bright to-cad-blue" />
              <span className="text-sm font-semibold text-white tracking-widest uppercase">
                Chess After Dark
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm mb-3">
              Hlaðvarp um knattspyrnu, fjármál, pólitík og margt fleira — með Birki Karl og Leifi.
            </p>
            <p className="text-cad-light text-xs tracking-widest uppercase">
              Traust · Heiðarleiki · Gagnsæi
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Efni
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/thaettir" className="text-muted text-sm hover:text-cad-light transition-colors">
                Þættir
              </Link>
              <Link href="/hyslarnir" className="text-muted text-sm hover:text-cad-light transition-colors">
                Hýslarnir
              </Link>
              <Link href="/vidburdir" className="text-muted text-sm hover:text-cad-light transition-colors">
                Viðburðir
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-white text-xs font-semibold tracking-widest uppercase mb-4">
              Samband
            </h4>
            <div className="flex flex-col gap-2 text-muted text-sm">
              <a href="mailto:chessafterdark@gmail.com" className="hover:text-cad-light transition-colors">
                chessafterdark@gmail.com
              </a>
              <p>Reykjavík, Ísland</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.05] mt-10 pt-6 text-center text-muted text-sm">
          © {new Date().getFullYear()} Chess After Dark. Allur réttur áskilinn.
        </div>
      </div>
    </footer>
  );
}
