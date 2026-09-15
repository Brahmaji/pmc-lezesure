export type ConsentState = 'consented' | 'invited' | 'declined';

/** What the portal shows for a tenant in the current reporting month. */
export type RowStatus = 'paid' | 'flagged' | 'verifying' | 'withdrawn';

/** Why a landlord flagged a month. Drives what extra data Equifax needs. */
export type FlagReason = 'unpaid' | 'partial' | 'late' | 'dispute' | 'equifax' | 'fraud';

/**
 * Lifecycle of a flagged month.
 * - grace     raised, tenant notified, held — reversible
 * - disputed  tenant sent proof; LeazeSure reviewing, PM has 7 days to object
 * - held      PM objected or an arrangement exists; nothing files until both agree
 * - equifax   tenant disputed via Equifax; furnisher must answer in 10 days (20 for fraud)
 * - fraud     identity-theft report received; reporting stopped, deletion requested
 * - resolved  cleared inside the window; never filed
 * - filed     on the consumer's Equifax record
 */
export type FlagStatus = 'grace' | 'disputed' | 'held' | 'equifax' | 'fraud' | 'resolved' | 'filed';

export interface Tenant {
  id: string;
  /** Per-person reference. Co-tenants share a leaseRef and get A/B/C suffixes. */
  ref: string;
  leaseRef: string;
  unit: string;
  unitNo: string;
  addr: string;
  city: string;
  name: string;
  initials: string;
  /** Whole-lease rent. Individual shares are declared by tenants and never shown to the PM. */
  rent: string;
  shared: boolean;
  onLease: number;
  months: string;
  consent: ConsentState;
  /** Consented but Didit ID check not yet passed — nothing files for them. */
  verifying: boolean;
  withdrawn: boolean;
  consentDate: string;
  dueDay: string;
  leaseEnd: string;
  leaseEnding: boolean;
  /** Declared shares across the household don't total 100%. */
  shareMismatch: boolean;
  late: boolean;
}

export interface FlagSubject {
  name: string;
  ref: string;
  unit: string;
  initials: string;
}

export interface FlagRecord {
  id: string;
  month: string;
  tenantIds: string[];
  reason: FlagReason;
  raised: string;
  status: FlagStatus;
  detail?: string;
  graceEnds?: string;
  subjects: FlagSubject[];
}

export interface Property {
  addr: string;
  city: string;
  owner: string;
  units: number;
  enrolled: number;
  agreementExpires: string;
  /** Days until the management agreement lapses. */
  expiresInDays: number;
}
