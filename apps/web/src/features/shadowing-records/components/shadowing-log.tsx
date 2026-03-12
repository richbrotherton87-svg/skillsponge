import Link from 'next/link';
import { ShadowingRecord } from '@/lib/domain';
import { StatusBadge } from '@/components/ui/status-badge';

export function ShadowingLog({ records }: { records: ShadowingRecord[] }) {
  return (
    <section className="panel p-4">
      <h3 className="text-lg font-semibold">Shadowing and mentoring records</h3>
      <div className="mt-3 space-y-3">
        {records.map((record) => (
          <article key={record.id} className="rounded bg-slate-900 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/knowledge-records/${record.id}`} className="font-medium hover:text-emerald-300">
                  {record.title}
                </Link>
                <p className="text-sm text-slate-400">Senior: {record.seniorTechnician} • Junior: {record.juniorTechnician}</p>
                <p className="mt-1 text-sm text-slate-300">Outcome: {record.sessionOutcome}</p>
              </div>
              <StatusBadge state={record.approvalState} />
            </div>
          </article>
        ))}
      </div>
      {!records.length && <p className="mt-3 text-sm text-slate-300">No shadowing records captured yet.</p>}
    </section>
  );
}
