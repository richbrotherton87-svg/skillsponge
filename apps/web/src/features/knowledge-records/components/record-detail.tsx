import Link from 'next/link';
import { addReviewCommentAction, resubmitKnowledgeRecordForReviewAction } from '@/app/(app)/actions';
import { AuditEvent, KnowledgeRecord, RecordVersion, ReviewCommentThread, UnresolvedReviewComment, UserRole } from '@/lib/domain';
import { getTypeLabel } from '@/lib/knowledge-service';
import { StatusBadge } from '@/components/ui/status-badge';
import { buildVersionDiff } from '@/lib/review-diff';
import { canResubmitForReview } from '@/lib/review-resubmission-policy';
import { getUnresolvedReviewComments } from '@/lib/review-comments';

function TrustBanner({ record }: { record: KnowledgeRecord }) {
  if (record.approvalState === 'APPROVED') {
    return <p className="rounded border border-emerald-700 bg-emerald-900/30 px-3 py-2 text-sm font-semibold text-emerald-300">Approved method: trusted content for operational use.</p>;
  }

  if (record.type === 'FIELD_NOTE') {
    return <p className="rounded border border-amber-700 bg-amber-900/30 px-3 py-2 text-sm font-semibold text-amber-300">Field observation: verify before standard adoption.</p>;
  }

  return <p className="rounded border border-rose-700 bg-rose-900/20 px-3 py-2 text-sm font-semibold text-rose-300">Unreviewed content: do not treat as approved method.</p>;
}

function TypeSpecificSection({ record }: { record: KnowledgeRecord }) {
  if (record.type === 'PROCEDURE') {
    return (
      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Procedure steps</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">
          {record.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    );
  }

  if (record.type === 'FIELD_NOTE') {
    return (
      <section className="panel p-4 space-y-3 text-sm">
        <div>
          <h3 className="font-semibold">Observation</h3>
          <p className="mt-1 text-slate-300">{record.observation}</p>
        </div>
        <div>
          <h3 className="font-semibold">Immediate action</h3>
          <p className="mt-1 text-slate-300">{record.immediateAction}</p>
        </div>
      </section>
    );
  }

  if (record.type === 'FAILURE_PATTERN') {
    return (
      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Failure pattern details</h3>
        <div className="mt-3 grid gap-4 md:grid-cols-2 text-sm">
          <div>
            <h4 className="font-semibold">Pattern signals</h4>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
              {record.patternSignals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Likely causes</h4>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-slate-300">
              {record.likelyCauses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (record.type === 'EXPERT_INTERVIEW') {
    return (
      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Expert interview answers</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li className="rounded bg-slate-900 p-3"><strong>What novices miss:</strong> {record.answers.whatNoviceMisses}</li>
          <li className="rounded bg-slate-900 p-3"><strong>Top danger signs:</strong> {record.answers.topThreeDangerSigns}</li>
          <li className="rounded bg-slate-900 p-3"><strong>Similar but different fault:</strong> {record.answers.similarButDifferentFault}</li>
          <li className="rounded bg-slate-900 p-3"><strong>First check before opening:</strong> {record.answers.firstCheckBeforeOpening}</li>
          <li className="rounded bg-slate-900 p-3"><strong>Manual gap:</strong> {record.answers.whatManualMisses}</li>
        </ul>
      </section>
    );
  }

  if (record.type === 'SHADOWING_RECORD') {
    return (
      <section className="panel p-4 space-y-3 text-sm">
        <p><strong>Senior technician:</strong> {record.seniorTechnician}</p>
        <p><strong>Junior technician:</strong> {record.juniorTechnician}</p>
        <p><strong>Competency score:</strong> {record.competencyScore}/5</p>
        <p><strong>Session outcome:</strong> {record.sessionOutcome}</p>
      </section>
    );
  }

  return (
    <section className="panel p-4">
      <h3 className="text-lg font-semibold">Lesson points</h3>
      <ul className="mt-3 list-disc pl-5 space-y-2 text-sm text-slate-300">
        {record.lessonPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  );
}

export function RecordDetail({
  record,
  related,
  auditEvents,
  versions,
  unresolvedReviewComment,
  reviewComments,
  actorRole
}: {
  record: KnowledgeRecord;
  related: KnowledgeRecord[];
  auditEvents: AuditEvent[];
  versions: RecordVersion[];
  unresolvedReviewComment?: UnresolvedReviewComment;
  reviewComments: ReviewCommentThread[];
  actorRole: UserRole;
}) {
  const currentVersion = versions[0];
  const previousVersion = versions[1];
  const diff = buildVersionDiff(currentVersion, previousVersion);
  const canActorResubmit = canResubmitForReview(actorRole, record.approvalState, Boolean(unresolvedReviewComment));
  const canActorComment = (actorRole === 'REVIEWER' || actorRole === 'ADMIN') && record.approvalState === 'UNDER_REVIEW';
  const openSectionComments = getUnresolvedReviewComments(reviewComments);

  return (
    <div className="space-y-4">
      <section className="panel p-4 space-y-3">
        <TrustBanner record={record} />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{record.title}</h2>
            <p className="text-sm text-slate-300 mt-1">{record.summary}</p>
          </div>
          <StatusBadge state={record.approvalState} />
        </div>
        <div className="grid gap-2 md:grid-cols-3 text-sm">
          <p><strong>Type:</strong> {getTypeLabel(record.type)}</p>
          <p><strong>Author:</strong> {record.author}</p>
          <p><strong>Reviewer:</strong> {record.reviewer ?? 'Not assigned'}</p>
          <p><strong>Source expert:</strong> {record.sourceExpertName ?? 'None linked'}</p>
          <p><strong>Handover pack:</strong> {record.handoverPackId ?? 'None linked'}</p>
          <p><strong>Confidence:</strong> {record.confidence}</p>
          <p><strong>Created:</strong> {record.createdAt}</p>
          <p><strong>Last validated:</strong> {record.lastValidatedAt ?? 'Not validated'}</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2 text-sm border-t border-slate-800 pt-3">
          <p><strong>Asset:</strong> {record.context.asset}</p>
          <p><strong>System:</strong> {record.context.system}</p>
          <p><strong>Task:</strong> {record.context.task}</p>
          <p><strong>Symptom:</strong> {record.context.symptom}</p>
          <p className="md:col-span-2"><strong>Environment:</strong> {record.context.environment}</p>
        </div>
        <div className="text-sm">
          <p><strong>Tags:</strong> {record.tags.join(', ') || 'None'}</p>
        </div>
      </section>

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Body content</h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{record.body}</p>
      </section>

      {(unresolvedReviewComment || reviewComments.length > 0 || canActorComment) && (
        <section className="panel p-4">
          <h3 className="text-lg font-semibold">Open review comments</h3>
          {unresolvedReviewComment && (
            <p className="mt-2 text-sm text-amber-300">{unresolvedReviewComment.requestChangesEvent.metadata?.reviewerRationale ?? 'Requested changes were provided by the reviewer.'}</p>
          )}
          {openSectionComments.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {openSectionComments.map((comment) => (
                <li key={comment.id} className="rounded bg-slate-900 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{comment.section} • {comment.status}</p>
                  <p className="mt-1 text-slate-300">{comment.text}</p>
                  {comment.addressedNote && <p className="mt-1 text-xs text-slate-500">Editor note: {comment.addressedNote}</p>}
                </li>
              ))}
            </ul>
          )}
          {unresolvedReviewComment?.latestResubmissionEvent?.metadata?.editorResponseNote && (
            <p className="mt-2 text-sm text-slate-300">Latest editor response: {unresolvedReviewComment.latestResubmissionEvent.metadata.editorResponseNote}</p>
          )}
          {canActorResubmit && (
            <form action={resubmitKnowledgeRecordForReviewAction} className="mt-3 space-y-2 rounded border border-amber-700 p-3">
              <input type="hidden" name="id" value={record.id} />
              {openSectionComments.length > 0 && (
                <div className="space-y-1 rounded bg-slate-900 p-3 text-sm">
                  <p className="font-medium text-slate-200">Mark addressed comments</p>
                  {openSectionComments.map((comment) => (
                    <label key={comment.id} className="flex items-center gap-2 text-slate-300">
                      <input type="checkbox" name="addressedCommentIds" value={comment.id} />
                      <span>{comment.section}: {comment.text}</span>
                    </label>
                  ))}
                </div>
              )}
              <textarea
                name="editorResponseNote"
                rows={2}
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
                placeholder="Optional: what changed since requested changes"
              />
              <button className="rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">Resubmit for review</button>
            </form>
          )}
          {canActorComment && (
            <form action={addReviewCommentAction} className="mt-3 space-y-2 rounded border border-slate-700 p-3">
              <input type="hidden" name="id" value={record.id} />
              <select name="commentSection" defaultValue="BODY" className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm">
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
                className="w-full rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
                placeholder="Add section comment"
              />
              <button className="rounded border border-slate-600 px-3 py-2 text-sm">Add comment</button>
            </form>
          )}
        </section>
      )}

      {record.approvalState === 'UNDER_REVIEW' && (
        <section className="panel p-4">
          <h3 className="text-lg font-semibold">Review comparison (current vs previous version)</h3>
          {currentVersion && previousVersion && diff.hasChanges ? (
            <ul className="mt-3 space-y-2 text-sm">
              {diff.fields.map((field) => (
                <li key={field.label} className="rounded bg-slate-900 p-3">
                  <p className="font-medium">{field.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Before</p>
                  <p className="whitespace-pre-wrap text-slate-300">{field.before || 'None'}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-emerald-400">After</p>
                  <p className="whitespace-pre-wrap text-emerald-200">{field.after || 'None'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-300">No previous version comparison is available yet.</p>
          )}
        </section>
      )}

      <TypeSpecificSection record={record} />

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Related records</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {related.map((item) => (
            <li key={item.id} className="rounded bg-slate-900 p-3">
              <Link href={`/knowledge-records/${item.id}`} className="font-medium hover:text-emerald-300">
                {item.title}
              </Link>
              <p className="text-slate-400">{getTypeLabel(item.type)} • {item.context.asset}</p>
            </li>
          ))}
          {!related.length && <li className="rounded bg-slate-900 p-3 text-slate-300">No related records linked yet.</li>}
        </ul>
      </section>

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Audit timeline</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {auditEvents.map((event) => (
            <li key={event.id} className="rounded bg-slate-900 p-3">
              <p className="font-medium">
                {event.eventType === 'RECORD_CREATED'
                  ? 'Record created'
                  : event.eventType === 'REVIEW_DECISION'
                  ? 'Review decision'
                  : event.eventType === 'REVIEW_COMMENT_ADDED'
                  ? 'Review comment added'
                  : event.eventType === 'REVIEW_COMMENT_STATUS_CHANGED'
                  ? 'Review comment status changed'
                  : event.eventType === 'REVIEW_RESUBMITTED'
                  ? 'Review resubmitted'
                  : 'Status changed'}
              </p>
              <p className="text-slate-400">
                {event.actorName}
                {event.actorRole ? ` (${event.actorRole.replace('_', ' ')})` : ''} • {new Date(event.createdAt).toLocaleString()}
              </p>
              {(event.eventType === 'STATUS_CHANGED' || event.eventType === 'REVIEW_DECISION' || event.eventType === 'REVIEW_RESUBMITTED') && (
                <p className="text-slate-300">
                  {event.fromStatus ?? 'Unknown'}
                  {' -> '}
                  {event.toStatus ?? 'Unknown'}
                </p>
              )}
              {event.metadata?.changeReason && (
                <p className="mt-1 text-slate-300">
                  Change reason: {event.metadata.changeReason}
                </p>
              )}
              {event.metadata?.reviewDecision && (
                <p className="mt-1 text-slate-300">
                  Decision: {event.metadata.reviewDecision === 'APPROVE' ? 'Approve' : 'Request changes'}
                </p>
              )}
              {event.metadata?.reviewerRationale && (
                <p className="mt-1 text-slate-300">
                  Reviewer rationale: {event.metadata.reviewerRationale}
                </p>
              )}
              {event.metadata?.editorResponseNote && (
                <p className="mt-1 text-slate-300">
                  Editor response: {event.metadata.editorResponseNote}
                </p>
              )}
              {event.metadata?.reviewCommentSection && event.metadata?.reviewCommentText && (
                <p className="mt-1 text-slate-300">
                  Comment [{event.metadata.reviewCommentSection}]: {event.metadata.reviewCommentText}
                </p>
              )}
              {event.metadata?.reviewCommentAction && event.metadata?.reviewCommentId && (
                <p className="mt-1 text-slate-300">
                  Comment {event.metadata.reviewCommentId} marked {event.metadata.reviewCommentAction.toLowerCase()}
                </p>
              )}
            </li>
          ))}
          {!auditEvents.length && <li className="rounded bg-slate-900 p-3 text-slate-300">No audit events recorded yet.</li>}
        </ul>
      </section>

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Version history</h3>
        <ul className="mt-3 space-y-2 text-sm">
          {versions.map((version) => (
            <li key={version.id} className="rounded bg-slate-900 p-3">
              <p className="font-medium">Version {version.versionNumber}</p>
              <p className="text-slate-400">
                {version.editedBy} • {new Date(version.createdAt).toLocaleString()}
              </p>
              {version.changeNote && <p className="text-slate-300 mt-1">{version.changeNote}</p>}
              {version.changeReason && <p className="text-slate-300 mt-1">Approved edit reason: {version.changeReason}</p>}
            </li>
          ))}
          {!versions.length && <li className="rounded bg-slate-900 p-3 text-slate-300">No version history recorded yet.</li>}
        </ul>
      </section>
    </div>
  );
}
