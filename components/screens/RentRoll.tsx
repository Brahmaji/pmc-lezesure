'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Shell } from '@/components/Shell';
import { Avatar, Button, Card, Eyebrow, Pill, SegmentedControl } from '@/components/ui';
import { partner, tenants } from '@/lib/data';
import { rules } from '@/lib/rules';
import { onRoll, rowNotice, searchTenants, statusOf, summarise } from '@/lib/selectors';
import { usePortal } from '@/lib/store';
import { color, font, gradient, shadow } from '@/lib/theme';
import type { RowStatus } from '@/lib/types';

const STATUS_COPY: Record<RowStatus, { label: string; tone: 'brand' | 'warn' | 'mute' }> = {
  paid: { label: 'Reporting as paid', tone: 'brand' },
  flagged: { label: 'Flagged · held', tone: 'warn' },
  verifying: { label: 'Verifying ID', tone: 'warn' },
  withdrawn: { label: 'Consent withdrawn', tone: 'mute' },
};

export function RentRoll() {
  const router = useRouter();
  const { rowStatus, flags } = usePortal();
  const [query, setQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');

  const stats = summarise(tenants, rowStatus, flags);

  const rows = useMemo(() => {
    const base = onRoll(tenants).filter((t) => propertyFilter === 'all' || t.addr === propertyFilter);
    return searchTenants(base, query);
  }, [query, propertyFilter]);

  const propertyOptions = useMemo(() => {
    const addrs = Array.from(new Set(tenants.map((t) => t.addr)));
    return [{ value: 'all', label: 'All properties' }, ...addrs.map((a) => ({ value: a, label: a }))];
  }, []);

  return (
    <Shell
      title={partner.currentMonth.replace(' 2026', '') + ' rent roll'}
      subtitle={partner.company + ' · ' + stats.enrolled + ' enrolled tenants across ' + stats.units + ' units'}
      actions={
        <>
          <Button href="/tenants/new" tone="ghost" size="md">
            Add tenants
          </Button>
          <Button href="/flag" size="md">
            Report a missed payment
          </Button>
        </>
      }
    >
      <div className="ls-split" style={{ gap: 22, alignItems: 'start', ['--rail']: '330px' } as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Stat
              k="ENROLLED TENANTS"
              v={String(stats.enrolled)}
              d={'across ' + stats.units + ' units'}
              bg={gradient.feature}
              border="1px solid #d3e8f9"
            />
            <Stat
              k="REPORTING AS PAID"
              v={String(stats.reportingAsPaid)}
              d="everyone you haven't flagged"
              bg={gradient.card}
              border={'1px solid ' + color.line}
            />
            <Stat
              k="FLAGGED"
              v={String(stats.flagged)}
              d={'in the ' + rules.graceDays + '-day grace window'}
              bg={gradient.warn}
              border={'1px solid ' + color.warnLine}
            />
            <Stat
              k="NEEDS ATTENTION"
              v={String(stats.disputed + stats.verifying + stats.withdrawn)}
              d={stats.disputed + ' disputed · ' + stats.verifying + ' verifying · ' + stats.withdrawn + ' withdrawn'}
              bg={gradient.card}
              border={'1px solid ' + color.line}
            />
          </div>

          <Banner count={stats.reportingAsPaid} />
          {stats.leasesEnding > 0 ? <LeaseEndingBanner count={stats.leasesEnding} /> : null}

          <div
            style={{
              borderRadius: 22,
              background: gradient.card,
              border: '1px solid ' + color.line,
              boxShadow: shadow.card,
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '20px 24px 16px' }}>
              <div style={{ font: '600 14.5px/1 ' + font.family, letterSpacing: '-.01em', color: color.ink }}>
                Enrolled tenants
              </div>
              <SegmentedControl
                options={[
                  { value: 'roll', label: 'Enrolled · ' + stats.enrolled },
                  { value: 'consent', label: 'Awaiting consent · ' + stats.awaitingConsent },
                ]}
                value="roll"
                onChange={(v) => {
                  if (v === 'consent') router.push('/tenants/new');
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, padding: '0 24px 16px', flexWrap: 'wrap' }}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tenant, unit or lease reference"
                style={{
                  flex: '1 1 260px',
                  minWidth: 0,
                  height: 46,
                  padding: '0 15px',
                  border: '1px solid #d9e6f5',
                  borderRadius: 13,
                  background: gradient.field,
                  outline: 'none',
                  font: '500 13.5px ' + font.family,
                  color: color.ink,
                }}
              />
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                style={{
                  height: 46,
                  padding: '0 12px',
                  border: '1px solid #d9e6f5',
                  borderRadius: 13,
                  background: gradient.field,
                  font: '500 13px ' + font.family,
                  color: color.ink,
                }}
              >
                {propertyOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="ls-rollhead">
              {['UNIT & TENANT', 'RENT · DUE', 'ENROLLED', ''].map((h, i) => (
                <span
                  key={h + i}
                  style={{ font: '600 9px/1 ' + font.family, letterSpacing: '.12em', color: color.label, textAlign: i === 3 ? 'right' : 'left' }}
                >
                  {h}
                </span>
              ))}
            </div>

            {rows.map((t) => {
              const status = statusOf(t, rowStatus);
              const copy = STATUS_COPY[status];
              const notice = rowNotice(t);
              return (
                <Link
                  key={t.id}
                  href={'/roll/tenant?id=' + t.id}
                  className="ls-row ls-rollrow"
                  style={{
                    background:
                      status === 'flagged' ? 'linear-gradient(120deg,#fffdf8,#fffaf1)' : status === 'withdrawn' ? '#f8f9fb' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                    <Avatar initials={t.initials} tone={copy.tone} />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          font: '600 13px/1.3 ' + font.family,
                          color: status === 'withdrawn' ? color.ghost : color.ink,
                          marginBottom: 2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {t.unit}
                      </div>
                      <div style={{ font: '400 11px/1.3 ' + font.family, color: color.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.name} · {t.ref}
                      </div>
                      {notice ? (
                        <div style={{ font: '600 10px/1.3 ' + font.family, color: color.warnInk, marginTop: 2 }}>{notice}</div>
                      ) : null}
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ font: '600 13px/1.3 ' + font.family, color: status === 'withdrawn' ? color.ghost : color.ink }}>
                      {t.shared ? 'Co-tenant · share declared' : t.rent}
                    </div>
                    <div style={{ font: '400 10.5px/1.3 ' + font.family, color: color.ghost }}>Due {t.dueDay}</div>
                  </div>
                  <div>
                    <div style={{ font: '500 12.5px/1.3 ' + font.family, color: color.muted }}>{t.months} mo</div>
                    <div style={{ font: '400 10.5px/1.3 ' + font.family, color: color.ghost, whiteSpace: 'nowrap' }}>
                      {status === 'withdrawn' ? 'Withdrawn 28 Aug' : 'Since ' + t.consentDate}
                    </div>
                  </div>
                  <div>
                    <StatusTag status={status} label={copy.label} />
                  </div>
                </Link>
              );
            })}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', padding: '16px 24px' }}>
              <span style={{ font: '400 12px/1 ' + font.family, color: color.faint }}>
                {query || propertyFilter !== 'all'
                  ? 'Showing ' + rows.length + ' matching tenants'
                  : 'Showing all ' + rows.length + ' tenants on the roll'}
              </span>
              <Link href="/flag" style={{ font: '600 12.5px ' + font.family }}>
                Report a missed payment
              </Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card tone="feature">
            <Eyebrow tone="brand">HOW REPORTING WORKS</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.inkSoft, textWrap: 'pretty' as never }}>
              Every enrolled tenant is reported as paid on the {rules.filingDay}th unless you flag them. You only ever
              touch the exceptions — a flagged month is held, and the tenant gets {rules.graceDays} days to resolve it
              before anything reaches Equifax.
            </div>
          </Card>
          <Card>
            <Eyebrow>WHAT YOU CAN SEE</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Whether a tenant is enrolled and consented', true],
                ['How many months you have reported for them', true],
                ['Their credit score or credit file', false],
                ['Their declared share of the rent', false],
              ].map(([label, yes]) => (
                <div key={String(label)} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <YesNo yes={Boolean(yes)} />
                  <span style={{ font: '400 12px/1.5 ' + font.family, color: yes ? '#3d4d6d' : color.ghost }}>{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Stat({ k, v, d, bg, border }: { k: string; v: string; d: string; bg: string; border: string }) {
  return (
    <div style={{ flex: 1, padding: '18px 20px', borderRadius: 19, background: bg, border }}>
      <div style={{ font: '500 9px/1 ' + font.family, letterSpacing: '.12em', color: color.muted, marginBottom: 10 }}>{k}</div>
      <div style={{ font: '700 26px/1 ' + font.family, letterSpacing: '-.03em', color: color.ink, marginBottom: 6 }}>{v}</div>
      <div style={{ font: '400 10.5px/1.35 ' + font.family, color: color.faint }}>{d}</div>
    </div>
  );
}

function Banner({ count }: { count: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '19px 22px',
        borderRadius: 20,
        background: gradient.info,
        border: '1px solid ' + color.brandPale,
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          flex: 'none',
          borderRadius: 14,
          background: 'linear-gradient(140deg,#1f5fa8,#469FE0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="8.4" stroke="#fff" strokeWidth="1.8" />
          <path d="M12 7.4v5.2l3.4 2" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: '600 15px/1.3 ' + font.family, letterSpacing: '-.01em', color: color.ink, marginBottom: 4 }}>
          {count} tenants will be reported as paid on {rules.filingLabel}
        </div>
        <div style={{ font: '400 12.5px/1.45 ' + font.family, color: color.inkSoft }}>
          Anyone who hadn&apos;t paid by their due date needs a flag before then. Missed one? Correct a month for up to{' '}
          {rules.correctionWindowDays} days — it goes in the next file.
        </div>
      </div>
      <div style={{ font: '700 25px/1 ' + font.family, letterSpacing: '-.03em', color: color.brandOn }}>
        8<span style={{ font: '600 12px/1 ' + font.family, color: color.muted }}> days</span>
      </div>
    </div>
  );
}

function LeaseEndingBanner({ count }: { count: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 22px',
        borderRadius: 20,
        background: gradient.warn,
        border: '1px solid ' + color.warnLine,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          flex: 'none',
          borderRadius: 12,
          background: gradient.warnSolid,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3.6" y="5.4" width="16.8" height="15" rx="2.6" stroke="#fff" strokeWidth="1.8" />
          <path d="M3.6 10h16.8M8.4 3.4v3.4M15.6 3.4v3.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: '600 13.5px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>
          {count} leases end 30 September
        </div>
        <div style={{ font: '400 12px/1.45 ' + font.family, color: color.warnInkSoft }}>
          Reporting pauses at lease end until you confirm a renewal or month-to-month. The tenant is told the day it
          pauses.
        </div>
      </div>
    </div>
  );
}

function StatusTag({ status, label }: { status: RowStatus; label: string }) {
  if (status === 'withdrawn') {
    return (
      <Pill bg={color.neutralBg} border={'1px solid ' + color.neutralLine} fg={color.label}>
        CONSENT WITHDRAWN
      </Pill>
    );
  }
  const dot =
    status === 'paid' ? (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'linear-gradient(140deg,#1f5fa8,#469FE0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 12.6l3.7 3.6L18 7.6" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ) : status === 'flagged' ? (
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: gradient.warnSolid,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 7.6v6M12 16.4v.1" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    ) : (
      <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px dashed #e0b354' }} />
    );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      {dot}
      <span style={{ font: '600 11.5px/1 ' + font.family, color: status === 'paid' ? '#155086' : color.warnInk }}>
        {label}
      </span>
    </div>
  );
}

function YesNo({ yes }: { yes: boolean }) {
  return yes ? (
    <div
      style={{
        width: 18,
        height: 18,
        flex: 'none',
        borderRadius: '50%',
        background: 'linear-gradient(135deg,#1f5fa8,#469FE0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6 12.6l3.7 3.6L18 7.6" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div
      style={{
        width: 18,
        height: 18,
        flex: 'none',
        borderRadius: '50%',
        background: '#eef2f7',
        border: '1px solid #dde5ef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
      }}
    >
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4" stroke="#a3b4cb" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </div>
  );
}
