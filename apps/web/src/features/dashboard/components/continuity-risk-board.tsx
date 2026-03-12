import Link from 'next/link';
import { ContinuityRiskRow } from '@/lib/continuity-risk';

function riskBadgeClass(level: ContinuityRiskRow['riskLevel']): string {
  if (level === 'HIGH') return 'bg-rose-900/70 text-rose-200';
  if (level === 'MEDIUM') return 'bg-amber-900/70 text-amber-200';
  return 'bg-emerald-900/70 text-emerald-200';
}

export function ContinuityRiskBoard({ rows }: { rows: ContinuityRiskRow[] }) {
  return (
    <section className="panel p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Knowledge continuity risk</h3>
        <Link href="/handover-packs" className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
          Manage handover packs
        </Link>
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {rows.map((row) => (
          <li key={row.expertId} className="rounded bg-slate-900 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{row.expertName}</p>
              <span className={`rounded px-2 py-1 text-xs font-semibold ${riskBadgeClass(row.riskLevel)}`}>{row.riskLevel}</span>
            </div>
            <p className="mt-1 text-slate-300">
              {row.flaggedReason} • Linked records {row.linkedRecords} ({row.approvedLinkedRecords} approved)
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {row.handoverPackId ? `Pack ${row.handoverStatus} • Coverage ${row.coverageScore ?? 0}% • Target ${row.targetRole}` : 'No pack assigned'}
            </p>
          </li>
        ))}
        {!rows.length && <li className="rounded bg-slate-900 p-3 text-slate-300">No expert risk profiles yet.</li>}
      </ul>
    </section>
  );
}
