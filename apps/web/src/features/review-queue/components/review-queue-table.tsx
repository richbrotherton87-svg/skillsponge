import Link from 'next/link';
import { addReviewCommentAction, updateKnowledgeStatusAction } from '@/app/(app)/actions';
import { KnowledgeRecord, UserRole } from '@/lib/domain';
import { getTypeLabel } from '@/lib/knowledge-service';
import { getReviewQueueLabel, ReviewQueueContext } from '@/lib/review-queue-label';

export function ReviewQueueTable({
  records,
  actorRole,
  reviewContextByRecordId
}: {
  records: KnowledgeRecord[];
  actorRole: UserRole;
  reviewContextByRecordId: Record<string, ReviewQueueContext>;
}) {
  const isSupervisor = actorRole === 'SUPERVISOR';
  const isReviewerOrAdmin = actorRole === 'REVIEWER' || actorRole === 'ADMIN';

  return (
    <section className="panel p-4">
      <h3 className="text-lg font-semibold">Items awaiting review</h3>
      <ul className="mt-3 space-y-2">
        {records.map((record) => {
          const context = reviewContextByRecordId[record.id];
          return (
            <li key={record.id} className="rounded bg-slate-900 p-3">
              <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">{getReviewQueueLabel(context)}</p>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Link href={`/knowledge-records/${record.id}`} className="font-medium hover:text-emerald-300">
                    {record.title}
                  </Link>
                  <p className="text-sm text-slate-400">{getTypeLabel(record.type)} • {record.context.asset} • {record.author}</p>
                  {context?.latestReviewerRationale && <p className="mt-1 text-xs text-amber-300">Latest requested changes: {context.latestReviewerRationale}</p>}
                  {context?.openCommentCount ? (
                    <p className="mt-1 text-xs text-slate-300">
                      Open section comments: {context.openCommentCount}
                      {context.openCommentSections?.length ? ` (${context.openCommentSections.join(', ')})` : ''}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  {isSupervisor && record.approvalState === 'DRAFT' && (
                    <form action={updateKnowledgeStatusAction}>
                      <input type="hidden" name="id" value={record.id} />
                      <input type="hidden" name="status" value="UNDER_REVIEW" />
                      <button className="rounded border border-slate-600 px-3 py-2 text-sm">Move to under review</button>
                    </form>
                  )}
                  {isReviewerOrAdmin && record.approvalState === 'UNDER_REVIEW' && (
                    <div className="grid gap-2 md:grid-cols-2">
                      <form action={updateKnowledgeStatusAction} className="space-y-2 rounded border border-slate-700 p-2">
                        <input type="hidden" name="id" value={record.id} />
                        <input type="hidden" name="decision" value="APPROVE" />
                        <input
                          name="reviewerRationale"
                          className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                          placeholder="Optional approval rationale"
                        />
                        <button className="w-full rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">Approve</button>
                      </form>
                      <form action={updateKnowledgeStatusAction} className="space-y-2 rounded border border-amber-700 p-2">
                        <input type="hidden" name="id" value={record.id} />
                        <input type="hidden" name="decision" value="REQUEST_CHANGES" />
                        <select
                          name="commentSection"
                          className="w-full rounded border border-amber-700 bg-slate-950 px-2 py-1 text-xs"
                          defaultValue="BODY"
                        >
                          <option value="BODY">Body</option>
                          <option value="TITLE">Title</option>
                          <option value="TAXONOMY">Taxonomy</option>
                          <option value="TAGS">Tags</option>
                          <option value="CONFIDENCE">Confidence</option>
                          <option value="TYPE_PAYLOAD">Type-specific payload</option>
                        </select>
                        <textarea
                          name="commentText"
                          rows={2}
                          className="w-full rounded border border-amber-700 bg-slate-950 px-2 py-1 text-xs"
                          placeholder="Optional section comment"
                        />
                        <textarea
                          name="reviewerRationale"
                          required
                          rows={2}
                          className="w-full rounded border border-amber-700 bg-slate-950 px-2 py-1 text-xs"
                          placeholder="Required: what must be changed"
                        />
                        <button className="w-full rounded border border-amber-600 px-3 py-2 text-sm text-amber-300">Request changes</button>
                      </form>
                    </div>
                  )}
                  {isReviewerOrAdmin && record.approvalState === 'UNDER_REVIEW' && (
                    <form action={addReviewCommentAction} className="space-y-2 rounded border border-slate-700 p-2">
                      <input type="hidden" name="id" value={record.id} />
                      <select name="commentSection" defaultValue="BODY" className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs">
                        <option value="BODY">Body</option>
                        <option value="TITLE">Title</option>
                        <option value="TAXONOMY">Taxonomy</option>
                        <option value="TAGS">Tags</option>
                        <option value="CONFIDENCE">Confidence</option>
                        <option value="TYPE_PAYLOAD">Type-specific payload</option>
                      </select>
                      <textarea
                        name="commentText"
                        required
                        rows={2}
                        className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs"
                        placeholder="Add section comment without decision"
                      />
                      <button className="w-full rounded border border-slate-600 px-3 py-2 text-sm">Add comment</button>
                    </form>
                  )}
                  {isReviewerOrAdmin && (
                    <form action={updateKnowledgeStatusAction}>
                      <input type="hidden" name="id" value={record.id} />
                      <input type="hidden" name="status" value="ARCHIVED" />
                      <button className="rounded border border-rose-700 px-3 py-2 text-sm text-rose-300">Archive</button>
                    </form>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        {!records.length && <li className="rounded bg-slate-900 p-3 text-sm text-slate-300">No draft or under-review records.</li>}
      </ul>
    </section>
  );
}
