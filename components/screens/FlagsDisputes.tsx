'use client';

import { Shell } from '@/components/Shell';
import { Avatar, Button, Card, Eyebrow, Pill } from '@/components/ui';
import { tenants } from '@/lib/data';
import { reasonLabel, rules } from '@/lib/rules';
import { groupByMonth, summarise } from '@/lib/selectors';
import { usePortal } from '@/lib/store';
import { color, font, gradient, shadow } from '@/lib/theme';
import type { FlagStatus } from '@/lib/types';

const STATUS: Record<FlagStatus, { label: string; bg: string; border: string; fg: string }> = {
  grace: { label: 'IN ' + rules.graceDays + '-DAY GRACE', bg: gradient.warnChip, border: '1px solid #f2ddb4', fg: color.warnInk },
  disputed: { label: 'DISPUTED · ' + rules.objectionDays + '-DAY CLOCK', bg: gradient.danger, border: '1px solid #f0c8c2', fg: color.dangerInk },
  held: { label: 'HELD · NOT FILED', bg: color.neutralBg, border: '1px solid ' + color.neutralLine, fg: color.neutralInk },
  equifax: { label: 'EQUIFAX DISPUTE · ' + rules.equifaxDisputeDays + ' DAYS', bg: gradient.danger, border: '1px solid #f0c8c2', fg: color.dangerInk },
  fraud: { label: 'SUSPENDED · IDENTITY THEFT', bg: '#2b2f3a', border: '1px solid #2b2f3a', fg: '#ffffff' },
  resolved: { label: 'CLEARED', bg: gradient.info, border: '1px solid #bcdcf6', fg: color.brandLabel },
  filed: { label: 'FILED TO EQUIFAX', bg: color.neutralBg, border: '1px solid ' + color.neutralLine, fg: color.label },
};

const EXPLAINERS = [
  ['In grace', 'Tenant notified. The month is held, not filed. Clear it if they pay.'],
  ['Disputed · ' + rules.objectionDays + '-day clock', 'Tenant sent proof. LeazeSure reviews. You see the clock, not the document — object within ' + rules.objectionDays + ' days or the flag is cleared.'],
  ['Held', "You objected, or there's an arrangement. Nothing files until both sides agree."],
  ['Equifax dispute · ' + rules.equifaxDisputeDays + ' days', 'The tenant disputed with Equifax directly. As the furnisher we must investigate and answer within ' + rules.equifaxDisputeDays + ' days (' + rules.equifaxFraudDisputeDays + ' for fraud). Confirm your payment records so we can.'],
  ['Suspended · identity theft', 'A police report or identity-theft affidavit was provided. Reporting stops and Equifax is asked to delete the record.'],
  ['Cleared / Filed', 'Cleared is never filed. Filed is on the tenant’s record; corrections go in the next monthly file and are carried forward.'],
];

export function FlagsDisputes() {
  const { flags, rowStatus, recordsConfirmed, dispatch } = usePortal();
  const stats = summarise(tenants, rowStatus, flags);
  const months = groupByMonth(flags);

  return (
    <Shell
      title="Flags & disputes"
      subtitle="Every month you flagged, and where it stands with Equifax"
      actions={<Button href="/flag">Report a missed payment</Button>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {months.map(({ month, records }) => (
            <div
              key={month}
              style={{
                borderRadius: 22,
                background: gradient.card,
                border: '1px solid ' + color.line,
                boxShadow: shadow.card,
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 14px' }}>
                <div style={{ font: '600 14.5px/1 ' + font.family, letterSpacing: '-.01em', color: color.ink }}>{month}</div>
                <span style={{ font: '500 12px/1 ' + font.family, color: color.faint }}>
                  {records.length} flag{records.length > 1 ? 's' : ''}
                </span>
              </div>

              {records.flatMap((record) =>
                record.subjects.map((subject) => {
                  const skin = STATUS[record.status];
                  return (
                    <div
                      key={record.id + subject.ref}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1.2fr .6fr auto',
                        gap: 14,
                        alignItems: 'center',
                        padding: '14px 24px',
                        borderTop: '1px solid ' + color.lineSoft,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                        <Avatar
                          initials={subject.initials}
                          tone={record.status === 'resolved' ? 'brand' : record.status === 'filed' ? 'mute' : 'warn'}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ font: '600 13px/1.3 ' + font.family, color: color.ink, marginBottom: 2 }}>{subject.name}</div>
                          <div style={{ font: '400 11px/1.3 ' + font.family, color: color.faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {subject.unit} · {subject.ref}
                          </div>
                        </div>
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ font: '500 12.5px/1.35 ' + font.family, color: color.body }}>
                          {reasonLabel[record.reason]}
                        </div>
                        {record.detail ? (
                          <div style={{ font: '400 10.5px/1.35 ' + font.family, color: color.ghost }}>{record.detail}</div>
                        ) : null}
                      </div>

                      <span style={{ font: '400 12.5px/1.3 ' + font.family, color: color.muted }}>{record.raised}</span>

                      <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 9 }}>
                        <Pill bg={skin.bg} border={skin.border} fg={skin.fg}>
                          {skin.label}
                        </Pill>
                        {record.status === 'grace' ? (
                          <Button tone="ghost" size="sm" onClick={() => dispatch({ type: 'clearFlag', id: record.id })}>
                            They&apos;ve paid — clear
                          </Button>
                        ) : null}
                        {record.status === 'disputed' ? (
                          <Button tone="danger" size="sm" onClick={() => dispatch({ type: 'object', id: record.id })}>
                            Object
                          </Button>
                        ) : null}
                        {record.status === 'equifax' ? (
                          recordsConfirmed[record.id] ? (
                            <span style={{ font: '600 11px ' + font.family, color: color.brandLabel, whiteSpace: 'nowrap' }}>
                              Records sent
                            </span>
                          ) : (
                            <Button tone="danger" size="sm" onClick={() => dispatch({ type: 'confirmRecords', id: record.id })}>
                              Confirm payment records
                            </Button>
                          )
                        ) : null}
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="warn" style={{ borderRadius: 22 }}>
            <Eyebrow tone="warn">WHAT THE STATUSES MEAN</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {EXPLAINERS.map(([t, d]) => (
                <div key={t}>
                  <div style={{ font: '600 12.5px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>{t}</div>
                  <div style={{ font: '400 11.5px/1.45 ' + font.family, color: color.warnInkSoft }}>{d}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <Eyebrow>FILING RECORD</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                { month: 'August 2026', when: 'Reports ' + rules.filingLabel, paid: stats.reportingAsPaid, flags: stats.flagged, pending: true },
                { month: 'July 2026', when: 'Filed 10 Aug', paid: 42, flags: 2, pending: false },
                { month: 'June 2026', when: 'Filed 10 Jul', paid: 39, flags: 1, pending: false },
              ].map((a) => (
                <div key={a.month} style={{ padding: '12px 14px', borderRadius: 13, background: gradient.cardInset, border: '1px solid #e4edf8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ font: '600 12px/1.3 ' + font.family, color: color.ink }}>{a.month}</span>
                    <span style={{ font: '500 10px/1.3 ' + font.family, color: color.faint }}>{a.when}</span>
                  </div>
                  <div style={{ font: '400 10.5px/1.4 ' + font.family, color: color.muted }}>
                    {a.paid} paid · {a.flags} flagged
                  </div>
                  {a.pending ? (
                    <div style={{ font: '400 10px/1.4 ' + font.family, color: color.warnInk, marginTop: 3 }}>
                      Recorded when it files, with who did and didn&apos;t flag.
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
