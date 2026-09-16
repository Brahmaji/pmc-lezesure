'use client';

import Link from 'next/link';
import { LogoMark } from '@/components/LogoMark';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
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

  const badgeValue = (kind: 'flags' | 'consent' | null) => {
    if (kind === 'flags') return String(stats.flagged + stats.disputed);
    if (kind === 'consent') return String(stats.awaitingConsent);
    return null;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: gradient.page }}>
      <aside
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
        <Link href="/roll" style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '0 8px', marginBottom: 6 }}>
          <LogoMark />
          <span style={{ font: '700 16px/1 ' + font.family, letterSpacing: '-.015em', color: color.ink }}>
            Leaze<span style={{ color: color.brandMid }}>Sure</span>
          </span>
        </Link>
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
        <header
          style={{
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            padding: '26px 40px',
            borderBottom: '1px solid rgba(30,90,150,.08)',
          }}
        >
          <div>
            <div style={{ font: '400 12.5px/1.3 ' + font.family, color: color.muted, marginBottom: 5 }}>{subtitle}</div>
            <h1 style={{ font: '700 24px/1.15 ' + font.family, letterSpacing: '-.025em', color: color.ink, margin: 0 }}>
              {title}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            {actions}
            <Link
              href="/account"
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
        <div style={{ flex: 1, padding: '26px 40px 40px' }}>{children}</div>
      </main>
    </div>
  );
}
