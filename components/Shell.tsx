'use client';

import Link from 'next/link';
import { LogoMark } from '@/components/LogoMark';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { partner, tenants } from '@/lib/data';
import { summarise } from '@/lib/selectors';
import { usePortal } from '@/lib/store';
import { color, font, gradient, shadow } from '@/lib/theme';

const NAV = [
  { href: '/roll', label: 'Rent roll', badge: null as 'flags' | 'consent' | null },
  { href: '/flags', label: 'Flags & disputes', badge: 'flags' as const },
  { href: '/tenants/new', label: 'Add tenants', badge: 'consent' as const },
  { href: '/properties', label: 'Properties', badge: null },
];

const UTILITY = [
  { href: '/account', label: 'Account & team' },
  { href: '/support', label: 'Support' },
  { href: '/signin', label: 'Sign out' },
];

export function Shell({ title, subtitle, actions, children }: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { rowStatus, flags } = usePortal();
  const stats = summarise(tenants, rowStatus, flags);
  const [navOpen, setNavOpen] = useState(false);
  const [navPath, setNavPath] = useState(pathname);

  // Tapping a nav item navigates; close the drawer so it isn't left covering
  // the page the user just asked for. Adjusting state during render is React's
  // documented way to reset on a changed value — an effect would flag under
  // react-hooks/set-state-in-effect and cost an extra commit.
  if (navPath !== pathname) {
    setNavPath(pathname);
    setNavOpen(false);
  }

  // While the drawer covers the page: Escape closes it, and the page behind
  // must not scroll under the user's finger.
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [navOpen]);

  const badgeValue = (kind: 'flags' | 'consent' | null) => {
    if (kind === 'flags') return String(stats.flagged + stats.disputed);
    if (kind === 'consent') return String(stats.awaitingConsent);
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: gradient.page }}>
      <div className="ls-scrim" data-open={navOpen ? 'true' : 'false'} onClick={() => setNavOpen(false)} aria-hidden />
      <aside
        id="ls-nav"
        className="ls-rail"
        data-open={navOpen ? 'true' : 'false'}
        style={{
          flex: 'none',
          width: 252,
          display: 'flex',
          flexDirection: 'column',
          padding: '26px 18px 22px',
          background: gradient.rail,
          borderRight: '1px solid #e2ecf7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <Link href="/roll" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 8px' }}>
            <LogoMark />
            <span style={{ font: '700 16px/1 ' + font.family, letterSpacing: '-.015em', color: color.ink }}>
              Leaze<span style={{ color: color.brandMid }}>Sure</span>
            </span>
          </Link>
          <button
            type="button"
            className="ls-rail-close"
            onClick={() => setNavOpen(false)}
            aria-label="Close navigation"
            style={{
              flex: 'none',
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
              border: '1px solid ' + color.line,
              borderRadius: 11,
              background: gradient.ghostBtn,
              color: color.body,
              cursor: 'pointer',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div style={{ font: '500 9px/1 ' + font.family, letterSpacing: '.15em', color: '#a3b4cb', padding: '0 8px', marginBottom: 22 }}>
          PARTNER PORTAL
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {NAV.map((item) => {
            const on = pathname === item.href || pathname.startsWith(item.href + '/');
            const badge = badgeValue(item.badge);
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '12px 14px',
                  borderRadius: 13,
                  background: on ? gradient.chipOn : 'transparent',
                  boxShadow: on ? shadow.rail : 'none',
                  color: on ? '#fff' : color.body,
                }}
              >
                <span style={{ flex: 1, font: (on ? '600 13px ' : '500 13px ') + font.family, letterSpacing: '-.005em' }}>
                  {item.label}
                </span>
                {badge && badge !== '0' ? (
                  <span
                    style={{
                      font: '600 9.5px/1 ' + font.family,
                      color: on ? '#fff' : color.warnInk,
                      padding: '5px 8px',
                      borderRadius: 20,
                      background: on ? 'rgba(255,255,255,.22)' : gradient.warnChip,
                    }}
                  >
                    {badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1, minHeight: 18 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 14 }}>
          {UTILITY.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ padding: '10px 14px', borderRadius: 11, font: '500 12.5px ' + font.family, color: color.body }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', font: '400 10px/1.6 ' + font.family, color: '#a3b4cb' }}>
          LeazeSure Technologies Inc.
          <br />
          Partner portal v1.0
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div className="ls-topbar">
          <button
            type="button"
            className="ls-burger"
            onClick={() => setNavOpen(true)}
            aria-label="Open navigation"
            aria-expanded={navOpen}
            aria-controls="ls-nav"
            style={{
              flex: 'none',
              width: 42,
              height: 42,
              display: 'grid',
              placeItems: 'center',
              border: '1px solid ' + color.line,
              borderRadius: 12,
              background: gradient.ghostBtn,
              color: color.brandDeep,
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/roll" style={{ display: 'flex', alignItems: 'center', gap: 9, flex: 1, minWidth: 0 }}>
            <LogoMark size={26} />
            <span style={{ font: '700 15px/1 ' + font.family, letterSpacing: '-.015em', color: color.ink }}>
              Leaze<span style={{ color: color.brandMid }}>Sure</span>
            </span>
          </Link>
          <Link
            href="/account"
            style={{
              flex: 'none',
              width: 38,
              height: 38,
              border: '1px solid #d5e6f6',
              borderRadius: '50%',
              background: 'linear-gradient(140deg,#ffffff,#e2f1fd)',
              color: '#1b4f8f',
              font: '600 13px/38px ' + font.family,
              textAlign: 'center',
            }}
            title={partner.signatory}
          >
            RC
          </Link>
        </div>
        <header
          className="ls-pagehead"
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            borderBottom: '1px solid rgba(30,90,150,.08)',
          }}
        >
          {/* A basis rather than auto: without it this block shrinks to a few pixels
              at phone width and the title wraps one word per line, instead of the
              action buttons dropping to their own row. */}
          <div style={{ flex: '1 1 220px', minWidth: 0 }}>
            <div style={{ font: '400 12.5px/1.3 ' + font.family, color: color.muted, marginBottom: 5 }}>{subtitle}</div>
            <h1 style={{ font: '700 24px/1.15 ' + font.family, letterSpacing: '-.025em', color: color.ink, margin: 0 }}>
              {title}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, flexWrap: 'wrap' }}>
            {actions}
            <Link
              href="/account"
              className="ls-head-avatar"
              style={{
                width: 42,
                height: 42,
                border: '1px solid #d5e6f6',
                borderRadius: '50%',
                background: 'linear-gradient(140deg,#ffffff,#e2f1fd)',
                color: '#1b4f8f',
                font: '600 14px/42px ' + font.family,
                textAlign: 'center',
              }}
              title={partner.signatory}
            >
              RC
            </Link>
          </div>
        </header>
        <div className="ls-content" style={{ flex: 1 }}>{children}</div>
      </main>
    </div>
  );
}
