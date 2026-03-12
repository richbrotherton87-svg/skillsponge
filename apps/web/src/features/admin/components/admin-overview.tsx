export function AdminOverview() {
  return (
    <div className="space-y-4">
      <section className="panel p-4">
        <h3 className="text-lg font-semibold">Administration</h3>
        <p className="mt-1 text-sm text-slate-400">Manage roles, taxonomy terms, and governance settings for the MVP.</p>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Role assignments</p>
          <p className="mt-1 font-semibold">14 active users</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Taxonomy coverage</p>
          <p className="mt-1 font-semibold">Assets 22 • Tasks 37 • Symptoms 46</p>
        </article>
        <article className="panel p-4">
          <p className="text-sm text-slate-400">Audit health</p>
          <p className="mt-1 font-semibold">No policy violations</p>
        </article>
      </section>
    </div>
  );
}
