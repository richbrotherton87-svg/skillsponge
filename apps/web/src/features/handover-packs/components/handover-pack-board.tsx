import {
  createExpertProfileAction,
  createHandoverPackAction,
  updateHandoverTaskStatusAction
} from '@/app/(app)/actions';
import { ExpertProfile, HandoverPack } from '@/lib/domain';

export function HandoverPackBoard({
  expertProfiles,
  handoverPacks
}: {
  expertProfiles: ExpertProfile[];
  handoverPacks: HandoverPack[];
}) {
  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-2">
        <form action={createExpertProfileAction} className="panel p-4 space-y-2">
          <h3 className="text-lg font-semibold">Add Expert Profile</h3>
          <input name="name" required className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm" placeholder="Expert name" />
          <input name="roleFocus" required className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm" placeholder="Role focus" />
          <input name="domains" className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm" placeholder="Domains (comma separated)" />
          <input name="assets" className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm" placeholder="Assets (comma separated)" />
          <div className="grid gap-2 sm:grid-cols-3">
            <input name="yearsExperience" type="number" min={0} className="rounded border border-slate-700 bg-slate-900 p-2 text-sm" placeholder="Years" />
            <select name="riskLevel" defaultValue="MEDIUM" className="rounded border border-slate-700 bg-slate-900 p-2 text-sm">
              <option value="LOW">Low risk</option>
              <option value="MEDIUM">Medium risk</option>
              <option value="HIGH">High risk</option>
            </select>
            <input name="retirementWindowEnd" type="date" className="rounded border border-slate-700 bg-slate-900 p-2 text-sm" />
          </div>
          <textarea name="notes" rows={2} className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm" placeholder="Notes" />
          <button className="rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">Create profile</button>
        </form>

        <form action={createHandoverPackAction} className="panel p-4 space-y-2">
          <h3 className="text-lg font-semibold">Create Handover Pack</h3>
          <select name="expertProfileId" required className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm">
            <option value="">Select expert profile</option>
            {expertProfiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name} ({profile.riskLevel})
              </option>
            ))}
          </select>
          <input name="targetRole" required className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm" placeholder="Target role" />
          <input name="targetDate" type="date" className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm" />
          <textarea
            name="taskTitles"
            rows={3}
            className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-sm"
            placeholder="Task titles (comma separated)"
          />
          <button className="rounded bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950">Create handover pack</button>
        </form>
      </section>

      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Handover Packs</h3>
        <ul className="mt-3 space-y-3">
          {handoverPacks.map((pack) => (
            <li key={pack.id} className="rounded bg-slate-900 p-3">
              <p className="font-medium">
                {pack.expertName}
                {' -> '}
                {pack.targetRole}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Status: {pack.status.replaceAll('_', ' ')} • Coverage: {pack.coverageScore}% • Validated tasks: {pack.validatedCount}
              </p>
              <ul className="mt-2 space-y-2">
                {pack.tasks.map((task) => (
                  <li key={task.id} className="rounded bg-slate-950 p-2">
                    <p className="text-sm">{task.title}</p>
                    <form action={updateHandoverTaskStatusAction} className="mt-2 flex flex-wrap items-center gap-2">
                      <input type="hidden" name="handoverPackId" value={pack.id} />
                      <input type="hidden" name="taskId" value={task.id} />
                      <input name="assigneeName" defaultValue={task.assigneeName} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs" placeholder="Assignee" />
                      <select name="status" defaultValue={task.status} className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs">
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In progress</option>
                        <option value="DONE">Done</option>
                      </select>
                      <button className="rounded border border-slate-600 px-2 py-1 text-xs">Update task</button>
                    </form>
                  </li>
                ))}
              </ul>
            </li>
          ))}
          {!handoverPacks.length && <li className="rounded bg-slate-900 p-3 text-sm text-slate-300">No handover packs yet.</li>}
        </ul>
      </section>
    </div>
  );
}
