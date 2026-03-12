import { updateKnowledgeRecordAction } from '@/app/(app)/actions';
import { ExpertProfile, HandoverPack, KnowledgeRecord } from '@/lib/domain';

export function EditRecordForm({
  record,
  expertProfiles,
  handoverPacks
}: {
  record: KnowledgeRecord;
  expertProfiles: ExpertProfile[];
  handoverPacks: HandoverPack[];
}) {
  const requiresApprovedEditReason = record.approvalState === 'APPROVED';

  return (
    <form action={updateKnowledgeRecordAction} className="space-y-4">
      <input type="hidden" name="id" value={record.id} />

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Edit record</h3>
        <p className="mt-1 text-sm text-slate-400">Saving creates a new version. If currently approved, it is moved to under review.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-slate-300">Title</span>
            <input name="title" defaultValue={record.title} required className="w-full rounded-md border border-slate-700 bg-slate-900 p-3" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-300">Confidence</span>
            <select name="confidence" defaultValue={record.confidence} className="w-full rounded-md border border-slate-700 bg-slate-900 p-3">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Context</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input name="asset" required defaultValue={record.context.asset} className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="Asset" />
          <input name="system" required defaultValue={record.context.system} className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="System" />
          <input name="task" required defaultValue={record.context.task} className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="Task" />
          <input name="symptom" required defaultValue={record.context.symptom} className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="Symptom" />
          <input name="environment" required defaultValue={record.context.environment} className="rounded-md border border-slate-700 bg-slate-900 p-3 md:col-span-2" placeholder="Environment" />
          <input name="tags" defaultValue={record.tags.join(', ')} className="rounded-md border border-slate-700 bg-slate-900 p-3 md:col-span-2" placeholder="Tags (comma separated)" />
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-slate-300">Source expert (optional)</span>
            <select name="sourceExpertId" defaultValue={record.sourceExpertId ?? ''} className="w-full rounded-md border border-slate-700 bg-slate-900 p-3">
              <option value="">None</option>
              {expertProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name} ({profile.roleFocus})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-slate-300">Linked handover pack (optional)</span>
            <select name="handoverPackId" defaultValue={record.handoverPackId ?? ''} className="w-full rounded-md border border-slate-700 bg-slate-900 p-3">
              <option value="">None</option>
              {handoverPacks.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.expertName}
                  {' -> '}
                  {pack.targetRole} ({pack.status.replaceAll('_', ' ')})
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="panel p-4">
        <label className="text-sm block">
          <span className="mb-1 block text-slate-300">Body</span>
          <textarea name="body" defaultValue={record.body} required rows={10} className="w-full rounded-md border border-slate-700 bg-slate-900 p-3" />
        </label>
        <label className="text-sm block mt-3">
          <span className="mb-1 block text-slate-300">Change note</span>
          <input name="changeNote" className="w-full rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="What changed and why?" />
        </label>
        {requiresApprovedEditReason && (
          <label className="text-sm block mt-3">
            <span className="mb-1 block text-slate-300">Reason for editing approved record</span>
            <input
              name="changeReason"
              required
              className="w-full rounded-md border border-amber-600 bg-slate-900 p-3"
              placeholder="Why does this approved method need to change?"
            />
          </label>
        )}
      </section>

      <button className="w-full rounded bg-emerald-500 py-3 font-semibold text-slate-950">Save new version</button>
    </form>
  );
}
