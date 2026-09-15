'use client';

import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { seededFlags, tenants as allTenants } from './data';
import type { FlagRecord, FlagReason, RowStatus, Tenant } from './types';

interface State {
  /** Current-month status overrides, keyed by tenant id. */
  rowStatus: Record<string, RowStatus>;
  flags: FlagRecord[];
  /** Tenant ids selected in the "report a miss" flow. */
  selection: Record<string, boolean>;
  reason: FlagReason;
  month: string;
  partialAmount: string;
  latePaidOn: string;
  /** PM objections to a LeazeSure decision, keyed by flag id. */
  objections: Record<string, boolean>;
  /** Payment records confirmed for an Equifax dispute, keyed by flag id. */
  recordsConfirmed: Record<string, boolean>;
}

type Action =
  | { type: 'toggleSelection'; id: string }
  | { type: 'selectOnly'; id: string }
  | { type: 'clearSelection' }
  | { type: 'setReason'; reason: FlagReason }
  | { type: 'setMonth'; month: string }
  | { type: 'setPartialAmount'; value: string }
  | { type: 'setLatePaidOn'; value: string }
  | { type: 'submitFlags'; subjects: Tenant[] }
  | { type: 'clearFlag'; id: string }
  | { type: 'object'; id: string }
  | { type: 'confirmRecords'; id: string }
  | { type: 'reset' };

const initialState: State = {
  rowStatus: {},
  flags: seededFlags,
  selection: {},
  reason: 'unpaid',
  month: 'August 2026',
  partialAmount: '',
  latePaidOn: '',
  objections: {},
  recordsConfirmed: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'toggleSelection':
      return { ...state, selection: { ...state.selection, [action.id]: !state.selection[action.id] } };
    case 'selectOnly':
      return { ...state, selection: { [action.id]: true } };
    case 'clearSelection':
      return { ...state, selection: {} };
    case 'setReason':
      return { ...state, reason: action.reason };
    case 'setMonth':
      return { ...state, month: action.month };
    case 'setPartialAmount':
      return { ...state, partialAmount: action.value };
    case 'setLatePaidOn':
      return { ...state, latePaidOn: action.value };
    case 'submitFlags': {
      const ids = action.subjects.map((t) => t.id);
      if (!ids.length) return state;
      const rowStatus = { ...state.rowStatus };
      ids.forEach((id) => {
        rowStatus[id] = 'flagged';
      });
      const detail =
        state.reason === 'partial'
          ? 'Paid ' + (state.partialAmount || '$0') + ' of rent'
          : state.reason === 'late'
            ? 'Paid on ' + (state.latePaidOn || '—')
            : undefined;
      const record: FlagRecord = {
        id: 'flag-' + Date.now(),
        month: state.month,
        tenantIds: ids,
        reason: state.reason,
        raised: '2 Sep',
        // A dispute or arrangement is held outright; everything else runs the grace clock.
        status: state.reason === 'dispute' ? 'held' : 'grace',
        detail,
        graceEnds: '2 October',
        subjects: action.subjects.map((t) => ({ name: t.name, ref: t.ref, unit: t.unit, initials: t.initials })),
      };
      return { ...state, rowStatus, flags: [record, ...state.flags], selection: {} };
    }
    case 'clearFlag': {
      const target = state.flags.find((f) => f.id === action.id);
      const rowStatus = { ...state.rowStatus };
      target?.tenantIds.forEach((id) => {
        rowStatus[id] = 'paid';
      });
      return {
        ...state,
        rowStatus,
        flags: state.flags.map((f) =>
          f.id === action.id ? { ...f, status: 'resolved', detail: 'Cleared by you — never filed' } : f,
        ),
      };
    }
    case 'object':
      return {
        ...state,
        objections: { ...state.objections, [action.id]: true },
        flags: state.flags.map((f) =>
          f.id === action.id ? { ...f, status: 'held', detail: 'You objected · held until both sides agree' } : f,
        ),
      };
    case 'confirmRecords':
      return { ...state, recordsConfirmed: { ...state.recordsConfirmed, [action.id]: true } };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

interface Store extends State {
  tenants: Tenant[];
  selectedIds: string[];
  dispatch: Dispatch<Action>;
  toggleSelection: (id: string) => void;
  submitFlags: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function PortalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const selectedIds = useMemo(
    () => Object.keys(state.selection).filter((id) => state.selection[id]),
    [state.selection],
  );

  const toggleSelection = useCallback((id: string) => dispatch({ type: 'toggleSelection', id }), []);

  const submitFlags = useCallback(() => {
    const subjects = allTenants.filter((t) => selectedIds.includes(t.id));
    dispatch({ type: 'submitFlags', subjects });
  }, [selectedIds]);

  const value = useMemo<Store>(
    () => ({ ...state, tenants: allTenants, selectedIds, dispatch, toggleSelection, submitFlags }),
    [state, selectedIds, toggleSelection, submitFlags],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function usePortal(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('usePortal must be used inside <PortalProvider>');
  return ctx;
}
