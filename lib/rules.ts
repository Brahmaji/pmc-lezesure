/**
 * Reporting rules. These are product decisions, not UI details — keep them here
 * so the portal, the tenant app and any back-office tool agree.
 */
export const rules = {
  /** Equifax file goes out on the 10th; tenants can be flagged any time before. */
  filingDay: 10,
  filingLabel: '10 September',

  /**
   * Silence means paid: every enrolled tenant is reported as paid unless the
   * landlord flags them. Nothing to confirm in a normal month.
   */
  silenceMeansPaid: true,

  /** A flagged month is held, not filed, for this long. */
  graceDays: 30,
  graceEndsLabel: '2 October',

  /** PM's window to object after LeazeSure clears a disputed flag. */
  objectionDays: 7,

  /** How far back a PM may correct an already-filed month. */
  correctionWindowDays: 60,

  /** Furnisher response deadlines once a consumer disputes via Equifax. */
  equifaxDisputeDays: 10,
  equifaxFraudDisputeDays: 20,

  /** Reporting may start this month or next — never a past month. */
  allowBackdatedStart: false,

  /** At lease end reporting pauses until the PM confirms renewal or month-to-month. */
  pauseAtLeaseEnd: true,
  /** The tenant is told the day reporting pauses, and why. */
  notifyTenantOnPause: true,
} as const;

export const reasonLabel: Record<string, string> = {
  unpaid: 'Rent was not paid',
  partial: 'Only part was paid',
  late: 'Paid, but after the due date',
  dispute: 'Dispute or arrangement',
  equifax: 'Tenant disputed with Equifax',
  fraud: 'Identity theft reported',
};

export const flagReasons = [
  { key: 'unpaid', title: 'Rent was not paid', detail: 'Nothing received for this month' },
  { key: 'partial', title: 'Only part was paid', detail: 'Some rent received, a balance is outstanding', needs: 'amount' },
  { key: 'late', title: 'Paid, but after the due date', detail: 'Received in full, just late', needs: 'date' },
  { key: 'dispute', title: "There's a dispute or arrangement", detail: "Hold this month and don't file it" },
] as const;
