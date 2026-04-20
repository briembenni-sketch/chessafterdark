import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-cad-dark border-t border-white/[0.05] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logos/cad-logo-white.png"
                alt="Chess After Dark"
                width={160}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-sm mb-3">
              Hlaðvarp um knattspyrnu, fjármál, pólitík og margt fleira.
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
              <Link href="/thattastjornendur" className="text-muted text-sm hover:text-cad-light transition-colors">
                Þáttastjórnendur
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
