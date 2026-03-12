import { RiskHotspot } from '@/lib/domain';

export function RiskHotspots({ hotspots }: { hotspots: RiskHotspot[] }) {
  return (
    <section className="panel p-4">
      <h3 className="text-lg font-semibold">Knowledge risk hotspots</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {hotspots.map((row) => (
          <li key={row.key} className="flex items-center justify-between rounded bg-slate-900 p-3">
            <span>{row.asset} / {row.task}</span>
            <span className="text-slate-300">Risk {row.riskScore} • {row.reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
