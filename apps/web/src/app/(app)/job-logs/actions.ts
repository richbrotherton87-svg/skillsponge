'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAnyRole } from '@/lib/authz';
import {
  createJobLog,
  addJobLogEntry,
  submitJobLogForReview,
  applyJobLogReview,
  closeJobLog
} from '@/lib/job-log-service';
import type { JobLogEntryType } from '@/lib/job-log-domain';

function revalidateJobLogPaths(jobLogId?: string) {
  revalidatePath('/job-logs');
  revalidatePath('/dashboard');
  if (jobLogId) revalidatePath(`/job-logs/${jobLogId}`);
}

export async function createJobLogAction(formData: FormData) {
  const actor = await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR']);

  const created = await createJobLog(
    {
      customerName: String(formData.get('customerName') ?? '').trim(),
      siteName: String(formData.get('siteName') ?? '').trim(),
      siteAddress: String(formData.get('siteAddress') ?? '').trim() || undefined,
      siteContactName: String(formData.get('siteContactName') ?? '').trim(),
      siteContactPhone: String(formData.get('siteContactPhone') ?? '').trim() || undefined,
      siteContactEmail: String(formData.get('siteContactEmail') ?? '').trim() || undefined,
      asset: String(formData.get('asset') ?? '').trim(),
      assetSerial: String(formData.get('assetSerial') ?? '').trim() || undefined,
      assetLocation: String(formData.get('assetLocation') ?? '').trim() || undefined,
      technicianId: actor.id,
      technicianName: actor.name
    },
    { actorUserId: actor.id, actorName: actor.name, actorRole: actor.role }
  );

  revalidateJobLogPaths();
  redirect(`/job-logs/${created.id}?created=1`);
}

export async function addJobLogEntryAction(formData: FormData) {
  const actor = await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR']);
  const jobLogId = String(formData.get('jobLogId') ?? '').trim();
  const entryType = (String(formData.get('entryType') ?? 'NOTE').trim()) as JobLogEntryType;
  const content = String(formData.get('content') ?? '').trim();
  const isVoiceInput = formData.get('isVoiceInput') === 'true';

  if (!jobLogId || !content) return;

  await addJobLogEntry(
    { jobLogId, entryType, content, isVoiceInput, authorName: actor.name },
    { actorUserId: actor.id, actorName: actor.name, actorRole: actor.role }
  );

  revalidateJobLogPaths(jobLogId);
}

export async function submitJobLogAction(formData: FormData) {
  const actor = await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR']);
  const jobLogId = String(formData.get('jobLogId') ?? '').trim();
  if (!jobLogId) return;

  await submitJobLogForReview(jobLogId, {
    actorUserId: actor.id,
    actorName: actor.name,
    actorRole: actor.role
  });

  revalidateJobLogPaths(jobLogId);
  redirect('/job-logs?submitted=1');
}

export async function reviewJobLogAction(formData: FormData) {
  const actor = await requireAnyRole(['REVIEWER', 'SUPERVISOR', 'ADMIN']);
  const jobLogId = String(formData.get('jobLogId') ?? '').trim();
  const decision = String(formData.get('decision') ?? '').trim() as 'APPROVE' | 'REQUEST_CHANGES';
  const reviewNotes = String(formData.get('reviewNotes') ?? '').trim() || undefined;

  if (!jobLogId || !decision) return;

  await applyJobLogReview({
    jobLogId,
    reviewerName: actor.name,
    reviewNotes,
    decision,
    actorUserId: actor.id,
    actorRole: actor.role
  });

  revalidateJobLogPaths(jobLogId);
  redirect(`/job-logs/${jobLogId}?reviewed=1`);
}

export async function closeJobLogAction(formData: FormData) {
  const actor = await requireAnyRole(['SUPERVISOR', 'ADMIN']);
  const jobLogId = String(formData.get('jobLogId') ?? '').trim();
  if (!jobLogId) return;

  await closeJobLog(jobLogId, {
    actorUserId: actor.id,
    actorName: actor.name,
    actorRole: actor.role
  });

  revalidateJobLogPaths(jobLogId);
  redirect(`/job-logs/${jobLogId}?closed=1`);
}
