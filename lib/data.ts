import type { FlagRecord, Property, Tenant } from './types';

const NAMES = (
  'Amara Okonkwo|Daniel Reyes|Priya Raman|Marcus Bell|Sofia Andrade|Ji-woo Park|Hassan Farah|Chloe Martin|Andre Boucher|Nadia Haddad|' +
  'Elena Novak|Tomas Silva|Aisha Nasser|Owen Clarke|Mei Tanaka|Liam Doyle|Grace Mensah|Kwame Osei|Ines Duarte|Rafael Costa|' +
  'Yuki Sato|Dmitri Petrov|Fatima Aziz|Noah Whitfield|Leila Karam|Samuel Adeyemi|Ava Brennan|Idris Rahman|Bianca Ferreira|Tariq Hassan|' +
  'Nora Lindqvist|Felix Mueller|Zara Khalid|Hugo Moreau|Camila Rojas|Jonas Weber|Maya Chandran|Sena Yilmaz|Oscar Lindgren|Lucia Navarro|' +
  'Ethan Cole|Amira Zahra|Victor Ivanov|Rosa Delgado|Kenji Ito|Talia Ben-Ami|Bruno Alves|Yara Haddadi|Milo Rossi|Selin Demir|Arjun Nair|Elise Fontaine'
).split('|');

interface Building {
  addr: string;
  city: string;
  owner: string;
  base: number;
  units?: string[];
  count?: number;
  firstUnit?: number;
  unitStep?: number;
  agreementExpires: string;
  expiresInDays: number;
}

const BUILDINGS: Building[] = [
  { addr: '12 Maple Ridge Dr', city: 'Waterloo', owner: 'Maple Ridge Holdings Ltd.', base: 1380, count: 16, firstUnit: 4, unitStep: 3, agreementExpires: '31 Mar 2027', expiresInDays: 560 },
  { addr: '48 Erb St W', city: 'Waterloo', owner: 'Erb Street Residences Inc.', base: 1590, units: ['101', '104', '107', '110', '201', '204', '207', '210', '301', '302', '305', '308', '401', '404', '407'], agreementExpires: '30 Nov 2026', expiresInDays: 78 },
  { addr: '90 King St N', city: 'Kitchener', owner: 'K-W Urban Rentals', base: 1465, count: 14, firstUnit: 3, unitStep: 2, agreementExpires: '15 Aug 2027', expiresInDays: 700 },
];

/** Extra names on a lease, keyed by unit index. */
const CO_TENANTS: Record<number, number> = { 4: 1, 12: 2, 20: 1, 31: 1 };
const INVITED = [6, 18, 27, 33, 40];
const DECLINED = [44];
const CONSENT_DATES = ['14 Feb', '3 Mar', '22 Mar', '9 Apr', '1 May', '18 May', '2 Jun', '27 Jun', '11 Jul', '5 Aug'];

/**
 * Demo portfolio: 48 units across 3 buildings, 52 tenants once co-tenants are
 * counted. Deterministic so screenshots and tests stay stable.
 */
export function buildTenants(): Tenant[] {
  const out: Tenant[] = [];
  let unitIndex = 0;
  let nameIndex = 0;
  let id = 2100;

  for (const b of BUILDINGS) {
    const count = b.units ? b.units.length : b.count ?? 0;
    for (let i = 0; i < count; i++) {
      const unitNo = b.units ? b.units[i] : String((b.firstUnit ?? 1) + i * (b.unitStep ?? 1));
      const unit = b.addr + ', Unit ' + unitNo;
      const rent = b.base + (unitIndex % 6) * 45;
      const consent = INVITED.includes(unitIndex) ? 'invited' : DECLINED.includes(unitIndex) ? 'declined' : 'consented';
      const extra = CO_TENANTS[unitIndex] ?? 0;

      for (let m = 0; m <= extra; m++) {
        const full = NAMES[nameIndex % NAMES.length];
        nameIndex++;
        out.push({
          id: 'T' + id++,
          ref: 'LS-003-' + unitNo + (extra ? 'ABC'[m] : ''),
          leaseRef: 'LS-003-' + unitNo,
          unit,
          unitNo,
          addr: b.addr,
          city: b.city,
          name: full,
          initials: full.split(' ').map((w) => w[0]).join(''),
          rent: '$' + rent.toLocaleString(),
          shared: extra > 0,
          onLease: extra + 1,
          months: String(6 - (unitIndex % 4)),
          consent,
          verifying: unitIndex === 9 && m === 0,
          withdrawn: unitIndex === 36,
          consentDate: CONSENT_DATES[unitIndex % CONSENT_DATES.length],
          dueDay: unitIndex % 7 === 3 ? '5th' : '1st',
          leaseEnd: unitIndex % 11 === 2 ? '30 Sep 2026' : unitIndex % 11 === 5 ? '31 Oct 2026' : 'Dec 2026 – Dec 2027',
          leaseEnding: unitIndex % 11 === 2,
          shareMismatch: unitIndex === 12,
          late: unitIndex === 22 && m === 0,
        });
      }
      unitIndex++;
    }
  }
  return out;
}

export const tenants: Tenant[] = buildTenants();

export const properties: Property[] = BUILDINGS.map((b) => {
  const units = new Set(tenants.filter((t) => t.addr === b.addr).map((t) => t.unit));
  const enrolled = tenants.filter((t) => t.addr === b.addr && t.consent === 'consented' && !t.withdrawn).length;
  return {
    addr: b.addr,
    city: b.city,
    owner: b.owner,
    units: units.size,
    enrolled,
    agreementExpires: b.agreementExpires,
    expiresInDays: b.expiresInDays,
  };
});

/** Flag history that predates this session. */
export const seededFlags: FlagRecord[] = [
  {
    id: 'seed-equifax', month: 'August 2026', tenantIds: [], reason: 'equifax', raised: '1 Sep', status: 'equifax',
    detail: 'Raised with Equifax directly · we must answer by 11 Sep',
    subjects: [{ name: 'Priya Raman', ref: 'LS-003-10', unit: '12 Maple Ridge Dr, Unit 10', initials: 'PR' }],
  },
  {
    id: 'seed-fraud', month: 'July 2026', tenantIds: [], reason: 'fraud', raised: '22 Aug', status: 'fraud',
    detail: 'Identity theft report received · Equifax asked to delete · reporting stopped',
    subjects: [{ name: 'Tomas Silva', ref: 'LS-003-13', unit: '12 Maple Ridge Dr, Unit 13', initials: 'TS' }],
  },
  {
    id: 'seed-disputed', month: 'August 2026', tenantIds: [], reason: 'unpaid', raised: '2 Sep', status: 'disputed',
    detail: 'Tenant uploaded proof · LeazeSure reviewing · 5 days left to object',
    subjects: [{ name: 'Marcus Bell', ref: 'LS-003-302', unit: '48 Erb St W, Unit 302', initials: 'MB' }],
  },
  {
    id: 'seed-held', month: 'July 2026', tenantIds: [], reason: 'dispute', raised: '9 Aug', status: 'held',
    detail: 'You objected · held until both sides agree',
    subjects: [{ name: 'Grace Mensah', ref: 'LS-003-201', unit: '48 Erb St W, Unit 201', initials: 'GM' }],
  },
  {
    id: 'seed-resolved', month: 'July 2026', tenantIds: [], reason: 'late', raised: '6 Aug', status: 'resolved',
    detail: 'Paid on 4 Jul · cleared by LeazeSure',
    subjects: [{ name: 'Ji-woo Park', ref: 'LS-003-8', unit: '90 King St N, Unit 8', initials: 'JP' }],
  },
  {
    id: 'seed-filed', month: 'June 2026', tenantIds: [], reason: 'unpaid', raised: '4 Jul', status: 'filed',
    detail: 'Filed 10 Aug as 30+ days past due',
    subjects: [{ name: 'Owen Clarke', ref: 'LS-003-107', unit: '48 Erb St W, Unit 107', initials: 'OC' }],
  },
];

export const partner = {
  company: 'Maple Ridge Property Management',
  signatory: 'Ravi Chandran',
  role: 'Director',
  email: 'ravi@mapleridgepm.ca',
  phoneMasked: '+1 (519) ••• 4410',
  businessNumber: '84726 5591 RC0001',
  province: 'Ontario',
  currentMonth: 'August 2026',
} as const;
