import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { KnowledgeRecordsList } from '@/features/knowledge-records/components/knowledge-records-list';
import { listKnowledgeRecords } from '@/lib/knowledge-service';
import { requireAnyRole } from '@/lib/authz';

interface KnowledgeRecordsPageProps {
  searchParams?: Promise<{ created?: string }>;
}

export default async function KnowledgeRecordsPage({ searchParams }: KnowledgeRecordsPageProps) {
  await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR', 'REVIEWER', 'ADMIN']);
  const params = (await searchParams) ?? {};
  const records = await listKnowledgeRecords();

  return (
    <div>
      <PageHeader title="Knowledge Records" description="Browse procedures, field notes, failure patterns, interviews, and shadowing records." />
      {params.created === '1' && (
        <div className="panel mb-4 border-emerald-700 bg-emerald-900/20 p-3 text-sm text-emerald-300">
          Record created successfully. <Link href="/review-queue" className="underline">Open review queue</Link>
        </div>
      )}
      <KnowledgeRecordsList records={records} />
    </div>
  );
}
