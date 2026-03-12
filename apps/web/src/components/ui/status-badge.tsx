import { ApprovalState } from '@/lib/domain';

const stateStyles: Record<ApprovalState, string> = {
  DRAFT: 'border border-slate-500 bg-slate-700/80 text-slate-100',
  UNDER_REVIEW: 'border border-amber-400/60 bg-amber-500/20 text-amber-200',
  APPROVED: 'border border-emerald-400/50 bg-emerald-500/20 text-emerald-200',
  ARCHIVED: 'border border-rose-400/50 bg-rose-500/20 text-rose-200'
};

export function StatusBadge({ state }: { state: ApprovalState }) {
  return <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${stateStyles[state]}`}>{state.replace('_', ' ')}</span>;
}
