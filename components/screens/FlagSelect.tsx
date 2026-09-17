'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Avatar, Button, Card, Eyebrow, Pill } from '@/components/ui';
import { tenants } from '@/lib/data';
import { rules } from '@/lib/rules';
import { statusOf } from '@/lib/selectors';
import { usePortal } from '@/lib/store';
import { color, font, gradient, shadow } from '@/lib/theme';

/**
 * Step one of reporting a miss: find the tenants. Non-consented tenants appear
 * in results but can never be selected — the portal will not report them.
 */
export function FlagSelect() {
  const router = useRouter();
  const { rowStatus, selection, selectedIds, toggleSelection, dispatch } = usePortal();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tenants
      .filter((t) => (t.unit + ' ' + t.name + ' ' + t.ref + ' ' + t.addr).toLowerCase().includes(q))
      .slice(0, 12);
  }, [query]);

  return (
    <Shell
      title="Report a missed payment"
      subtitle={'Everyone else reports as paid on the ' + rules.filingDay + 'th — you only touch the exceptions'}
      actions={<Button href="/roll" tone="ghost">Cancel</Button>}
    >
      <div className="ls-split" style={{ display: 'grid', gap: 22, alignItems: 'start' }}>
        <Card style={{ padding: '30px 32px', borderRadius: 24, boxShadow: shadow.panel }}>
          <h2 style={{ font: '700 26px/1.2 ' + font.family, letterSpacing: '-.028em', color: color.ink, margin: '0 0 8px' }}>
            Who didn&apos;t pay?
          </h2>
          <p style={{ font: '400 14px/1.6 ' + font.family, color: color.muted, margin: '0 0 22px', maxWidth: '54ch' }}>
            Search by tenant name, unit or lease reference. Select everyone on the lease you need to flag — co-tenants
            are listed separately because each has their own credit file.
          </p>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Marcus, Unit 302, or LS-003-302"
            style={{
              width: '100%',
              height: 54,
              padding: '0 17px',
              border: '1.4px solid #bcdcf6',
              borderRadius: 15,
              background: gradient.field,
              outline: 'none',
              font: '500 14.5px ' + font.family,
              color: color.ink,
              marginBottom: 16,
            }}
          />

          {!query.trim() ? (
            <div
              style={{
                padding: '30px 24px',
                borderRadius: 18,
                background: gradient.cardInset,
                border: '1px dashed #cfe0f2',
                textAlign: 'center',
                font: '400 13px/1.6 ' + font.family,
                color: color.faint,
              }}
            >
              Start typing to find a tenant. Nothing is flagged until you pick a reason on the next step.
            </div>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((t) => {
              const enrolled = t.consent === 'consented' && !t.withdrawn;
              const picked = Boolean(selection[t.id]);
              const already = statusOf(t, rowStatus) === 'flagged';
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => enrolled && !already && toggleSelection(t.id)}
                  className={enrolled && !already ? 'ls-ghost' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 13,
                    padding: '15px 17px',
                    borderRadius: 16,
                    textAlign: 'left',
                    cursor: enrolled && !already ? 'pointer' : 'default',
                    background: picked ? gradient.info : enrolled ? gradient.card : color.neutralBg,
                    border: picked ? '1.5px solid #9fc9ee' : '1px solid ' + (enrolled ? color.line : color.neutralLine),
                    opacity: enrolled ? 1 : 0.85,
                  }}
                >
                  {enrolled && !already ? (
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        flex: 'none',
                        borderRadius: 7,
                        background: picked ? 'linear-gradient(140deg,#1f5fa8,#469FE0)' : '#fff',
                        border: picked ? 'none' : '1.6px solid #c2d6ea',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {picked ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M6 12.6l3.7 3.6L18 7.6" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : null}
                    </div>
                  ) : (
                    <div style={{ width: 22, flex: 'none' }} />
                  )}
                  <Avatar initials={t.initials} tone={enrolled ? 'brand' : 'mute'} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: '600 13.5px/1.3 ' + font.family, color: enrolled ? color.ink : color.label, marginBottom: 2 }}>
                      {t.name}
                    </div>
                    <div style={{ font: '400 11.5px/1.3 ' + font.family, color: color.faint }}>
                      {t.unit} · {t.ref} · {t.rent}
                      {t.shared ? ' · ' + t.onLease + ' on lease' : ''}
                    </div>
                  </div>
                  {already ? (
                    <Pill bg={gradient.warnChip} border={'1px solid ' + color.warnLine} fg={color.warnInk}>
                      ALREADY FLAGGED
                    </Pill>
                  ) : !enrolled ? (
                    <Pill bg={color.neutralBg} border={'1px solid ' + color.neutralLine} fg={color.label}>
                      {t.withdrawn ? 'CONSENT WITHDRAWN' : 'NOT ENROLLED'}
                    </Pill>
                  ) : null}
                </button>
              );
            })}
          </div>

          {results.some((t) => t.consent !== 'consented' || t.withdrawn) ? (
            <div
              style={{
                marginTop: 14,
                padding: '14px 16px',
                borderRadius: 15,
                background: gradient.infoSoft,
                border: '1px solid #dbe8f7',
                font: '400 12px/1.5 ' + font.family,
                color: color.body,
              }}
            >
              Greyed-out tenants haven&apos;t consented, or have withdrawn. Nothing can be reported for them — good or
              bad — so they can&apos;t be selected.
            </div>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginTop: 24 }}>
            <Button
              disabled={selectedIds.length === 0}
              onClick={() => router.push('/flag/reason')}
              size="lg"
              style={{ maxWidth: '100%', whiteSpace: 'normal' }}
            >
              {selectedIds.length
                ? 'Continue with ' + selectedIds.length + ' tenant' + (selectedIds.length > 1 ? 's' : '')
                : 'Continue'}
            </Button>
            {selectedIds.length ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'clearSelection' })}
                style={{ border: 'none', background: 'none', font: '600 12.5px ' + font.family, color: color.brandDeep, cursor: 'pointer' }}
              >
                Clear selection
              </button>
            ) : (
              <span style={{ font: '400 12px/1.45 ' + font.family, color: color.faint }}>
                Pick at least one tenant to continue.
              </span>
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="feature">
            <Eyebrow tone="brand">WHY SEARCH, NOT A CHECKLIST</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.inkSoft, textWrap: 'pretty' as never }}>
              In a normal month nobody needs flagging. Making you tick {tenants.length} names to say so is how a monthly
              task stops getting done — and a forgotten confirmation would file a false positive.
            </div>
          </Card>
          <Card>
            <Eyebrow>WHAT HAPPENS NEXT</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.body }}>
              You pick a reason, then the tenant is notified the same day. The month is held — not filed — for{' '}
              {rules.graceDays} days while they pay, send proof, or dispute it.
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
