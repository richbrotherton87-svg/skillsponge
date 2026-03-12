import { loginAction } from './actions';

interface LoginPageProps {
  searchParams?: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const hasError = resolvedSearchParams?.error === 'CredentialsSignin';

  return (
    <main className="min-h-screen bg-app-bg p-4 text-slate-100">
      <div className="mx-auto mt-20 max-w-md panel p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-amber-300">Field Access</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Operational Memory Login</h1>
        <p className="mt-2 text-base text-slate-300">Sign in to capture, review, and retrieve engineering knowledge.</p>

        {hasError && <p className="mt-3 rounded bg-rose-900/30 p-2 text-sm text-rose-300">Invalid username or password.</p>}

        <form action={loginAction} className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-200">Username</span>
            <input name="username" required className="w-full rounded border border-slate-600 bg-slate-950 p-3" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-slate-200">Password</span>
            <input name="password" type="password" required className="w-full rounded border border-slate-600 bg-slate-950 p-3" />
          </label>
          <button className="w-full rounded bg-amber-300 py-3 text-base font-bold text-slate-950 hover:bg-amber-200">Sign in</button>
        </form>
        <p className="mt-3 text-xs text-slate-500">Seed user example: supervisor / supervisor123</p>
      </div>
    </main>
  );
}
