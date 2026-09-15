# LeazeSure Partners — rent reporting portal

Next.js (App Router) port of the LeazeSure B2B partner portal: the tool a property
management company uses to report its tenants' rent to **Equifax Canada Co.**

Built from the design prototype in this project, with the same palette, type and
copy. All product rules live in `lib/rules.ts` so the portal, the tenant app and
any back-office tool can agree on them.

---

## The model in one paragraph

A property manager adds tenants with their lease. **LeazeSure** — never the PM —
sends each tenant a consent invitation; the tenant confirms the lease, declares
their share if they have roommates, consents to Equifax reporting and verifies
their ID. From then on **silence means paid**: every enrolled tenant is reported
as paid on the 10th unless the PM flags them. A flagged month is *held*, not
filed, for 30 days while the tenant pays, sends proof or disputes it.

## Rules encoded in the UI

| Rule | Value | Where |
| --- | --- | --- |
| Filing day | 10th of the month | roll banner, flag flow |
| Silence means paid | yes | roll, flag search |
| Grace before filing | 30 days | flag reason, flags & disputes |
| PM objection window | 7 days | flags & disputes |
| Correction window | 60 days | flag reason (month picker) |
| Equifax dispute response | 10 days (20 for fraud) | flags & disputes, support |
| Backdated start | not allowed — this month or next | add tenants |
| Lease end | reporting pauses until the PM confirms | roll banner, tenant detail |
| Tenant told when paused | yes, same day | tenant detail |

## What a PM can and cannot see

Can: whether a tenant is enrolled, how many months have been reported, flag and
dispute status.
Cannot: the tenant's credit file or score, their ID documents, or their declared
share of the rent.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
npm run lint
```

Node 18.17+ (Next 14 requirement). No environment variables, no database — the
demo portfolio is generated deterministically in `lib/data.ts`.

## Routes

| Route | Screen |
| --- | --- |
| `/` | Partner marketing page |
| `/signin` | Sign in + two-step code (text or authenticator) |
| `/roll` | Rent roll — search, filter, per-tenant status |
| `/roll/tenant?id=T2100` | Tenant detail — tenancy, consent record, actions |
| `/flag` | Report a miss — search for the tenants |
| `/flag/reason` | Pick a reason, amount/date, month |
| `/flags` | Flags & disputes + filing record |
| `/tenants/new` | Add tenants (one or bulk) |
| `/properties` | Buildings, owners, management agreements |
| `/properties/add` | Add a building + authority documents |
| `/account` | Company, team, sign-in security |
| `/support` | Submit a ticket |

Tenant detail uses a query parameter rather than a dynamic segment so the tree
stays free of bracketed directory names; swapping it for `app/roll/[id]/page.tsx`
is a two-line change if you prefer.

## Project layout

```
app/                 routes (App Router, one page per screen)
components/
  Shell.tsx          sidebar + header chrome shared by portal screens
  ui.tsx             Button, Card, Pill, Avatar, Field, SegmentedControl…
  screens/           one component per screen, all client components
lib/
  data.ts            demo portfolio: 3 buildings, 48 units, 52 tenants
  rules.ts           product rules — grace, filing day, dispute deadlines
  selectors.ts       status derivation, search, roll summary
  store.tsx          React context + reducer (flags, selection, objections)
  theme.ts           colour, gradient, shadow and type tokens
  types.ts           Tenant, FlagRecord, statuses
```

## Replacing the demo data

`lib/data.ts` is the only file with fixtures. Swap `buildTenants()`,
`properties` and `seededFlags` for API calls (server components or a route
handler) and nothing else needs to change — screens read tenants through
`lib/selectors.ts` and session state through `usePortal()`.

## Not included

Deliberately out of scope for the partner portal:

- **LeazeSure back-office** — Equifax dispute intake (the Adobe-link workflow),
  furnisher authority review queue, bulk tenant ingestion.
- **Tenant app** — consent, proof upload and dispute live in the tenant-facing
  product; this repo only shows what the PM sees.
- **Auth** — `/signin` is a UI flow, not a real session. Wire it to your IdP and
  gate the portal routes in `middleware.ts`.
