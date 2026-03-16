import { notFound } from 'next/navigation';
import { requireAnyRole } from '@/lib/authz';
import { getJobLogById, verifyJobLogIntegrity, listJobLogAuditEvents } from '@/lib/job-log-service';
import { JobLogWorkspace } from '@/features/job-logs/components/job-log-workspace';

export default async function JobLogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR', 'REVIEWER', 'ADMIN']);
  const { id } = await params;

  const [jobLog, integrityValid, auditEvents] = await Promise.all([
    getJobLogById(id),
    verifyJobLogIntegrity(id),
    listJobLogAuditEvents(id)
  ]);

  if (!jobLog) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  return (
    <JobLogWorkspace
      jobLog={jobLog}
      integrityValid={integrityValid}
      auditEvents={auditEvents}
      baseUrl={baseUrl}
      actorRole={actor.role}
    />
  );
}
