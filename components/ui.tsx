import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { color, font, gradient, shadow } from '@/lib/theme';

export function Eyebrow({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'brand' | 'warn' }) {
  const tones = { muted: color.label, brand: color.brandLabel, warn: color.warnInk };
  return (
    <div style={{ font: '600 9.5px/1 ' + font.family, letterSpacing: '.14em', color: tones[tone], marginBottom: 14 }}>
      {children}
    </div>
  );
}

export function Card({
  children,
  tone = 'plain',
  style,
}: {
  children: ReactNode;
  tone?: 'plain' | 'feature' | 'warn' | 'info';
  style?: CSSProperties;
}) {
  const tones: Record<string, CSSProperties> = {
    plain: { background: gradient.card, border: '1px solid ' + color.line, boxShadow: shadow.card },
    feature: { background: gradient.feature, border: '1px solid #d3e8f9', boxShadow: shadow.feature },
    warn: { background: gradient.warn, border: '1px solid ' + color.warnLine },
    info: { background: gradient.info, border: '1px solid ' + color.brandPale },
  };
  return <div style={{ padding: '22px 24px', borderRadius: 22, ...tones[tone], ...style }}>{children}</div>;
}

type ButtonTone = 'action' | 'ghost' | 'warn' | 'danger';

const buttonTone: Record<ButtonTone, CSSProperties> = {
  action: { background: gradient.action, color: '#fff', border: 'none', boxShadow: shadow.action },
  ghost: { background: gradient.ghostBtn, color: color.body, border: '1px solid ' + color.muted },
  warn: { background: gradient.warnChip, color: color.warnInk, border: '1px solid ' + color.warnEdge },
  danger: { background: 'linear-gradient(120deg,#fffafa,#fff4f4)', color: color.dangerInk, border: '1px solid #e2d3d3' },
};

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: ButtonTone;
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

export function Button({ children, onClick, href, tone = 'action', size = 'md', full, disabled, style }: ButtonProps) {
  const sizes = {
    sm: { padding: '9px 15px', font: '600 11.5px ' + font.family, borderRadius: 11 },
    md: { padding: '13px 20px', font: '600 13px ' + font.family, borderRadius: 13 },
    lg: { padding: '16px 32px', font: '600 15px ' + font.family, borderRadius: 15 },
  } as const;

  const base: CSSProperties = {
    ...sizes[size],
    ...buttonTone[tone],
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: full ? '100%' : undefined,
    textAlign: 'center',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    ...(disabled
      ? { background: 'linear-gradient(120deg,#e7eef8,#e4f1f6)', color: '#a3aec5', border: 'none', boxShadow: 'none' }
      : null),
    ...style,
  };

  const cls = disabled ? undefined : tone === 'action' ? 'ls-action' : 'ls-ghost';

  if (href && !disabled) {
    return (
      <Link href={href} className={cls} style={base}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={disabled ? undefined : onClick} disabled={disabled} style={base}>
      {children}
    </button>
  );
}

export function Pill({
  children,
  bg = gradient.info,
  border = '1px solid ' + color.brandPale,
  fg = color.brandLabel,
}: {
  children: ReactNode;
  bg?: string;
  border?: string;
  fg?: string;
}) {
  return (
    <span
      style={{
        font: '600 9.5px/1 ' + font.family,
        letterSpacing: '.07em',
        color: fg,
        padding: '6px 10px',
        borderRadius: 20,
        background: bg,
        border,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export function Avatar({ initials, tone = 'brand' }: { initials: string; tone?: 'brand' | 'warn' | 'mute' }) {
  const tones = {
    brand: { background: gradient.avatar, color: '#1b4f8f' },
    warn: { background: gradient.avatarWarn, color: color.warnInk },
    mute: { background: '#eceff4', color: color.ghost },
  };
  return (
    <div
      style={{
        width: 32,
        height: 32,
        flex: 'none',
        borderRadius: 11,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: '600 11px ' + font.family,
        ...tones[tone],
      }}
    >
      {initials}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ font: '600 9.5px/1 ' + font.family, letterSpacing: '.13em', color: color.label, marginBottom: 9 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        height: 50,
        padding: '0 15px',
        border: '1px solid #d9e6f5',
        borderRadius: 14,
        background: gradient.field,
        outline: 'none',
        font: '500 14px ' + font.family,
        color: color.ink,
      }}
    />
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 5,
        padding: 4,
        borderRadius: 12,
        background: gradient.infoSoft,
        border: '1px solid #dbe8f7',
        width: 'fit-content',
      }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              padding: '8px 14px',
              border: 'none',
              borderRadius: 9,
              background: on ? gradient.chipOn : 'transparent',
              color: on ? '#fff' : color.body,
              font: '600 11.5px ' + font.family,
              cursor: 'pointer',
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Check({ size = 12, stroke = '#fff' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 12.6l3.7 3.6L18 7.6" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckBadge({ size = 22 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(140deg,#1f5fa8,#469FE0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <Check size={size * 0.55} />
    </div>
  );
}

export function StatRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
      <span style={{ font: '500 12.5px/1.35 ' + font.family, color: strong ? color.ink : color.body }}>{label}</span>
      <span style={{ font: (strong ? '600 15px ' : '600 12px ') + font.family, color: color.ink, flex: 'none' }}>
        {value}
      </span>
    </div>
  );
}

export function Bullet({ children, tone = 'brand' }: { children: ReactNode; tone?: 'brand' | 'warn' }) {
  return (
    <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 5,
          height: 5,
          flex: 'none',
          borderRadius: '50%',
          marginTop: 7,
          background: tone === 'brand' ? 'linear-gradient(135deg,#1f5fa8,#469FE0)' : color.warnDeep,
        }}
      />
      <span style={{ font: '400 12.5px/1.55 ' + font.family, color: color.body, textWrap: 'pretty' as never }}>
        {children}
      </span>
    </div>
  );
}
