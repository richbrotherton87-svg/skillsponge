import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RecordDetail } from '@/features/knowledge-records/components/record-detail';
import {
  getKnowledgeRecordById,
  getLatestUnresolvedReviewComment,
  getRelatedRecords,
  listAuditEvents,
  listRecordVersions,
  listReviewComments
} from '@/lib/knowledge-service';
import { requireAnyRole } from '@/lib/authz';

interface RecordDetailPageProps {
  params: Promise<{ recordId: string }>;
  searchParams?: Promise<{ created?: string; updated?: string }>;
}

export default async function RecordDetailPage({ params, searchParams }: RecordDetailPageProps) {
  const actor = await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR', 'REVIEWER', 'ADMIN']);
  const { recordId } = await params;
  const query = (await searchParams) ?? {};
  const record = await getKnowledgeRecordById(recordId);

  if (!record) {
    notFound();
  }

  const [related, auditEvents, versions, unresolvedReviewComment, reviewComments] = await Promise.all([
    getRelatedRecords(record),
    listAuditEvents(record.id),
    listRecordVersions(record.id),
    getLatestUnresolvedReviewComment(record.id),
    listReviewComments(record.id)
  ]);

  return (
    <div className="space-y-4">
      {query.created === '1' && (
        <div className="panel border-emerald-700 bg-emerald-900/20 p-3 text-sm text-emerald-300">
          Record saved successfully. It is currently in draft status.
        </div>
      )}
      {query.updated === '1' && (
        <div className="panel border-amber-700 bg-amber-900/20 p-3 text-sm text-amber-300">
          Record updated. A new version was created and review status was recalculated.
        </div>
      )}
      <Link href="/knowledge-records" className="inline-block text-sm text-slate-300 hover:text-emerald-300">
        Back to records
      </Link>
      <Link href={`/knowledge-records/${record.id}/edit`} className="inline-block rounded border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800">
        Edit record
      </Link>
      <RecordDetail
        record={record}
        related={related}
        auditEvents={auditEvents}
        versions={versions}
        unresolvedReviewComment={unresolvedReviewComment}
        reviewComments={reviewComments}
        actorRole={actor.role}
      />
    </div>
  );
}
