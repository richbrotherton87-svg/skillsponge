import Link from 'next/link';
import { StatusBadge } from '@/components/ui/status-badge';
import { DashboardMetrics, KnowledgeRecord } from '@/lib/domain';

export function DashboardOverview({
  metrics,
  recentRecords
}: {
  metrics: DashboardMetrics;
  recentRecords: KnowledgeRecord[];
}) {
  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-8">
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Total records</p>
          <p className="mt-1 text-2xl font-bold">{metrics.totalRecords}</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Approved records</p>
          <p className="mt-1 text-2xl font-bold">{metrics.approvedRecords}</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Draft records</p>
          <p className="mt-1 text-2xl font-bold">{metrics.draftRecords}</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Expert interviews</p>
          <p className="mt-1 text-2xl font-bold">{metrics.expertInterviewsCaptured}</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Shadowing records</p>
          <p className="mt-1 text-2xl font-bold">{metrics.shadowingRecordsCaptured}</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">High-risk experts</p>
          <p className="mt-1 text-2xl font-bold">{metrics.atRiskExperts}</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Open handover packs</p>
          <p className="mt-1 text-2xl font-bold">{metrics.openHandoverPacks}</p>
        </article>
        <article className="panel p-4">
          <Link href="/capture-knowledge" className="block rounded bg-emerald-500 px-3 py-2 text-center text-sm font-semibold text-slate-950">
            Capture knowledge
          </Link>
        </article>
      </section>

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Recent knowledge activity</h3>
        <ul className="mt-3 space-y-2">
          {recentRecords.map((record) => (
            <li key={record.id} className="flex items-start justify-between gap-4 rounded bg-slate-900 p-3">
              <div>
                <Link href={`/knowledge-records/${record.id}`} className="font-medium hover:text-emerald-300">
                  {record.title}
                </Link>
                <p className="text-sm text-slate-400">{record.context.asset} • {record.context.task}</p>
              </div>
              <StatusBadge state={record.approvalState} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
