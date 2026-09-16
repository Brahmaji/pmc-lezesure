/**
 * Pure presentational mark. Deliberately lives outside Shell.tsx (a 'use client'
 * module) so server components like the marketing page can render it without
 * pulling the portal shell — nav, usePathname, usePortal — into the client bundle.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" role="img" aria-label="LeazeSure">
      <defs>
        <linearGradient id="ls-shield" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#123a6e" />
          <stop offset="0.6" stopColor="#2f7fc4" />
          <stop offset="1" stopColor="#7cc9ef" />
        </linearGradient>
      </defs>
      <path d="M16 2.5 28 7v9.4c0 7.3-4.9 13.4-12 15.1-7.1-1.7-12-7.8-12-15.1V7z" fill="url(#ls-shield)" />
      <path d="M10.5 16.6l4 3.9 8-8.2" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
