import { createKnowledgeRecordAction } from '@/app/(app)/actions';
import { ExpertProfile, HandoverPack } from '@/lib/domain';

export function CaptureWorkbench({ expertProfiles, handoverPacks }: { expertProfiles: ExpertProfile[]; handoverPacks: HandoverPack[] }) {
  return (
    <form action={createKnowledgeRecordAction} className="space-y-4">
      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Capture knowledge</h3>
        <p className="mt-1 text-sm text-slate-400">Create a new field record. This saves immediately and enters the review workflow.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block text-slate-300">Title</span>
            <input name="title" required className="w-full rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="Clear, specific record title" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-300">Type</span>
            <select name="type" defaultValue="FIELD_NOTE" className="w-full rounded-md border border-slate-700 bg-slate-900 p-3">
              <option value="FIELD_NOTE">Field Note</option>
              <option value="PROCEDURE">Procedure</option>
              <option value="FAILURE_PATTERN">Failure Pattern</option>
              <option value="LESSON_LEARNED">Lesson Learned</option>
            </select>
          </label>
        </div>
      </section>

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Context tags</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input name="asset" required className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="Asset / machine" />
          <input name="system" required className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="System / subsystem" />
          <input name="task" required className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="Task" />
          <input name="symptom" required className="rounded-md border border-slate-700 bg-slate-900 p-3" placeholder="Symptom / fault" />
          <input name="environment" required className="rounded-md border border-slate-700 bg-slate-900 p-3 md:col-span-2" placeholder="Environment / site" />
          <input name="tags" className="rounded-md border border-slate-700 bg-slate-900 p-3 md:col-span-2" placeholder="Tags (comma separated)" />
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-slate-300">Source expert (optional)</span>
            <select name="sourceExpertId" defaultValue="" className="w-full rounded-md border border-slate-700 bg-slate-900 p-3">
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
            <select name="handoverPackId" defaultValue="" className="w-full rounded-md border border-slate-700 bg-slate-900 p-3">
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
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-slate-300">Confidence</span>
            <select name="confidence" defaultValue="MEDIUM" className="w-full rounded-md border border-slate-700 bg-slate-900 p-3">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block text-slate-300">Content / body</span>
            <textarea
              name="body"
              required
              rows={8}
              className="w-full rounded-md border border-slate-700 bg-slate-900 p-3"
              placeholder="Describe the observation, method, pattern, or lesson in plain language."
            />
          </label>
        </div>
      </section>

      <button className="w-full rounded-md bg-emerald-500 px-4 py-4 text-base font-semibold text-slate-950">Save record</button>
    </form>
  );
}
