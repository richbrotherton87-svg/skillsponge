import Link from 'next/link';
import { StatusBadge } from '@/components/ui/status-badge';
import { KnowledgeRecord } from '@/lib/domain';
import { getTypeLabel } from '@/lib/knowledge-service';

export function KnowledgeRecordsList({ records }: { records: KnowledgeRecord[] }) {
  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Knowledge records</h3>
        <Link href="/capture-knowledge" className="rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">
          Capture knowledge
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-slate-400">
            <tr>
              <th className="pb-2">Title</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Asset</th>
              <th className="pb-2">Task</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-slate-800">
                <td className="py-3 pr-4">
                  <Link href={`/knowledge-records/${record.id}`} className="font-medium hover:text-emerald-300">
                    {record.title}
                  </Link>
                </td>
                <td className="py-3 pr-4">{getTypeLabel(record.type)}</td>
                <td className="py-3 pr-4">{record.context.asset}</td>
                <td className="py-3 pr-4">{record.context.task}</td>
                <td className="py-3"><StatusBadge state={record.approvalState} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
