'use client';

import { useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  Hash,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  Phone,
  QrCode,
  Send,
  ShieldCheck,
  Upload,
  User
} from 'lucide-react';
import { addJobLogEntryAction, submitJobLogAction } from '@/app/(app)/job-logs/actions';
import { VoiceRecorder } from './voice-recorder';
import { PhotoUploadButton } from './photo-upload-button';
import { QRCodeDisplay } from './qr-code-display';
import type { JobLog, JobLogAuditEvent, JobLogEntryType, JobLogStatus } from '@/lib/job-log-domain';
import type { UserRole } from '@/lib/domain';

const statusColors: Record<JobLogStatus, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-amber-100 text-amber-800',
  SUBMITTED: 'bg-purple-100 text-purple-800',
  REVIEWED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-slate-100 text-slate-600'
};

const entryTypeLabels: Record<JobLogEntryType, string> = {
  NOTE: 'Note',
  VOICE_TRANSCRIPTION: 'Voice',
  OBSERVATION: 'Observation',
  ACTION_TAKEN: 'Action Taken',
  ISSUE_FOUND: 'Issue Found'
};

const entryTypeColors: Record<JobLogEntryType, string> = {
  NOTE: 'bg-slate-100 text-slate-700',
  VOICE_TRANSCRIPTION: 'bg-indigo-100 text-indigo-700',
  OBSERVATION: 'bg-blue-100 text-blue-700',
  ACTION_TAKEN: 'bg-green-100 text-green-700',
  ISSUE_FOUND: 'bg-red-100 text-red-700'
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

interface WorkspaceProps {
  jobLog: JobLog;
  integrityValid: boolean;
  auditEvents: JobLogAuditEvent[];
  baseUrl: string;
  actorRole: UserRole;
}

export function JobLogWorkspace({ jobLog, integrityValid, auditEvents, baseUrl, actorRole }: WorkspaceProps) {
  const [entryType, setEntryType] = useState<JobLogEntryType>('NOTE');
  const [content, setContent] = useState('');
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const isEditable = jobLog.status === 'OPEN' || jobLog.status === 'IN_PROGRESS';
  const canSubmit = jobLog.status === 'IN_PROGRESS' && jobLog.entries.length > 0;
  const canReview = jobLog.status === 'SUBMITTED' && ['REVIEWER', 'SUPERVISOR', 'ADMIN'].includes(actorRole);

  function handleVoiceTranscript(transcript: string) {
    setContent((prev) => (prev ? `${prev}\n${transcript}` : transcript));
    setIsVoiceInput(true);
    setEntryType('VOICE_TRANSCRIPTION');
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-900">{jobLog.jobReference}</h1>
            <Badge className={`text-xs ${statusColors[jobLog.status]}`}>
              {jobLog.status.replace('_', ' ')}
            </Badge>
            {integrityValid ? (
              <span className="flex items-center gap-1 text-xs text-green-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-red-600">
                <ShieldCheck className="h-3.5 w-3.5" /> Integrity Warning
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {jobLog.customerName} — {jobLog.siteName} — {jobLog.asset}
          </p>
        </div>
        <div className="flex gap-2">
          {canReview && (
            <Button asChild variant="industrial">
              <a href={`/job-logs/${jobLog.id}/review`}>Review</a>
            </Button>
          )}
          {canSubmit && (
            <form action={submitJobLogAction}>
              <input type="hidden" name="jobLogId" value={jobLog.id} />
              <Button type="submit" variant="industrial">
                <Send className="h-4 w-4" />
                Submit to Office
              </Button>
            </form>
          )}
        </div>
      </div>

      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Notes ({jobLog.entries.length})
          </TabsTrigger>
          <TabsTrigger value="photos">
            <Camera className="mr-1.5 h-3.5 w-3.5" />
            Photos ({jobLog.photos.length})
          </TabsTrigger>
          <TabsTrigger value="details">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Details
          </TabsTrigger>
          <TabsTrigger value="qr">
            <QrCode className="mr-1.5 h-3.5 w-3.5" />
            QR Code
          </TabsTrigger>
        </TabsList>

        {/* Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          {/* Entries timeline */}
          <div className="space-y-3">
            {jobLog.entries.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">No entries yet. Add your first note below.</p>
            )}
            {jobLog.entries.map((entry) => (
              <div key={entry.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge className={`text-[10px] ${entryTypeColors[entry.entryType]}`}>
                      {entryTypeLabels[entry.entryType]}
                    </Badge>
                    {entry.isVoiceInput && <Mic className="h-3 w-3 text-indigo-500" />}
                    <span className="text-xs text-slate-400">
                      {formatTime(entry.createdAt)} — {entry.authorName}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{entry.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add entry form */}
          {isEditable && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Add Entry</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  ref={formRef}
                  action={async (formData) => {
                    await addJobLogEntryAction(formData);
                    setContent('');
                    setIsVoiceInput(false);
                  }}
                  className="space-y-3"
                >
                  <input type="hidden" name="jobLogId" value={jobLog.id} />
                  <input type="hidden" name="isVoiceInput" value={String(isVoiceInput)} />

                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(entryTypeLabels) as JobLogEntryType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setEntryType(type); setIsVoiceInput(false); }}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          entryType === type ? entryTypeColors[type] : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {entryTypeLabels[type]}
                      </button>
                    ))}
                  </div>

                  <input type="hidden" name="entryType" value={entryType} />

                  <div className="relative">
                    <Textarea
                      name="content"
                      value={content}
                      onChange={(e) => { setContent(e.target.value); setIsVoiceInput(false); }}
                      placeholder="Type your note or use the microphone..."
                      rows={3}
                      required
                    />
                    <div className="absolute bottom-2 right-2">
                      <VoiceRecorder onTranscript={handleVoiceTranscript} />
                    </div>
                  </div>

                  <Button type="submit" size="sm" disabled={!content.trim()}>
                    Add Entry
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          {isEditable && <PhotoUploadButton jobLogId={jobLog.id} />}
          {jobLog.photos.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {jobLog.photos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg border border-slate-200">
                  <img
                    src={`/api/uploads/${photo.storageKey}`}
                    alt={photo.caption || photo.fileName}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5">
                    <p className="truncate text-xs text-white">{photo.caption || photo.fileName}</p>
                    <p className="text-[10px] text-white/70">{formatTime(photo.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{jobLog.customerName}</p>
                <p className="text-slate-500">{jobLog.siteName}</p>
                {jobLog.siteAddress && <p className="flex items-center gap-1 text-slate-500"><MapPin className="h-3 w-3" /> {jobLog.siteAddress}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" /> Site Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{jobLog.siteContactName}</p>
                {jobLog.siteContactPhone && <p className="text-slate-500">{jobLog.siteContactPhone}</p>}
                {jobLog.siteContactEmail && <p className="text-slate-500">{jobLog.siteContactEmail}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4" /> Asset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p className="font-medium">{jobLog.asset}</p>
                {jobLog.assetSerial && <p className="text-slate-500">S/N: {jobLog.assetSerial}</p>}
                {jobLog.assetLocation && <p className="text-slate-500">Location: {jobLog.assetLocation}</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" /> Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p>Started: <span className="font-medium">{formatDate(jobLog.startedAt)}</span></p>
                {jobLog.submittedAt && <p>Submitted: <span className="font-medium">{formatDate(jobLog.submittedAt)}</span></p>}
                {jobLog.reviewedAt && <p>Reviewed: <span className="font-medium">{formatDate(jobLog.reviewedAt)}</span></p>}
                {jobLog.completedAt && <p>Closed: <span className="font-medium">{formatDate(jobLog.completedAt)}</span></p>}
                <p className="mt-2 text-xs text-slate-400">Technician: {jobLog.technicianName}</p>
              </CardContent>
            </Card>
          </div>

          {/* Audit trail */}
          {auditEvents.length > 0 && (
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-2 text-xs text-slate-500">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      <span className="font-medium text-slate-700">{event.eventType.replace(/_/g, ' ')}</span>
                      <span>by {event.actorName}</span>
                      <span className="ml-auto">{formatDate(event.createdAt)} {formatTime(event.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* QR Code Tab */}
        <TabsContent value="qr">
          <QRCodeDisplay
            url={`${baseUrl}/job-logs/${jobLog.id}`}
            hash={jobLog.codeHash}
            reference={jobLog.jobReference}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
