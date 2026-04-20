'use client';

import { useState } from 'react';
import {
  Mail,
  MapPin,
  Plus,
  X,
} from 'lucide-react';

const socials = [
  {
    name: 'Spotify',
    action: 'Hlusta',
    href: 'https://open.spotify.com/show/1k1Ak6f8wFba3DzJzrNLTO',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    name: 'Apple',
    action: 'Podcasts',
    href: 'https://podcasts.apple.com/is/podcast/chess-after-dark/id1592499624',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    action: 'Horfa',
    href: 'https://www.youtube.com/@chessafterdark7953',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    action: 'Fylgja',
    href: 'https://www.instagram.com/chessafterdark/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    action: 'Fylgja',
    href: 'https://www.tiktok.com/@chessafterdark',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    action: 'Hópur',
    href: 'https://www.facebook.com/groups/1795565437272966',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

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
    a: 'Allar góðar hugmyndir eru velkomnar. Sendu okkur línu með hugmyndinni þinni — bestu þættir okkar hafa oft komið úr ábendingum frá hlustendum.',
  },
  {
    q: 'Fjölmiðlafyrirspurnir',
    a: 'Fyrir viðtöl, tilvitnanir eða myndaefni fyrir fjölmiðla, sendu póst á chessafterdark@chessafterdark.is og merktu hann "Fjölmiðlar" í efnislínu.',
  },
];

export default function SambandContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
            bjóða styrk — við hlökkum til að heyra frá þér.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: CONTACT METHOD CARDS ── */}
      <section className="px-8 py-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Email card */}
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
              Sendu okkur póst — við svörum innan sólarhrings.
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
          </div>

          {/* Location card */}
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
              <MapPin size={18} className="text-cad-light" aria-hidden="true" />
            </div>
            <p className="text-cad-light text-[10px] tracking-widest mb-1.5">
              STAÐSETNING
            </p>
            <h3 className="text-base font-medium mb-1">Skrifstofa</h3>
            <p className="text-white/60 text-xs leading-relaxed mb-4">
              Heimkynni þáttarins síðan 2019.
            </p>
            <div
              className="rounded-lg text-white text-base"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                padding: '10px 12px',
              }}
            >
              Hlíðasmári 8<br />
              201 Kópavogur
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: SOCIAL MEDIA GRID ── */}
      <section style={{ background: '#0f1f3d', padding: '40px 32px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-cad-light tracking-widest text-xs mb-2">
              SAMFÉLAGSMIÐLAR
            </p>
            <h2 className="text-2xl font-medium">Fylgstu með okkur</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.name} — ${s.action}`}
                className="text-center transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cad-electric rounded-[14px]"
                style={{
                  background: '#0a1428',
                  border: '0.5px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding: '20px 16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,79,254,0.4)';
                  e.currentTarget.style.background = 'rgba(0,79,254,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    'rgba(255,255,255,0.08)';
                  e.currentTarget.style.background = '#0a1428';
                }}
              >
                <div className="flex justify-center text-white mb-2.5">
                  {s.icon}
                </div>
                <p className="text-xs font-medium mb-1">{s.name}</p>
                <p className="text-[10px] text-white/45">{s.action}</p>
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
