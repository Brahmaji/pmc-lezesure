'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Shell } from '@/components/Shell';
import { Button, Card, CheckBadge, Eyebrow, Pill, StatRow } from '@/components/ui';
import { tenants } from '@/lib/data';
import { rules } from '@/lib/rules';
import { statusOf } from '@/lib/selectors';
import { usePortal } from '@/lib/store';
import { color, font, gradient, shadow } from '@/lib/theme';
import type { RowStatus } from '@/lib/types';

const STATUS_PILL: Record<RowStatus, { label: string; bg: string; border: string; fg: string }> = {
  paid: { label: 'REPORTING AS PAID', bg: gradient.info, border: '1px solid #bcdcf6', fg: color.brandLabel },
  flagged: { label: 'FLAGGED · IN GRACE', bg: gradient.warnChip, border: '1px solid #f2ddb4', fg: color.warnInk },
  verifying: { label: 'ENROLLED · VERIFYING ID', bg: gradient.warnChip, border: '1px solid #f2ddb4', fg: color.warnInk },
  withdrawn: { label: 'CONSENT WITHDRAWN 28 AUG', bg: color.neutralBg, border: '1px solid ' + color.neutralLine, fg: color.label },
};

export function TenantDetail({ tenantId }: { tenantId?: string }) {
  const router = useRouter();
  const { rowStatus, dispatch } = usePortal();
  const [panel, setPanel] = useState<'none' | 'rent' | 'end' | 'move' | 'renew'>('none');
  const [done, setDone] = useState<string | null>(null);

  const tenant = tenants.find((t) => t.id === tenantId) ?? tenants[0];
  const status = statusOf(tenant, rowStatus);
  const pill = STATUS_PILL[status];
  const active = status !== 'withdrawn';

  const finish = (message: string) => {
    setPanel('none');
    setDone(message);
  };

  return (
    <Shell title={tenant.name} subtitle={tenant.unit + ' · ' + tenant.ref} actions={<Button href="/roll" tone="ghost">Back to roll</Button>}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 22, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '26px 28px',
              borderRadius: 24,
              background: gradient.card,
              border: '1px solid ' + color.line,
              boxShadow: shadow.card,
            }}
          >
            <div
              style={{
                width: 62,
                height: 62,
                flex: 'none',
                borderRadius: 20,
                background: 'linear-gradient(140deg,#123a6e,#2f7fc4 55%,#469FE0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 24px rgba(40,110,180,.3)',
                font: '700 19px ' + font.family,
                color: '#fff',
              }}
            >
              {tenant.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: '700 22px/1.2 ' + font.family, letterSpacing: '-.02em', color: color.ink, marginBottom: 5 }}>
                {tenant.name}
              </div>
              <div style={{ font: '400 13px/1.4 ' + font.family, color: color.muted }}>
                {tenant.unit} · {tenant.ref} · Enrolled since {tenant.consentDate}
              </div>
            </div>
            <Pill bg={pill.bg} border={pill.border} fg={pill.fg}>
              {pill.label}
            </Pill>
          </div>

          <Card style={{ padding: '24px 26px', borderRadius: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Eyebrow>TENANCY</Eyebrow>
              {active ? (
                <Button tone="ghost" size="sm" onClick={() => setPanel(panel === 'rent' ? 'none' : 'rent')}>
                  Update rent
                </Button>
              ) : null}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Inset label="MONTHLY RENT (LEASE)" value={tenant.rent} />
              <Inset label="DUE ON" value={tenant.dueDay + ' of the month'} />
              <Inset label="ON THE LEASE" value={tenant.onLease + ' tenant(s) · shares declared by each'} />
              <Inset label="MONTHS REPORTED" value={tenant.months} />
              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '15px 17px',
                  borderRadius: 15,
                  background: gradient.cardInset,
                  border: '1px solid #e4edf8',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ font: '500 9px/1 ' + font.family, letterSpacing: '.11em', color: color.labelSoft, marginBottom: 7 }}>
                    LEASE ENDS
                  </div>
                  <div style={{ font: '600 15px/1.3 ' + font.family, color: color.ink }}>{tenant.leaseEnd}</div>
                </div>
                {tenant.leaseEnding ? (
                  <Button tone="warn" size="sm" onClick={() => setPanel(panel === 'renew' ? 'none' : 'renew')}>
                    Renewing?
                  </Button>
                ) : null}
              </div>
            </div>

            {tenant.shareMismatch ? (
              <div
                style={{
                  marginTop: 14,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '15px 17px',
                  borderRadius: 15,
                  background: gradient.warn,
                  border: '1.4px solid ' + color.warnEdge,
                }}
              >
                <WarnIcon />
                <div>
                  <div style={{ font: '600 13px/1.3 ' + font.family, color: color.ink, marginBottom: 3 }}>
                    The shares this household declared add up to 120% of the rent
                  </div>
                  <div style={{ font: '400 12px/1.5 ' + font.family, color: color.warnInkSoft }}>
                    We report what each tenant told us, but the lease may be wrong or someone may be over-declaring.
                    Worth a look — you don&apos;t see the individual shares.
                  </div>
                </div>
              </div>
            ) : null}

            {panel === 'rent' ? (
              <Panel
                tone="info"
                eyebrow="RENT CHANGE (RENEWAL OR N1 NOTICE)"
                body="Past months keep the old amount. The tenant confirms the new rent in their app before it's used."
                fields={['New monthly rent', 'Effective from']}
                cta="Send to tenant to confirm"
                onConfirm={() => finish('Rent change sent — awaiting the tenant’s confirmation.')}
              />
            ) : null}

            {panel === 'renew' ? (
              <div
                className="ls-rise"
                style={{ marginTop: 14, padding: '18px 20px', borderRadius: 17, background: gradient.warn, border: '1.4px solid ' + color.warnLine }}
              >
                <Eyebrow tone="warn">LEASE ENDS {tenant.leaseEnd}</Eyebrow>
                <div style={{ font: '400 12.5px/1.55 ' + font.family, color: color.warnInkSoft, marginBottom: 12 }}>
                  Reporting pauses after this month until you confirm. The tenant is told the day it pauses, and why.
                </div>
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
                  <Button size="sm" onClick={() => finish('Renewal recorded — reporting continues without a pause.')}>
                    Renewed — upload new lease
                  </Button>
                  <Button tone="ghost" size="sm" onClick={() => finish('Continuing month-to-month — no pause.')}>
                    Continuing month-to-month
                  </Button>
                  <Button tone="ghost" size="sm" onClick={() => setPanel('end')}>
                    Tenant is leaving
                  </Button>
                </div>
              </div>
            ) : null}
          </Card>

          <Card style={{ padding: '24px 26px', borderRadius: 24 }}>
            <Eyebrow>ACTIONS</Eyebrow>
            {active ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <Button
                  tone="warn"
                  onClick={() => {
                    dispatch({ type: 'selectOnly', id: tenant.id });
                    router.push('/flag/reason');
                  }}
                >
                  Flag a missed payment
                </Button>
                <Button tone="ghost" onClick={() => setPanel(panel === 'end' ? 'none' : 'end')}>
                  End tenancy
                </Button>
                <Button tone="ghost" onClick={() => setPanel(panel === 'move' ? 'none' : 'move')}>
                  Move to another unit
                </Button>
              </div>
            ) : (
              <div style={{ font: '400 12.5px/1.55 ' + font.family, color: color.muted }}>
                This tenant withdrew consent on 28 Aug. Reporting stopped; months already filed stay on their Equifax
                record. If they re-enrol, they come back through the same invitation.
              </div>
            )}

            {panel === 'end' ? (
              <Panel
                tone="warn"
                eyebrow="END TENANCY"
                body="Reporting stops after the final month you choose. Their history stays on file and follows them to their next home."
                fields={['Final month: September 2026']}
                cta="Confirm"
                onConfirm={() => finish('Tenancy ends after September 2026. The tenant has been told.')}
              />
            ) : null}

            {panel === 'move' ? (
              <Panel
                tone="info"
                eyebrow="MOVE WITHIN YOUR PORTFOLIO"
                body="Their history continues unbroken. The tenant confirms the new unit and rent in their app; the new address applies from the move month."
                fields={['New property & unit', 'New rent', 'Move month']}
                cta="Send to tenant to confirm"
                onConfirm={() => finish('Move sent — awaiting the tenant’s confirmation.')}
              />
            ) : null}

            {done ? (
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
                <span style={{ font: '500 12.5px ' + font.family, color: color.ink }}>{done}</span>
              </div>
            ) : null}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Card tone="feature">
            <Eyebrow tone="brand">WHAT YOU CAN&apos;T SEE HERE</Eyebrow>
            <div style={{ font: '400 12.5px/1.65 ' + font.family, color: color.inkSoft, textWrap: 'pretty' as never }}>
              Their declared share, their ID documents, and their credit file. Equifax and privacy law keep those
              between the tenant and LeazeSure.
            </div>
          </Card>
          <Card>
            <Eyebrow>CONSENT RECORD</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <StatRow label="Consented" value={tenant.consentDate + ' 2026'} />
              <StatRow label="Lease confirmed by tenant" value="Yes" />
              <StatRow label="ID verified (Didit)" value={tenant.verifying ? 'In progress' : 'Passed'} />
              <StatRow label="Authorisation version" value="v1.2 · Feb 2026" />
            </div>
          </Card>
          <Card>
            <Eyebrow>REPORTING RULES</Eyebrow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <StatRow label="Grace before filing" value={rules.graceDays + ' days'} />
              <StatRow label="Correction window" value={rules.correctionWindowDays + ' days'} />
              <StatRow label="Equifax dispute response" value={rules.equifaxDisputeDays + ' days'} />
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Inset({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '15px 17px', borderRadius: 15, background: gradient.cardInset, border: '1px solid #e4edf8' }}>
      <div style={{ font: '500 9px/1 ' + font.family, letterSpacing: '.11em', color: color.labelSoft, marginBottom: 7 }}>{label}</div>
      <div style={{ font: '600 15px/1.3 ' + font.family, color: color.ink }}>{value}</div>
    </div>
  );
}

function Panel({
  tone,
  eyebrow,
  body,
  fields,
  cta,
  onConfirm,
}: {
  tone: 'info' | 'warn';
  eyebrow: string;
  body: string;
  fields: string[];
  cta: string;
  onConfirm: () => void;
}) {
  const skin =
    tone === 'info'
      ? { background: gradient.feature, border: '1.4px solid ' + color.brandPale, edge: '#c2ddf5', text: color.inkSoft }
      : { background: gradient.warn, border: '1.4px solid ' + color.warnLine, edge: color.warnEdge, text: color.warnInkSoft };

  return (
    <div className="ls-rise" style={{ marginTop: 14, padding: '18px 20px', borderRadius: 17, background: skin.background, border: skin.border }}>
      <Eyebrow tone={tone === 'info' ? 'brand' : 'warn'}>{eyebrow}</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + fields.length + ',1fr)', gap: 10, marginBottom: 12 }}>
        {fields.map((f) => (
          <div
            key={f}
            style={{
              height: 46,
              padding: '0 14px',
              border: '1px solid ' + skin.edge,
              borderRadius: 12,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              font: '500 13px ' + font.family,
              color: '#a3b4cb',
            }}
          >
            {f}
          </div>
        ))}
      </div>
      <div style={{ font: '400 11.5px/1.5 ' + font.family, color: skin.text, marginBottom: 12 }}>{body}</div>
      <Button size="sm" onClick={onConfirm}>
        {cta}
      </Button>
    </div>
  );
}

function WarnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flex: 'none', marginTop: 2 }} aria-hidden>
      <circle cx="12" cy="12" r="8.8" stroke="#a8710d" strokeWidth="1.7" />
      <path d="M12 7.8v5.4M12 15.9v.1" stroke="#a8710d" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
