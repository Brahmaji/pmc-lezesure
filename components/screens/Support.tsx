'use client';

import { useState } from 'react';
import { Shell } from '@/components/Shell';
import { Button, Card, Eyebrow, Field, TextInput } from '@/components/ui';
import { rules } from '@/lib/rules';
import { color, font, gradient } from '@/lib/theme';

const CATEGORIES = [
  'General question',
  'A tenant disputes a flag',
  'Equifax dispute request',
  'Identity theft / fraud report',
  'Correct an already-filed month',
  'Management agreement or authority',
  'Add or remove a property',
  'Billing',
  'Technical issue',
];

export function Support() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const ready = subject.trim().length > 0 && message.trim().length > 0;

  return (
    <Shell title="Support" subtitle="Partner support replies within one business day">
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 22, alignItems: 'start' }}>
        <Card style={{ padding: '30px 32px', borderRadius: 24 }}>
          {sent ? (
            <div className="ls-rise" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px 0' }}>
              <div
                className="ls-pop"
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: '50%',
                  background: 'linear-gradient(140deg,#123a6e,#2f7fc4 62%,#469FE0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 14px 32px rgba(30,90,150,.3)',
                  marginBottom: 22,
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 12.6l3.7 3.6L18 7.6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ font: '700 24px/1.25 ' + font.family, letterSpacing: '-.025em', color: color.ink, marginBottom: 9 }}>
                Ticket submitted
              </div>
              <div style={{ font: '400 14px/1.55 ' + font.family, color: color.muted, maxWidth: '40ch', marginBottom: 26 }}>
                Reference #LS-P-4192. We&apos;ve emailed a copy to your work address. Dispute and fraud tickets are
                escalated the same day because of Equifax&apos;s response deadlines.
              </div>
              <Button tone="ghost" onClick={() => { setSent(false); setSubject(''); setMessage(''); }}>
                Submit another ticket
              </Button>
            </div>
          ) : (
            <>
              <h2 style={{ font: '700 24px/1.2 ' + font.family, letterSpacing: '-.025em', color: color.ink, margin: '0 0 8px' }}>
                Submit a ticket
              </h2>
              <p style={{ font: '400 13.5px/1.55 ' + font.family, color: color.muted, margin: '0 0 24px', maxWidth: '54ch' }}>
                Tell us what&apos;s happening. If it concerns a specific tenant, include their lease reference so we can
                find the month in question.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Field label="CATEGORY">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      height: 50,
                      padding: '0 14px',
                      border: '1px solid #d9e6f5',
                      borderRadius: 14,
                      background: gradient.field,
                      font: '500 14px ' + font.family,
                      color: color.ink,
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field label="SUBJECT">
                  <TextInput value={subject} onChange={setSubject} placeholder="A short summary" />
                </Field>
                <Field label="MESSAGE">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="What happened, which tenant or month it affects, and what you need."
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #d9e6f5',
                      borderRadius: 14,
                      background: gradient.field,
                      outline: 'none',
                      font: '400 13.5px/1.6 ' + font.family,
                      color: color.ink,
                      resize: 'vertical',
                    }}
                  />
                </Field>
              </div>

              <div style={{ marginTop: 22 }}>
                <Button size="lg" disabled={!ready} onClick={() => setSent(true)}>
                  Submit ticket
                </Button>
              </div>
            </>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="warn" style={{ borderRadius: 22 }}>
            <Eyebrow tone="warn">TIME-SENSITIVE ITEMS</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.warnInkSoft, textWrap: 'pretty' as never }}>
              An Equifax dispute must be answered within {rules.equifaxDisputeDays} days ({rules.equifaxFraudDisputeDays}{' '}
              for fraud). If you have payment records for a disputed month, confirm them in Flags &amp; disputes rather
              than a ticket — it routes straight to the investigation.
            </div>
          </Card>
          <Card>
            <Eyebrow>COMMON ANSWERS</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              {[
                ['A tenant says a flag is wrong', 'They can dispute in their app. LeazeSure reviews any proof and you get ' + rules.objectionDays + ' days to object.'],
                ['I forgot to flag last month', 'Correct it for up to ' + rules.correctionWindowDays + ' days. It goes in the next monthly file.'],
                ['A tenant moved out mid-lease', 'End the tenancy on their detail page and pick the final month.'],
              ].map(([q, a]) => (
                <div key={q}>
                  <div style={{ font: '600 12.5px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>{q}</div>
                  <div style={{ font: '400 11.5px/1.45 ' + font.family, color: color.body }}>{a}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
