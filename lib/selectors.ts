import type { FlagRecord, RowStatus, Tenant } from './types';

/**
 * Current-month status for a tenant. Withdrawal outranks everything; an
 * unfinished ID check blocks filing; otherwise silence means paid.
 */
export function statusOf(tenant: Tenant, overrides: Record<string, RowStatus>): RowStatus {
  if (tenant.withdrawn) return 'withdrawn';
  const override = overrides[tenant.id];
  if (override) return override;
  if (tenant.late) return 'flagged';
  if (tenant.verifying) return 'verifying';
  return 'paid';
}

export const isEnrolled = (t: Tenant) => t.consent === 'consented' && !t.withdrawn;

/** Everyone the portal shows on the roll: enrolled plus recently withdrawn. */
export const onRoll = (list: Tenant[]) => list.filter((t) => isEnrolled(t) || t.withdrawn);

export function searchTenants(list: Tenant[], query: string): Tenant[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((t) =>
    (t.unit + ' ' + t.name + ' ' + t.ref + ' ' + t.addr).toLowerCase().includes(q),
  );
}

export interface RollSummary {
  enrolled: number;
  reportingAsPaid: number;
  flagged: number;
  verifying: number;
  withdrawn: number;
  disputed: number;
  awaitingConsent: number;
  units: number;
  leasesEnding: number;
}

export function summarise(
  list: Tenant[],
  overrides: Record<string, RowStatus>,
  flags: FlagRecord[],
): RollSummary {
  const enrolled = list.filter(isEnrolled);
  const flagged = enrolled.filter((t) => statusOf(t, overrides) === 'flagged').length;
  return {
    enrolled: enrolled.length,
    reportingAsPaid: enrolled.length - flagged,
    flagged,
    verifying: enrolled.filter((t) => t.verifying).length,
    withdrawn: list.filter((t) => t.withdrawn).length,
    disputed: flags.filter((f) => f.status === 'disputed' || f.status === 'equifax').length,
    awaitingConsent: list.filter((t) => t.consent !== 'consented').length,
    units: new Set(list.map((t) => t.unit)).size,
    leasesEnding: enrolled.filter((t) => t.leaseEnding).length,
  };
}

/** Amber sub-line shown under a tenant's name on the roll. */
export function rowNotice(t: Tenant): string | null {
  if (t.shareMismatch) return 'Shares declared total 120% · check lease';
  if (t.leaseEnding) return 'Lease ends 30 Sep · pauses unless renewed';
  return null;
}

export function groupByMonth(flags: FlagRecord[]): { month: string; records: FlagRecord[] }[] {
  const order: string[] = [];
  const byMonth = new Map<string, FlagRecord[]>();
  for (const f of flags) {
    if (!byMonth.has(f.month)) {
      byMonth.set(f.month, []);
      order.push(f.month);
    }
    byMonth.get(f.month)!.push(f);
  }
  return order.map((month) => ({ month, records: byMonth.get(month)! }));
}
