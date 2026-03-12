import { PageHeader } from '@/components/ui/page-header';
import { ContinuityRiskBoard } from '@/features/dashboard/components/continuity-risk-board';
import { DashboardOverview } from '@/features/dashboard/components/dashboard-overview';
import { RiskHotspots } from '@/features/dashboard/components/risk-hotspots';
import { buildContinuityRiskRows } from '@/lib/continuity-risk';
import { getDashboardMetrics, getRiskHotspots, listExpertProfiles, listHandoverPacks, listKnowledgeRecords } from '@/lib/knowledge-service';

import { requireAnyRole } from '@/lib/authz';

export default async function DashboardPage() {
  const actor = await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR', 'REVIEWER', 'ADMIN']);
  const [metrics, allRecords, hotspots, expertProfiles, handoverPacks] = await Promise.all([
    getDashboardMetrics(),
    listKnowledgeRecords(),
    getRiskHotspots(5),
    listExpertProfiles(),
    listHandoverPacks()
  ]);
  const recentRecords = allRecords.slice(0, 5);
  const showManagementRisk = actor.role === 'SUPERVISOR' || actor.role === 'REVIEWER' || actor.role === 'ADMIN';
  const continuityRows = showManagementRisk ? buildContinuityRiskRows(expertProfiles, handoverPacks, allRecords).slice(0, 6) : [];

  return (
    <div className="space-y-4">
      <PageHeader title="Dashboard" description="Role-aware overview of knowledge health, review backlog, and risk hotspots." />
      <DashboardOverview metrics={metrics} recentRecords={recentRecords} />
      {showManagementRisk && <ContinuityRiskBoard rows={continuityRows} />}
      <RiskHotspots hotspots={hotspots} />
    </div>
  );
}
