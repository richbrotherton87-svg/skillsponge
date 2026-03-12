export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-5 rounded-xl border border-slate-700 bg-slate-950/45 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.14em] text-amber-300/90">Workboard</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-50">{title}</h2>
      <p className="mt-2 max-w-3xl text-base text-slate-200">{description}</p>
    </header>
  );
}
