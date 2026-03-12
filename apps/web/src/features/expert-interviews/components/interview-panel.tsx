import Link from 'next/link';
import { ExpertInterviewRecord } from '@/lib/domain';

export function InterviewPanel({ records }: { records: ExpertInterviewRecord[] }) {
  return (
    <div className="space-y-4">
      {records.map((interview) => (
        <article key={interview.id} className="space-y-3 panel p-4">
          <div>
            <Link href={`/knowledge-records/${interview.id}`} className="text-lg font-semibold hover:text-emerald-300">
              {interview.title}
            </Link>
            <p className="mt-1 text-sm text-slate-400">Expert: {interview.expertName} • Asset: {interview.context.asset}</p>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="rounded bg-slate-900 p-3"><strong>Novice misses:</strong> {interview.answers.whatNoviceMisses}</li>
            <li className="rounded bg-slate-900 p-3"><strong>Top danger signs:</strong> {interview.answers.topThreeDangerSigns}</li>
          </ul>
        </article>
      ))}
      {!records.length && <div className="panel p-4 text-sm text-slate-300">No expert interviews captured yet.</div>}
    </div>
  );
}
