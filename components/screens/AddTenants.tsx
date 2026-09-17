'use client';

import { useState } from 'react';
import { Shell } from '@/components/Shell';
import { Bullet, Button, Card, Eyebrow, SegmentedControl } from '@/components/ui';
import { tenants } from '@/lib/data';
import { rules } from '@/lib/rules';
import { summarise } from '@/lib/selectors';
import { usePortal } from '@/lib/store';
import { color, font, gradient, shadow } from '@/lib/theme';

type Mode = 'bulk' | 'single';
type Channel = 'email' | 'sms' | 'both';

const FIELDS = [
  ['PROPERTY', '48 Erb St W, Waterloo', false],
  ['UNIT', '410', false],
  ['TENANT NAME', 'Full legal name', true],
  ['EMAIL', 'tenant@email.com', true],
  ['MOBILE (FOR TEXT INVITE)', '+1', true],
  ['MONTHLY RENT (WHOLE LEASE)', '$', true],
  ['RENT DUE ON', '1st of the month', false],
  ['LEASE TERM', 'Start – end', true],
] as const;

export function AddTenants() {
  const { rowStatus, flags } = usePortal();
  const stats = summarise(tenants, rowStatus, flags);
  const [mode, setMode] = useState<Mode>('single');
  const [channel, setChannel] = useState<Channel>('email');
  const [startMonth, setStartMonth] = useState('September 2026');
  const [sent, setSent] = useState(false);

  return (
    <Shell
      title="Add tenants"
      subtitle={stats.awaitingConsent + ' invited tenants have not consented yet'}
      actions={<Button href="/roll" tone="ghost">Back to roll</Button>}
    >
      <div className="ls-split" style={{ display: 'grid', gap: 22, alignItems: 'start' }}>
        <Card style={{ padding: '30px 32px', borderRadius: 24, boxShadow: shadow.panel }}>
          {sent ? (
            <div className="ls-rise">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
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
                  <div style={{ font: '700 26px/1.22 ' + font.family, letterSpacing: '-.025em', color: color.ink, marginBottom: 6 }}>
                    {mode === 'bulk' ? 'Tenant list received' : 'Invitation sent'}
                  </div>
                  <div style={{ font: '400 14px/1.5 ' + font.family, color: color.muted }}>
                    {mode === 'bulk'
                      ? "We'll match each lease and send every invitation. Nothing is reported until a tenant accepts."
                      : 'LeazeSure has emailed the consent invitation. Nothing is reported until they accept.'}
                  </div>
                </div>
              </div>

              <div style={{ padding: '22px 24px', borderRadius: 19, background: gradient.info, border: '1px solid ' + color.brandPale, marginBottom: 24 }}>
                <Eyebrow tone="brand">WHAT HAPPENS NOW</Eyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  <Bullet>
                    The tenant gets an email from LeazeSure with the Equifax authorisation and consents in their own app.
                  </Bullet>
                  <Bullet>
                    They confirm the lease you entered, declare their share if they have roommates, then verify ID.
                  </Bullet>
                  <Bullet>
                    The moment they accept, they appear on your rent roll and reporting starts with {startMonth}.
                  </Bullet>
                  <Bullet>Anyone who declines stays off the roll and keeps their tenancy unchanged.</Bullet>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button href="/roll">Back to rent roll</Button>
                <Button tone="ghost" onClick={() => setSent(false)}>
                  Add another tenant
                </Button>
              </div>
            </div>
          ) : (
            <>
              <h2 style={{ font: '700 26px/1.2 ' + font.family, letterSpacing: '-.028em', color: color.ink, margin: '0 0 8px' }}>
                Add a tenant to your roll
              </h2>
              <p style={{ font: '400 14px/1.6 ' + font.family, color: color.muted, margin: '0 0 20px', maxWidth: '56ch' }}>
                Send us the tenant and their lease. LeazeSure sends the consent invitation — you never collect consent
                yourself, and reporting can never be a condition of tenancy.
              </p>

              <div style={{ marginBottom: 20 }}>
                <SegmentedControl
                  options={[
                    { value: 'single', label: 'One tenant' },
                    { value: 'bulk', label: 'Upload a tenant list' },
                  ]}
                  value={mode}
                  onChange={setMode}
                />
              </div>

              {mode === 'single' ? (
                <div className="ls-pair" style={{ display: 'grid', gap: 14, marginBottom: 14 }}>
                  {FIELDS.map(([label, value, placeholder]) => (
                    <div key={label}>
                      <div style={{ font: '600 9.5px/1 ' + font.family, letterSpacing: '.13em', color: color.label, marginBottom: 9 }}>
                        {label}
                      </div>
                      <div
                        style={{
                          height: 50,
                          padding: '0 15px',
                          border: '1px solid #d9e6f5',
                          borderRadius: 14,
                          background: gradient.field,
                          display: 'flex',
                          alignItems: 'center',
                          font: '500 14px ' + font.family,
                          color: placeholder ? '#a3b4cb' : color.ink,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: '40px 24px',
                    border: '1.6px dashed #b9cdea',
                    borderRadius: 22,
                    background: 'linear-gradient(160deg,#ffffff,#f3f9fe)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 15,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 20,
                      background: gradient.actionTight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 12px 26px rgba(30,90,150,.28)',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 16V4.8M12 4.8 7.6 9.2M12 4.8l4.4 4.4" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4.6 15.4v2.8c0 1 .8 1.8 1.8 1.8h11.2c1 0 1.8-.8 1.8-1.8v-2.8" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ font: '600 16px/1.3 ' + font.family, color: color.ink, marginBottom: 6 }}>
                      Drop your tenant list and leases
                    </div>
                    <div style={{ font: '400 12.5px/1.45 ' + font.family, color: color.faint }}>
                      CSV or XLSX plus lease PDFs · we match each tenant to their lease
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  padding: '17px 19px',
                  border: '1.5px dashed #b9cdea',
                  borderRadius: 16,
                  background: 'linear-gradient(160deg,#ffffff,#f3f9fe)',
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    flex: 'none',
                    borderRadius: 12,
                    background: gradient.actionTight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6.4 3.4h7l4.2 4.2v13c0 1-.8 1.8-1.8 1.8H6.4c-1 0-1.8-.8-1.8-1.8V5.2c0-1 .8-1.8 1.8-1.8z" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="M13.4 3.4v4.2h4.2" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: '600 13.5px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>
                    Attach the signed lease
                  </div>
                  <div style={{ font: '400 11.5px/1.4 ' + font.family, color: color.faint }}>
                    The tenant confirms these details against it before consent counts. More than one name on the lease?
                    Add each person — they declare their own share.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                <span style={{ font: '600 9.5px/1 ' + font.family, letterSpacing: '.13em', color: color.label }}>REPORTING STARTS</span>
                <SegmentedControl
                  options={[
                    { value: 'September 2026', label: 'September 2026' },
                    { value: 'October 2026', label: 'October 2026' },
                  ]}
                  value={startMonth}
                  onChange={setStartMonth}
                />
                <span style={{ font: '400 11px/1.4 ' + font.family, color: color.ghost }}>
                  This month or next — never a past month.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
                <span style={{ font: '600 9.5px/1 ' + font.family, letterSpacing: '.13em', color: color.label }}>SEND INVITATION BY</span>
                <SegmentedControl
                  options={[
                    { value: 'email', label: 'Email' },
                    { value: 'sms', label: 'Text message' },
                    { value: 'both', label: 'Email + text' },
                  ]}
                  value={channel}
                  onChange={setChannel}
                />
                <span style={{ font: '400 11px/1.4 ' + font.family, color: color.ghost }}>
                  If the email bounces we text automatically.
                </span>
              </div>

              <Button size="lg" onClick={() => setSent(true)} style={{ whiteSpace: 'normal' }}>
                {mode === 'bulk' ? 'Send list to LeazeSure' : 'Add tenant and send invitation'}
              </Button>
            </>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="feature">
            <Eyebrow tone="brand">CONSENT IS THE TENANT&apos;S</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.inkSoft, textWrap: 'pretty' as never }}>
              Equifax requires consent to come from the tenant directly, on their own device. You can invite and remind —
              you can never accept on their behalf.
            </div>
          </Card>
          <Card>
            <Eyebrow>NEVER DO THIS</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Make consent a condition of signing or renewing a lease.',
                'Treat a refusal as a mark against an applicant or tenant.',
                "Consent, sign, or click through on a tenant's behalf.",
              ].map((t) => (
                <div key={t} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      flex: 'none',
                      borderRadius: '50%',
                      background: '#fdf3f2',
                      border: '1px solid #f0d4d1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 1,
                    }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M6.6 6.6l10.8 10.8M17.4 6.6L6.6 17.4" stroke="#c0473f" strokeWidth="2.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span style={{ font: '400 12.5px/1.55 ' + font.family, color: color.body }}>{t}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <Eyebrow>AFTER THEY CONSENT</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.body }}>
              They show as <strong style={{ fontWeight: 600, color: color.ink }}>Enrolled · verifying</strong> until the
              Didit ID check passes. Nothing files for them until it does — Equifax attaches a tradeline only to a
              verified consumer.
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
