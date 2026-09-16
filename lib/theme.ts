/**
 * Design tokens for the LeazeSure partner portal.
 * Lifted verbatim from the design prototype so the port is pixel-faithful.
 */

export const color = {
  ink: '#0d2b4d',
  inkSoft: '#3f6b9c',
  body: '#4a6d95',
  muted: '#5d7fa8',
  faint: '#7c9bbd',
  ghost: '#9fb0ca',
  label: '#8b98b5',
  labelSoft: '#98a5c0',
  line: '#e0eaf7',
  lineSoft: '#f2f6fc',
  lineMid: '#eaf1f9',

  brand: '#469FE0',
  brandMid: '#2f7fc4',
  brandDeep: '#1f5fa8',
  brandInk: '#123a6e',
  brandPale: '#bcdcf6',
  brandLabel: '#1b5f9e',
  brandOn: '#154a80',

  warnInk: '#8a5c08',
  warnInkSoft: '#7c6238',
  warnLine: '#f2ddb4',
  warnEdge: '#e0c98a',
  warnDeep: '#c9962f',

  dangerInk: '#a8534b',
  dangerLine: '#f0c8c2',

  neutralBg: '#f4f6f9',
  neutralLine: '#e4e9f0',
  neutralInk: '#5d6f8f',
  /** De-emphasised small print. Darker than `faint` so it clears AA on the pale page gradients. */
  legalInk: '#385f8a',
} as const;

export const gradient = {
  /** Primary action / brand sweep. */
  action: 'linear-gradient(100deg,#123a6e,#1f5fa8 38%,#469FE0 72%,#7cc9ef)',
  actionTight: 'linear-gradient(140deg,#123a6e,#2f7fc4 60%,#469FE0)',
  chipOn: 'linear-gradient(120deg,#123a6e,#2f7fc4)',
  /** Page and panel grounds. */
  page: 'linear-gradient(170deg,#f7fbff,#eef6fd 55%,#eaf4fb)',
  pageWarm: 'linear-gradient(158deg,#f6fbff 0%,#e6f3fe 30%,#cfe7fb 66%,#c6e9ef 100%)',
  rail: 'linear-gradient(180deg,#ffffff,#f4faff)',
  card: 'linear-gradient(155deg,#ffffff,#f8fcff)',
  cardInset: 'linear-gradient(150deg,#f8fbff,#f2f8fe)',
  feature: 'linear-gradient(150deg,#f4faff,#e2f1fd 50%,#c9e5f9)',
  featureWide: 'linear-gradient(148deg,#f4faff 0%,#e2f1fd 36%,#c9e5f9 70%,#c4eaef 100%)',
  info: 'linear-gradient(140deg,#f2f9ff,#e2f1fd)',
  infoSoft: 'linear-gradient(150deg,#f4f9ff,#eaf4fd)',
  warn: 'linear-gradient(150deg,#fffdf8,#fff8ec)',
  warnChip: 'linear-gradient(120deg,#fff6e6,#fdf0d8)',
  warnSolid: 'linear-gradient(140deg,#c9962f,#e0b354)',
  danger: 'linear-gradient(120deg,#fdf1ee,#fbe6e1)',
  avatar: 'linear-gradient(140deg,#eaf2fd,#dff0fd)',
  avatarWarn: 'linear-gradient(140deg,#f6ecd4,#fdf6e6)',
  tableHead: 'linear-gradient(120deg,#f6faff,#eef6fd)',
  ghostBtn: 'linear-gradient(120deg,#ffffff,#f4faff)',
  ghostBtnAlt: 'linear-gradient(120deg,#ffffff,#eaf4fe)',
  field: 'linear-gradient(150deg,#ffffff,#f7fbff)',
} as const;

export const shadow = {
  action: '0 11px 26px rgba(30,90,150,.28)',
  actionHover: '0 15px 34px rgba(30,90,150,.44)',
  card: '0 5px 18px rgba(16,40,80,.05)',
  panel: '0 8px 28px rgba(40,100,160,.09)',
  feature: '0 10px 26px rgba(40,100,160,.13)',
  rail: '0 8px 20px rgba(30,90,150,.26)',
} as const;

export const font = {
  /**
   * Fed by next/font/google in app/layout.tsx. The fallback list lives INSIDE var()
   * on purpose: every call site interpolates this into the `font:` shorthand, and a
   * bare var() that failed to resolve would invalidate the whole shorthand.
   */
  family: "var(--font-poppins, system-ui, -apple-system, 'Segoe UI', sans-serif)",
} as const;

/** Uppercase eyebrow label used above every panel. */
export const eyebrow = {
  font: '600 9.5px/1 ' + font.family,
  letterSpacing: '.14em',
  color: color.label,
} as const;

/**
 * One content column shared by the marketing page's header, hero and footer.
 * `width: '100%'` is load-bearing: the page root is a flex column, and auto
 * cross-axis margins suppress flex stretch, so without it these blocks would
 * shrink-wrap to max-content instead of filling the column.
 */
export const layout = {
  maxW: 1440,
  /** Horizontal page gutter. Fluid so phone widths don't lose 112px to padding. */
  gutter: 'clamp(20px,5vw,56px)',
  container: { width: '100%', maxWidth: 1440, margin: '0 auto' },
} as const;
