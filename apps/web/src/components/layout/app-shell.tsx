import Link from 'next/link';
import { ReactNode } from 'react';
import { logoutAction } from '@/app/login/actions';
import { AuthActor } from '@/lib/authz';
import { getNavForRole } from '@/lib/roles';

export function AppShell({ children, actor }: { children: ReactNode; actor: AuthActor }) {
  const items = getNavForRole(actor.role);
  const canCapture = items.some((item) => item.href === '/capture-knowledge');

  return (
    <div className="min-h-screen bg-app-bg text-slate-100">
      <header className="border-b border-slate-700/70 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-amber-300/90">Knowledge Continuity Platform</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-50">Operational Memory</h1>
              <p className="mt-1 text-sm text-slate-300">Built for field teams to capture and trust hard-won engineering knowledge.</p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-right">
              <p className="text-sm font-semibold text-slate-100">{actor.name}</p>
              <p className="mt-1 inline-flex rounded bg-slate-800 px-2 py-1 text-[11px] uppercase tracking-wide text-slate-300">
                {actor.role.replace('_', ' ')}
              </p>
              <form action={logoutAction} className="mt-2">
                <button className="rounded border border-slate-500 px-3 py-1.5 text-xs font-semibold hover:bg-slate-800">Sign out</button>
              </form>
            </div>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-amber-300/60 hover:text-amber-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 pb-4">
          {canCapture && (
            <Link
              href="/capture-knowledge"
              className="rounded-lg bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
            >
              Capture knowledge
            </Link>
          )}
          <Link
            href="/search?status=APPROVED"
            className="rounded-lg border border-emerald-400/70 bg-emerald-900/30 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-900/50"
          >
            Show approved method
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5">{children}</main>
    </div>
  );
}
