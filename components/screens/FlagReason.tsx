'use client';

import { useRouter } from 'next/navigation';
import { Shell } from '@/components/Shell';
import { Avatar, Button, Card, Eyebrow, SegmentedControl, TextInput } from '@/components/ui';
import { tenants } from '@/lib/data';
import { flagReasons, rules } from '@/lib/rules';
import { usePortal } from '@/lib/store';
import { color, font, gradient, shadow } from '@/lib/theme';
import type { FlagReason as Reason } from '@/lib/types';

const GRACE_STEPS = [
  { n: '1', t: 'Today — the tenant is notified', d: 'In the app and by email, with the reason, amount and date' },
  { n: '2', t: 'Days 1–30 — they can resolve it', d: 'Pay, upload proof, or raise a dispute' },
  { n: '3', t: 'LeazeSure reviews any proof', d: 'You get 7 days to object before a flag is cleared' },
  { n: '4', t: 'Only then does it reach Equifax', d: 'Filed with the next monthly submission' },
];

export function FlagReasonScreen() {
  const router = useRouter();
  const { selectedIds, reason, month, partialAmount, latePaidOn, dispatch, submitFlags } = usePortal();

  const subjects = tenants.filter((t) => selectedIds.includes(t.id));
  const isCorrection = month !== 'August 2026';

  if (!subjects.length) {
    return (
      <Shell title="Report a missed payment" subtitle="Nothing selected" actions={<Button href="/flag" tone="ghost">Back</Button>}>
        <Card style={{ maxWidth: 560 }}>
          <Eyebrow>NO TENANTS SELECTED</Eyebrow>
          <div style={{ font: '400 13px/1.6 ' + font.family, color: color.body, marginBottom: 18 }}>
            Find the tenants who missed their payment first — a flag always names the person it belongs to.
          </div>
          <Button href="/flag">Search for a tenant</Button>
        </Card>
      </Shell>
    );
  }

  const submit = () => {
    submitFlags();
    router.push('/flags');
  };

  return (
    <Shell
      title={'What happened with ' + month.replace(' 2026', '') + ' rent?'}
      subtitle={subjects.length + ' tenant' + (subjects.length > 1 ? 's' : '') + ' selected'}
      actions={<Button href="/flag" tone="ghost">Back</Button>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 22, alignItems: 'start' }}>
        <Card style={{ padding: '30px 32px', borderRadius: 24, boxShadow: shadow.panel }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
            {subjects.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 13px 9px 9px',
                  borderRadius: 14,
                  background: gradient.info,
                  border: '1px solid ' + color.brandPale,
                }}
              >
                <Avatar initials={t.initials} />
                <div>
                  <div style={{ font: '600 12.5px/1.3 ' + font.family, color: color.ink }}>{t.name}</div>
                  <div style={{ font: '400 10.5px/1.3 ' + font.family, color: color.inkSoft }}>
                    {t.unit} · {t.rent}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p style={{ font: '400 14px/1.6 ' + font.family, color: color.muted, margin: '0 0 16px', maxWidth: '56ch' }}>
            Pick one reason. The month is held — not filed — until the {rules.graceDays}-day grace ends. The tenant sees
            the reason, the amount and the date.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <SegmentedControl
              options={[
                { value: 'August 2026', label: 'August 2026' },
                { value: 'July 2026', label: 'July 2026' },
              ]}
              value={month}
              onChange={(m) => dispatch({ type: 'setMonth', month: m })}
            />
            {isCorrection ? (
              <span style={{ font: '500 11.5px/1.4 ' + font.family, color: color.warnInk, maxWidth: '44ch' }}>
                Correcting a past month — up to {rules.correctionWindowDays} days after filing. It goes in the next
                monthly file (or urgently via Equifax&apos;s correction tool) and is carried forward so it isn&apos;t
                overwritten.
              </span>
            ) : null}
          </div>

          <Eyebrow tone="warn">CHOOSE A REASON</Eyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 }}>
            {flagReasons.map((r) => {
              const picked = reason === (r.key as Reason);
              return (
                <button
                  key={r.key}
                  type="button"
                  className="ls-ghost"
                  onClick={() => dispatch({ type: 'setReason', reason: r.key as Reason })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '17px 19px',
                    borderRadius: 17,
                    textAlign: 'left',
                    cursor: 'pointer',
                    background: picked ? gradient.info : gradient.card,
                    border: picked ? '1.5px solid #9fc9ee' : '1px solid ' + color.line,
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      flex: 'none',
                      borderRadius: '50%',
                      background: picked ? 'linear-gradient(140deg,#1f5fa8,#469FE0)' : '#fff',
                      border: picked ? 'none' : '1.7px solid #c2d6ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {picked ? <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff' }} /> : null}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: '600 14px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>{r.title}</div>
                    <div style={{ font: '400 12px/1.4 ' + font.family, color: color.faint }}>{r.detail}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {reason === 'partial' ? (
            <ExtraField
              label="AMOUNT RECEIVED"
              hint="Equifax records the balance still owing."
              value={partialAmount}
              placeholder="$ 0.00"
              onChange={(v) => dispatch({ type: 'setPartialAmount', value: v })}
            />
          ) : null}

          {reason === 'late' ? (
            <ExtraField
              label="DATE PAID"
              hint="Days past due are calculated from the lease due date."
              value={latePaidOn}
              placeholder="e.g. 14 Aug"
              onChange={(v) => dispatch({ type: 'setLatePaidOn', value: v })}
            />
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
            <Button size="lg" onClick={submit}>
              Save flag and notify tenant
            </Button>
            <span style={{ font: '400 12px/1.45 ' + font.family, color: color.faint, maxWidth: '26ch' }}>
              They&apos;re told today and can pay, send proof, or dispute it.
            </span>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="warn" style={{ borderRadius: 22 }}>
            <Eyebrow tone="warn">THE {rules.graceDays}-DAY GRACE WINDOW</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {GRACE_STEPS.map((g, i) => (
                <div key={g.n} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      flex: 'none',
                      borderRadius: 8,
                      background: i === 0 ? gradient.warnSolid : gradient.avatarWarn,
                      color: i === 0 ? '#fff' : color.warnInk,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      font: '700 10.5px ' + font.family,
                    }}
                  >
                    {g.n}
                  </div>
                  <div>
                    <div style={{ font: '600 12.5px/1.35 ' + font.family, color: color.ink, marginBottom: 3 }}>{g.t}</div>
                    <div style={{ font: '400 11.5px/1.45 ' + font.family, color: color.warnInkSoft }}>{g.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Eyebrow>A NOTE ON FAIRNESS</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.body, textWrap: 'pretty' as never }}>
              A missed month on a credit file is serious. The tenant sees the flag, the amount and the date before it is
              filed, and can dispute it with evidence — through LeazeSure or with Equifax directly.
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function ExtraField({
  label,
  hint,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 18px',
        borderRadius: 15,
        background: gradient.warn,
        border: '1px solid ' + color.warnLine,
        marginBottom: 22,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ font: '600 9.5px/1 ' + font.family, letterSpacing: '.13em', color: color.warnInk, marginBottom: 6 }}>{label}</div>
        <div style={{ font: '400 11.5px/1.4 ' + font.family, color: color.warnInkSoft }}>{hint}</div>
      </div>
      <div style={{ width: 170 }}>
        <TextInput value={value} onChange={onChange} placeholder={placeholder} />
      </div>
    </div>
  );
}
