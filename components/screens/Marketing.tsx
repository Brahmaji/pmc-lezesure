import Link from 'next/link';
import { LogoMark } from '@/components/Shell';
import { Button } from '@/components/ui';
import { rules } from '@/lib/rules';
import { color, font, gradient } from '@/lib/theme';

const POINTS = [
  { i: '1', t: 'A perk that costs you nothing to run', d: 'You fund it; your tenants get the benefit' },
  { i: '2', t: 'Nothing to do in a normal month', d: 'Enrolled tenants report as paid automatically' },
  { i: '3', t: 'You never see credit data', d: 'Only whether a tenant is enrolled' },
];

const PROOF = [
  'Tenants consent on their own device, in their own app',
  rules.graceDays + '-day grace before a missed month is ever filed',
  "Disputes answered to Equifax's " + rules.equifaxDisputeDays + '-day standard, with your records',
];

export function Marketing() {
  return (
    <div style={{ minHeight: '100vh', background: gradient.pageWarm, position: 'relative', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          top: -160,
          right: -120,
          width: 520,
          height: 520,
          borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(70,159,224,.22),transparent 68%)',
        }}
      />
      <header
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: '26px 56px',
          borderBottom: '1px solid rgba(30,90,150,.09)',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <LogoMark size={36} />
          <div style={{ font: '700 18px/1 ' + font.family, letterSpacing: '-.015em', color: color.ink }}>
            Leaze<span style={{ color: color.brandMid }}>Sure</span>
          </div>
          <span
            style={{
              font: '600 9px/1 ' + font.family,
              letterSpacing: '.14em',
              color: color.brandLabel,
              padding: '6px 10px',
              borderRadius: 20,
              background: 'rgba(255,255,255,.75)',
              border: '1px solid #c6def4',
              marginLeft: 4,
            }}
          >
            FOR PROPERTY MANAGERS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button href="/signin" tone="ghost">
            Partner sign in
          </Button>
          <Button href="/roll">Open the portal</Button>
        </div>
      </header>

      <section
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,.95fr)',
          gap: 52,
          alignItems: 'center',
          padding: '58px 56px 64px',
          maxWidth: 1440,
        }}
      >
        <div>
          <div style={{ font: '600 10.5px/1 ' + font.family, letterSpacing: '.18em', color: color.brandLabel, marginBottom: 20 }}>
            EQUIFAX CANADA · LANDLORD-VERIFIED RENT REPORTING
          </div>
          <h1
            style={{
              font: '700 56px/1.08 ' + font.family,
              letterSpacing: '-.038em',
              color: color.ink,
              margin: '0 0 20px',
              maxWidth: '17ch',
              textWrap: 'balance' as never,
            }}
          >
            Give your tenants a reason to pay on time.
          </h1>
          <p
            style={{
              font: '400 16.5px/1.6 ' + font.family,
              color: color.body,
              margin: '0 0 32px',
              maxWidth: '46ch',
              textWrap: 'pretty' as never,
            }}
          >
            Offer rent reporting as a resident benefit. Your tenants build credit with the rent they already pay, and in
            a normal month your team does nothing at all.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            <Button href="/signin" size="lg">
              Enrol your portfolio
            </Button>
            <Button href="/roll" tone="ghost" size="lg">
              See the portal
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {POINTS.map((w) => (
              <div key={w.i} style={{ flex: '1 1 180px' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg,#1f5fa8,#469FE0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 11,
                    font: '700 13px/1 ' + font.family,
                    color: '#fff',
                  }}
                >
                  {w.i}
                </div>
                <div style={{ font: '600 13.5px/1.35 ' + font.family, color: color.ink, marginBottom: 4 }}>{w.t}</div>
                <div style={{ font: '400 12px/1.45 ' + font.family, color: color.muted }}>{w.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 32,
            borderRadius: 28,
            background: 'linear-gradient(150deg,#ffffff,#f2f9ff 55%,#e6f3fd)',
            border: '1px solid #dbe9f8',
            boxShadow: '0 22px 54px rgba(40,100,160,.16)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ font: '600 10px/1 ' + font.family, letterSpacing: '.15em', color: color.brandLabel }}>
              YOUR MONTHLY JOB
            </div>
            <div
              style={{
                font: '600 9.5px/1 ' + font.family,
                letterSpacing: '.08em',
                color: color.ink,
                padding: '6px 11px',
                borderRadius: 20,
                background: 'linear-gradient(120deg,#ffffff,#e2f2fe)',
                border: '1px solid #c6def4',
              }}
            >
              USUALLY NONE
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 20, background: gradient.feature, border: '1px solid #d3e8f9', marginBottom: 14 }}>
            <div style={{ font: '700 40px/1 ' + font.family, letterSpacing: '-.04em', color: color.ink, marginBottom: 8 }}>
              44
              <span style={{ font: '600 19px/1 ' + font.family, color: '#7ea3c8' }}> reporting as paid</span>
            </div>
            <div style={{ font: '400 12.5px/1.5 ' + font.family, color: color.inkSoft }}>
              Everyone who paid is filed on the {rules.filingDay}th automatically. You only step in to flag a miss.
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PROOF.map((p) => (
              <div
                key={p}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '13px 14px',
                  borderRadius: 15,
                  background: gradient.card,
                  border: '1px solid ' + color.line,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    flex: 'none',
                    borderRadius: 9,
                    background: 'linear-gradient(140deg,#1f5fa8,#469FE0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 12.6l3.7 3.6L18 7.6" stroke="#fff" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ font: '500 12.5px/1.4 ' + font.family, color: '#3d4d6d' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '0 56px 40px',
          font: '500 10px/1.8 ' + font.family,
          letterSpacing: '.12em',
          color: color.faint,
        }}
      >
        TENANT CONSENT REQUIRED · NEVER A CONDITION OF TENANCY · PIPEDA-COMPLIANT
        <div style={{ marginTop: 10, letterSpacing: 0, font: '400 12px/1.6 ' + font.family, color: color.ghost }}>
          <Link href="/signin">Partner sign in</Link> · <Link href="/roll">Portal demo</Link>
        </div>
      </footer>
    </div>
  );
}
