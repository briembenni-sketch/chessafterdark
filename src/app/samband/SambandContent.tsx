'use client';

import { useState } from 'react';
import {
  Mail,
  Plus,
  X,
} from 'lucide-react';
import {
  SiSpotify,
  SiApplepodcasts,
  SiYoutube,
  SiInstagram,
  SiTiktok,
  SiFacebook,
} from 'react-icons/si';

const socialLinks = [
  { name: 'Spotify', url: 'https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO', Icon: SiSpotify },
  { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624', Icon: SiApplepodcasts },
  { name: 'YouTube', url: 'https://www.youtube.com/@chessafterdark7953', Icon: SiYoutube },
  { name: 'Instagram', url: 'https://www.instagram.com/chessafterdark/', Icon: SiInstagram },
  { name: 'TikTok', url: 'https://www.tiktok.com/@chessafterdark', Icon: SiTiktok },
  { name: 'Facebook', url: 'https://www.facebook.com/groups/1795565437272966', Icon: SiFacebook },
].filter(link => link.url);

const faqs = [
  {
    q: 'Ég vil koma sem gestur í þáttinn',
    a: 'Sendu okkur póst á chessafterdark@chessafterdark.is með stuttri kynningu á þér og hvað þig langar að ræða. Við reynum að svara innan sólarhrings og bókum oft gesti nokkrar vikur fram í tímann.',
  },
  {
    q: 'Ég vil styrkja þáttinn',
    a: 'Við tökum fagnandi á móti styrktaraðilum. Sendu póst með upplýsingum um fyrirtæki þitt og þær tegundir af samstarfi sem vekja áhuga þinn, svo framleiðum við tillögu fyrir þig.',
  },
  {
    q: 'Ég hef hugmynd að umræðuefni',
    a: 'Allar góðar hugmyndir eru velkomnar. Sendu okkur línu með hugmyndinni þinni. Bestu þættir okkar hafa oft komið úr ábendingum frá hlustendum.',
  },
  {
    q: 'Fjölmiðlafyrirspurnir',
    a: 'Fyrir viðtöl, tilvitnanir eða myndaefni fyrir fjölmiðla, sendu póst á chessafterdark@chessafterdark.is og merktu hann "Fjölmiðlar" í efnislínu.',
  },
];

export default function SambandContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <>
      {/* ── SECTION 1: HERO ── */}
      <section
        className="relative overflow-hidden text-center"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(0,79,254,0.15) 0%, #0a1428 65%)',
          padding: '64px 32px 48px',
        }}
      >
        {/* Decorative blurred circle */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: '-60px',
            right: '-60px',
            width: 300,
            height: 300,
            background:
              'radial-gradient(circle, rgba(0,79,254,0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10">
          <p className="text-cad-light text-xs tracking-widest mb-4">
            HAFÐU SAMBAND
          </p>
          <h1
            className="text-5xl font-medium mb-4"
            style={{ letterSpacing: '-0.02em' }}
          >
            Tölum saman
          </h1>
          <p
            className="mx-auto leading-relaxed text-white/65"
            style={{ maxWidth: 520 }}
          >
            Hvort sem þú ert með hugmynd að þætti, vilt koma í viðtal eða
            bjóða styrk. Við hlökkum til að heyra frá þér.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: EMAIL CARD (centered) ── */}
      <section className="px-8 py-10 max-w-5xl mx-auto">
        <div className="mx-auto max-w-md">
          <div
            className="rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: '#0f1f3d',
              border: '0.5px solid rgba(0,79,254,0.15)',
              padding: 28,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(0,79,254,0.4)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = 'rgba(0,79,254,0.15)')
            }
          >
            <div
              className="flex items-center justify-center rounded-lg mb-4"
              style={{
                width: 40,
                height: 40,
                background: 'rgba(0,79,254,0.15)',
                border: '0.5px solid rgba(0,79,254,0.3)',
              }}
            >
              <Mail size={18} className="text-cad-light" aria-hidden="true" />
            </div>
            <p className="text-cad-light text-[10px] tracking-widest mb-1.5">
              TÖLVUPÓSTUR
            </p>
            <h3 className="text-base font-medium mb-1">Bein lína</h3>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Sendu okkur póst, við svörum innan sólarhrings.
            </p>
            <div
              className="rounded-lg text-white text-base"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                padding: '10px 12px',
              }}
            >
              <a
                href="mailto:chessafterdark@chessafterdark.is"
                className="break-all hover:text-cad-light transition-colors focus:outline-none focus:ring-2 focus:ring-cad-electric rounded"
              >
                chessafterdark@chessafterdark.is
              </a>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText('chessafterdark@chessafterdark.is');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-3 text-[11px] uppercase tracking-widest text-cad-light/60 hover:text-cad-light transition-colors font-medium cursor-pointer"
            >
              {copied ? 'Afritað \u2713' : 'Afrita netfang'}
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SOCIAL MEDIA ROW ── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="block w-[3px] h-4 bg-cad-electric" />
            <span className="text-[11px] uppercase tracking-widest text-cad-light font-medium">
              Samfélagsmiðlar
            </span>
          </div>
          <h2 className="text-3xl font-medium text-white mb-10">
            Fylgstu með okkur
          </h2>
          <div className="flex items-center justify-center gap-10 flex-wrap">
            {socialLinks.map(({ name, url, Icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Chess After Dark á ${name}`}
                className="group relative text-cad-light/60 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Icon className="w-7 h-7" />
                <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-cad-light opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium">
                  {name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: FAQ ACCORDION ── */}
      <section className="px-8 py-10">
        <div className="text-center mb-7">
          <p className="text-cad-light tracking-widest text-xs mb-2">
            ALGENGAR FYRIRSPURNIR
          </p>
          <h2 className="text-2xl font-medium">
            Hvernig get ég haft samband?
          </h2>
        </div>

        <div className="flex flex-col gap-2 mx-auto" style={{ maxWidth: 640 }}>
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl transition-all duration-200"
                style={{
                  background: '#0f1f3d',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderColor: isOpen
                    ? 'rgba(0,79,254,0.3)'
                    : 'rgba(255,255,255,0.08)',
                  padding: '16px 20px',
                }}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-cad-electric rounded"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium">{faq.q}</span>
                  <span
                    className="text-white/60 transition-transform duration-200 ml-4 shrink-0"
                    style={{
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    }}
                  >
                    {isOpen ? <X size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: isOpen ? 200 : 0 }}
                >
                  <div
                    className="pt-3 mt-3"
                    style={{
                      borderTop: '0.5px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <p className="text-white/70 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 5: BRAND FOOTER BAND ── */}
      <section
        className="text-center"
        style={{
          background: '#0f1f3d',
          padding: '40px 32px',
          borderTop: '0.5px solid rgba(255,255,255,0.05)',
        }}
      >
        <p className="text-cad-light text-sm tracking-widest mb-1.5">
          TRAUST &middot; HEIÐARLEIKI &middot; GAGNSÆI
        </p>
        <p className="text-white/50 text-sm">Chess After Dark &middot; Síðan 2019</p>
      </section>
    </>
  );
}
