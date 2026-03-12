import Link from 'next/link';
import { StatusBadge } from '@/components/ui/status-badge';
import { SearchFilters, SearchFilterOptions, getTypeLabel } from '@/lib/knowledge-service';
import { KnowledgeRecord } from '@/lib/domain';

export function SearchWorkspace({
  results,
  filters,
  options
}: {
  results: KnowledgeRecord[];
  filters: SearchFilters;
  options: SearchFilterOptions;
}) {
  return (
    <div className="space-y-4">
      <section className="panel p-4">
        <form className="grid gap-3 md:grid-cols-4" method="get">
          <input
            name="keyword"
            defaultValue={filters.keyword}
            className="rounded-md border border-slate-700 bg-slate-900 p-3 md:col-span-2"
            placeholder="Keyword in title, content, or tags"
          />
          <select name="type" defaultValue={filters.type ?? 'ALL'} className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <option value="ALL">All types</option>
            {options.types.map((type) => (
              <option key={type} value={type}>
                {getTypeLabel(type)}
              </option>
            ))}
          </select>
          <select name="status" defaultValue={filters.status ?? 'ALL'} className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <option value="ALL">All statuses</option>
            {options.statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
          <select name="asset" defaultValue={filters.asset} className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <option value="">All assets</option>
            {options.assets.map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>
          <select name="system" defaultValue={filters.system} className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <option value="">All systems</option>
            {options.systems.map((system) => (
              <option key={system} value={system}>
                {system}
              </option>
            ))}
          </select>
          <select name="task" defaultValue={filters.task} className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <option value="">All tasks</option>
            {options.tasks.map((task) => (
              <option key={task} value={task}>
                {task}
              </option>
            ))}
          </select>
          <select name="symptom" defaultValue={filters.symptom} className="rounded-md border border-slate-700 bg-slate-900 p-3">
            <option value="">All symptoms</option>
            {options.symptoms.map((symptom) => (
              <option key={symptom} value={symptom}>
                {symptom}
              </option>
            ))}
          </select>
          <button className="rounded-md bg-emerald-500 px-4 py-3 font-semibold text-slate-950">Search records</button>
        </form>
      </section>
      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Search results</h3>
        <div className="mt-3 space-y-2">
          {results.map((record) => (
            <article key={record.id} className="rounded bg-slate-900 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Link href={`/knowledge-records/${record.id}`} className="font-medium hover:text-emerald-300">
                    {record.title}
                  </Link>
                  <p className="text-sm text-slate-400">{record.context.asset} • {record.context.task} • {record.context.symptom}</p>
                </div>
                <StatusBadge state={record.approvalState} />
              </div>
              {record.approvalState === 'APPROVED' && (
                <p className="mt-2 text-xs font-semibold text-emerald-300">Trusted approved content</p>
              )}
            </article>
          ))}
          {!results.length && <p className="rounded bg-slate-900 p-3 text-sm text-slate-300">No records matched current filters.</p>}
        </div>
      </section>
    </div>
  );
}
