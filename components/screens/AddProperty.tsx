'use client';

import { useState } from 'react';
import { Shell } from '@/components/Shell';
import { Bullet, Button, Card, Eyebrow, Field, TextInput } from '@/components/ui';
import { color, font, gradient, shadow } from '@/lib/theme';

const DOCS = [
  { key: 'mgmt', title: 'Management agreement', hint: 'Names you as agent for this building', required: true },
  { key: 'registration', title: 'Business registration', hint: 'Already on file for your company', required: true },
  { key: 'utility', title: 'Utility bill in company name', hint: 'Optional third document', required: false },
  { key: 'lease', title: 'Signed lease naming you as agent', hint: 'Optional third document', required: false },
];

export function AddProperty() {
  const [address, setAddress] = useState('');
  const [owner, setOwner] = useState('');
  const [units, setUnits] = useState('');
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({ registration: true });
  const [submitted, setSubmitted] = useState(false);

  const requiredMet = DOCS.filter((d) => d.required).every((d) => uploaded[d.key]);
  const ready = address.trim() && owner.trim() && units.trim() && requiredMet;

  return (
    <Shell
      title="Add a property"
      subtitle="We verify your authority to report for this owner before any tenant can be added"
      actions={<Button href="/properties" tone="ghost">Back to properties</Button>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 22, alignItems: 'start' }}>
        <Card style={{ padding: '30px 32px', borderRadius: 24, boxShadow: shadow.panel }}>
          {submitted ? (
            <div className="ls-rise">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22 }}>
                <div
                  className="ls-pop"
                  style={{
                    width: 74,
                    height: 74,
                    flex: 'none',
                    borderRadius: '50%',
                    background: 'linear-gradient(140deg,#123a6e,#2f7fc4 62%,#469FE0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 12px 28px rgba(30,90,150,.3)',
                  }}
                >
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 12.6l3.7 3.6L18 7.6" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div style={{ font: '700 24px/1.22 ' + font.family, letterSpacing: '-.025em', color: color.ink, marginBottom: 6 }}>
                    Sent for review
                  </div>
                  <div style={{ font: '400 14px/1.5 ' + font.family, color: color.muted }}>
                    {address || 'This property'} — usually approved within one to two business days.
                  </div>
                </div>
              </div>
              <div style={{ padding: '20px 22px', borderRadius: 19, background: gradient.info, border: '1px solid ' + color.brandPale, marginBottom: 22 }}>
                <Eyebrow tone="brand">WHILE YOU WAIT</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Bullet>We check the management agreement names your company as agent for the owner.</Bullet>
                  <Bullet>You can prepare the tenant list, but invitations only go out after approval.</Bullet>
                  <Bullet>We re-verify this building&apos;s authority every 12 months.</Bullet>
                </div>
              </div>
              <Button href="/properties">Back to properties</Button>
            </div>
          ) : (
            <>
              <h2 style={{ font: '700 26px/1.2 ' + font.family, letterSpacing: '-.028em', color: color.ink, margin: '0 0 8px' }}>
                Which building?
              </h2>
              <p style={{ font: '400 14px/1.6 ' + font.family, color: color.muted, margin: '0 0 24px', maxWidth: '56ch' }}>
                You manage rather than own, so we verify authority to act for the owner instead of title. Upload the
                management agreement for this specific building.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <Field label="PROPERTY ADDRESS">
                    <TextInput value={address} onChange={setAddress} placeholder="e.g. 120 Victoria St S, Kitchener" />
                  </Field>
                </div>
                <Field label="OWNER (LEGAL ENTITY)">
                  <TextInput value={owner} onChange={setOwner} placeholder="e.g. Victoria Park Holdings Ltd." />
                </Field>
                <Field label="RENTAL UNITS">
                  <TextInput value={units} onChange={setUnits} placeholder="e.g. 24" />
                </Field>
              </div>

              <Eyebrow>AUTHORITY DOCUMENTS</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
                {DOCS.map((d) => {
                  const done = Boolean(uploaded[d.key]);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      className="ls-ghost"
                      onClick={() => setUploaded((u) => ({ ...u, [d.key]: !u[d.key] }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 13,
                        padding: '18px 19px',
                        borderRadius: 18,
                        textAlign: 'left',
                        cursor: 'pointer',
                        background: done ? gradient.info : gradient.card,
                        border: done ? '1.4px solid #9fc9ee' : '1.4px dashed #c2d6ea',
                      }}
                    >
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          flex: 'none',
                          borderRadius: 11,
                          background: done ? 'linear-gradient(140deg,#1f5fa8,#469FE0)' : gradient.avatar,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {done ? (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M6 12.6l3.7 3.6L18 7.6" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <path d="M12 16V4.8M12 4.8 7.6 9.2M12 4.8l4.4 4.4" stroke="#1f5fa8" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4.6 15.4v2.8c0 1 .8 1.8 1.8 1.8h11.2c1 0 1.8-.8 1.8-1.8v-2.8" stroke="#1f5fa8" strokeWidth="2.1" strokeLinecap="round" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: '600 13.5px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>
                          {d.title}
                          {d.required ? '' : ' (optional)'}
                        </div>
                        <div style={{ font: '400 11.5px/1.4 ' + font.family, color: done ? color.brandLabel : color.faint }}>
                          {done ? 'Uploaded' : d.hint}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button size="lg" disabled={!ready} onClick={() => setSubmitted(true)}>
                Submit for review
              </Button>
              {!ready ? (
                <div style={{ font: '400 12px/1.5 ' + font.family, color: color.faint, marginTop: 12 }}>
                  Address, owner, unit count and both required documents are needed before we can review.
                </div>
              ) : null}
            </>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="feature">
            <Eyebrow tone="brand">WHY THIS IS STRICT</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.inkSoft, textWrap: 'pretty' as never }}>
              Anything you file lands on a real person&apos;s credit file. Equifax holds the furnisher accountable for
              accuracy, so we verify your authority per building — not once per company.
            </div>
          </Card>
          <Card>
            <Eyebrow>RE-VERIFICATION</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.body, textWrap: 'pretty' as never }}>
              We re-check authority every 12 months and whenever you add a property. If a management agreement lapses we
              warn you and review the building rather than continuing silently on stale authority.
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
