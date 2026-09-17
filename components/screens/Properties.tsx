'use client';

import { Shell } from '@/components/Shell';
import { Button, Card, Eyebrow, Pill } from '@/components/ui';
import { properties } from '@/lib/data';
import { color, font, gradient, shadow } from '@/lib/theme';

export function Properties() {
  return (
    <Shell
      title="Properties you report for"
      subtitle={properties.length + ' buildings · authority verified per owner'}
      actions={<Button href="/properties/add">Add a property</Button>}
    >
      <div className="ls-split" style={{ display: 'grid', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ font: '400 14px/1.55 ' + font.family, color: color.muted, margin: '0 0 6px', maxWidth: '58ch' }}>
            Your right to report each building comes from its management agreement. We warn you before one expires;
            nothing pauses without a LeazeSure review.
          </p>

          {properties.map((p) => {
            const warn = p.expiresInDays < 120;
            return (
              <div
                key={p.addr}
                style={{
                  padding: '22px 24px',
                  borderRadius: 22,
                  background: gradient.card,
                  border: '1px solid ' + color.line,
                  boxShadow: shadow.card,
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 15, marginBottom: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      flex: 'none',
                      borderRadius: 14,
                      background: gradient.avatar,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M4 10.4 12 4l8 6.4V19a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 19z" stroke="#1f5fa8" strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                    <div style={{ font: '600 16px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>
                      {p.addr}, {p.city}
                    </div>
                    <div style={{ font: '400 12px/1.4 ' + font.family, color: color.faint }}>
                      {p.units} units · {p.enrolled} enrolled · owned by {p.owner}
                    </div>
                  </div>
                  <Pill
                    bg={warn ? gradient.warnChip : gradient.info}
                    border={'1px solid ' + (warn ? color.warnLine : color.brandPale)}
                    fg={warn ? color.warnInk : color.brandLabel}
                  >
                    {warn ? 'EXPIRES IN ' + p.expiresInDays + ' DAYS' : 'AUTHORITY VERIFIED'}
                  </Pill>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: 12,
                    padding: '13px 15px',
                    borderRadius: 14,
                    background: gradient.cardInset,
                    border: '1px solid #e4edf8',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flex: 'none' }} aria-hidden>
                    <path d="M6.4 3.4h7l4.2 4.2v13c0 1-.8 1.8-1.8 1.8H6.4c-1 0-1.8-.8-1.8-1.8V5.2c0-1 .8-1.8 1.8-1.8z" stroke="#1f5fa8" strokeWidth="1.7" strokeLinejoin="round" />
                  </svg>
                  <span style={{ flex: 1, font: '500 12px ' + font.family, color: color.ink }}>
                    Management agreement · expires {p.agreementExpires}
                  </span>
                  {warn ? (
                    <Button tone="warn" size="sm">
                      Upload renewal
                    </Button>
                  ) : null}
                  <Button tone="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="warn" style={{ borderRadius: 22 }}>
            <Eyebrow tone="warn">WHEN AN AGREEMENT EXPIRES</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.warnInkSoft, textWrap: 'pretty' as never }}>
              We warn you at 90, 60 and 30 days. Reporting keeps running past the date — but LeazeSure reviews the
              building and may contact you or the owner before deciding whether it continues. Uploading the renewed
              agreement ends the review.
            </div>
          </Card>
          <Card>
            <Eyebrow>ADDING A PROPERTY</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.body, textWrap: 'pretty' as never }}>
              Each new building needs its own management agreement so we can verify your authority for that owner.
              Approval usually takes one to two business days, then you can add its tenants.
            </div>
          </Card>
          <Card>
            <Eyebrow>MANAGERS AREN&apos;T OWNERS</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.body, textWrap: 'pretty' as never }}>
              Equifax asks data furnishers to verify ownership. A management company doesn&apos;t own its buildings, so
              we accept a management agreement plus a corporate document as proof of authority to act for the owner.
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
