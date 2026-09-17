'use client';

import { useState } from 'react';
import { Shell } from '@/components/Shell';
import { Button, Card, CheckBadge, Eyebrow, Pill, StatRow } from '@/components/ui';
import { partner, properties, tenants } from '@/lib/data';
import { rules } from '@/lib/rules';
import { summarise } from '@/lib/selectors';
import { usePortal } from '@/lib/store';
import { color, font, gradient } from '@/lib/theme';

const TEAM = [
  { name: 'Ravi Chandran', role: 'Director · authorised signatory', email: 'ravi@mapleridgepm.ca', can: 'Everything, including flags' },
  { name: 'Dana Whitfield', role: 'Property manager', email: 'dana@mapleridgepm.ca', can: 'Everything, including flags' },
  { name: 'Ken Oyelaran', role: 'Accounts', email: 'ken@mapleridgepm.ca', can: 'View only — cannot flag' },
];

export function Account() {
  const { rowStatus, flags } = usePortal();
  const stats = summarise(tenants, rowStatus, flags);
  const [saved, setSaved] = useState(false);

  return (
    <Shell title="Account & team" subtitle={partner.company + ' · partner since February 2026'}>
      <div className="ls-split" style={{ display: 'grid', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card style={{ padding: '24px 26px', borderRadius: 24 }}>
            <Eyebrow>COMPANY ON FILE WITH EQUIFAX</Eyebrow>
            <div className="ls-pair" style={{ display: 'grid', gap: 12 }}>
              {[
                ['LEGAL NAME', partner.company + ' Inc.'],
                ['BUSINESS NUMBER', partner.businessNumber],
                ['PROVINCE', partner.province],
                ['AUTHORISED SIGNATORY', partner.signatory + ', ' + partner.role],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '15px 17px', borderRadius: 15, background: gradient.cardInset, border: '1px solid #e4edf8' }}>
                  <div style={{ font: '500 9px/1 ' + font.family, letterSpacing: '.11em', color: color.labelSoft, marginBottom: 7 }}>{k}</div>
                  <div style={{ font: '600 14px/1.3 ' + font.family, color: color.ink }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ font: '400 11.5px/1.5 ' + font.family, color: color.faint, marginTop: 12 }}>
              Changing any of this re-opens furnisher verification with Equifax. Contact support to start that.
            </div>
          </Card>

          <Card style={{ padding: '24px 26px', borderRadius: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Eyebrow>TEAM</Eyebrow>
              <Button tone="ghost" size="sm" onClick={() => setSaved(true)}>
                Invite a colleague
              </Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {TEAM.map((m) => (
                <div
                  key={m.email}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 13,
                    padding: '15px 16px',
                    borderRadius: 15,
                    background: gradient.cardInset,
                    border: '1px solid #e4edf8',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      flex: 'none',
                      borderRadius: 12,
                      background: gradient.avatar,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      font: '600 12px ' + font.family,
                      color: '#1b4f8f',
                    }}
                  >
                    {m.name.split(' ').map((w) => w[0]).join('')}
                  </div>
                  {/* 170px basis, not minWidth:0 — otherwise this block shrinks to a few
                      characters on a phone instead of pushing the permission pill to its
                      own line. */}
                  <div style={{ flex: '1 1 170px', minWidth: 0 }}>
                    <div style={{ font: '600 13.5px/1.3 ' + font.family, color: color.ink, marginBottom: 2 }}>{m.name}</div>
                    <div style={{ font: '400 11.5px/1.35 ' + font.family, color: color.faint }}>
                      {m.role} · {m.email}
                    </div>
                  </div>
                  <Pill>{m.can}</Pill>
                </div>
              ))}
            </div>
            {saved ? (
              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '14px 17px',
                  borderRadius: 15,
                  background: gradient.info,
                  border: '1px solid ' + color.brandPale,
                }}
              >
                <CheckBadge />
                <span style={{ font: '500 12.5px ' + font.family, color: color.ink }}>
                  Invitation sent. They&apos;ll set a password and enable two-step sign-in before they can flag anyone.
                </span>
              </div>
            ) : null}
          </Card>

          <Card style={{ padding: '24px 26px', borderRadius: 24 }}>
            <Eyebrow>SIGN-IN SECURITY</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <StatRow label="Two-step sign-in" value="Required for all users" />
              <StatRow label="Your method" value={'Text to ' + partner.phoneMasked} />
              <StatRow label="Last sign-in" value="Today, 8:42 AM · Waterloo" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
              <Button tone="ghost" size="sm">Change password</Button>
              <Button tone="ghost" size="sm">Change 2-step method</Button>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="feature">
            <Eyebrow tone="brand">YOUR PORTFOLIO</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <StatRow label="Properties" value={String(properties.length)} />
              <StatRow label="Units" value={String(stats.units)} />
              <StatRow label="Enrolled tenants" value={String(stats.enrolled)} />
              <StatRow label="Months filed since Feb" value="1,412" strong />
            </div>
          </Card>
          <Card>
            <Eyebrow>YOUR OBLIGATIONS AS A FURNISHER</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.body, textWrap: 'pretty' as never }}>
              Report accurately, flag rather than omit a missed payment, answer dispute requests within{' '}
              {rules.equifaxDisputeDays} days ({rules.equifaxFraudDisputeDays} for fraud), and never make reporting a
              condition of tenancy.
            </div>
          </Card>
          <Card>
            <Eyebrow>AGREEMENTS</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {['Data Furnisher Agreement · v1.2', 'Equifax Canada reporting terms', 'Privacy and PIPEDA schedule'].map((d) => (
                <div
                  key={d}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '12px 14px',
                    borderRadius: 13,
                    background: gradient.cardInset,
                    border: '1px solid #e4edf8',
                    font: '500 12px ' + font.family,
                    color: color.ink,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6.4 3.4h7l4.2 4.2v13c0 1-.8 1.8-1.8 1.8H6.4c-1 0-1.8-.8-1.8-1.8V5.2c0-1 .8-1.8 1.8-1.8z" stroke="#1f5fa8" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  {d}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
