import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString?.trim()) {
  throw new Error('DATABASE_URL is required for seeding.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
});

async function main() {
  await prisma.auditEvent.deleteMany();
  await prisma.handoverTask.deleteMany();
  await prisma.handoverPack.deleteMany();
  await prisma.expertProfile.deleteMany();
  await prisma.knowledgeRecordVersion.deleteMany();
  await prisma.knowledgeRelation.deleteMany();
  await prisma.knowledgeRecord.deleteMany();
  await prisma.appUser.deleteMany();

  const [technician, senior, supervisor, reviewer, admin] = await Promise.all([
    prisma.appUser.create({
      data: {
        username: 'technician',
        passwordHash: await bcrypt.hash('technician123', 10),
        displayName: 'Jamal Ortiz',
        role: 'TECHNICIAN'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'senior',
        passwordHash: await bcrypt.hash('senior123', 10),
        displayName: 'Maria Kline',
        role: 'SENIOR_TECHNICIAN'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'supervisor',
        passwordHash: await bcrypt.hash('supervisor123', 10),
        displayName: 'Riley Shaw',
        role: 'SUPERVISOR'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'reviewer',
        passwordHash: await bcrypt.hash('reviewer123', 10),
        displayName: 'Evan Singh',
        role: 'REVIEWER'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'admin',
        passwordHash: await bcrypt.hash('admin123', 10),
        displayName: 'Tina Collins',
        role: 'ADMIN'
      }
    })
  ]);

  await prisma.knowledgeRecord.createMany({
    data: [
      {
        id: 'kr_proc_001',
        type: 'PROCEDURE',
        title: 'Approved method: compressor hot-start pressure recovery',
        summary: 'Standard method for low pressure immediately after hot restart.',
        body: 'Use this approved sequence before opening the compressor assembly.',
        author: 'Maria Kline',
        reviewer: 'Evan Singh',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'CMP-07',
        system: 'Pneumatics',
        task: 'Hot-start diagnostics',
        symptom: 'Starts without pressure build',
        environment: 'Plant A - Bay 3',
        tags: ['approved-method', 'compressor', 'hot-start'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-02-25'),
        createdAt: new Date('2026-01-15'),
        typePayload: {
          steps: [
            'Confirm inlet valve position and line temperature.',
            'Run 45-second purge before load step.',
            'Validate check valve response under 30% load.'
          ]
        }
      },
      {
        id: 'kr_note_001',
        type: 'FIELD_NOTE',
        title: 'Field note: morning pressure oscillation in cold ambient',
        summary: 'Observed oscillation below 6C; temporary line warm-up stabilizes output.',
        body: 'Observed during first startup cycle on morning shift, ambient at 5C.',
        author: 'Jamal Ortiz',
        reviewer: 'Evan Singh',
        approvalState: 'UNDER_REVIEW',
        confidence: 'MEDIUM',
        asset: 'CMP-07',
        system: 'Pneumatics',
        task: 'Cold-start check',
        symptom: 'Fluctuating pressure at startup',
        environment: 'Outdoor skid - North side',
        tags: ['field-observation', 'cold-start'],
        currentVersion: 1,
        createdAt: new Date('2026-03-03'),
        typePayload: {
          observation: 'Pressure oscillated between 40-65 psi during first two minutes.',
          immediateAction: 'Applied external line heater for 3 minutes before restart.'
        }
      },
      {
        id: 'kr_fail_001',
        type: 'FAILURE_PATTERN',
        title: 'Failure pattern: spindle drift after thermal expansion cycle',
        summary: 'Repeat drift trend after long warm cycle on CNC-12.',
        body: 'Pattern observed across four jobs in two weeks with similar temperature envelope.',
        author: 'Maria Kline',
        reviewer: 'Evan Singh',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'CNC-12',
        system: 'Machining',
        task: 'Spindle alignment verification',
        symptom: 'Tolerance drift after warm cycle',
        environment: 'Machine shop line 2',
        tags: ['failure-pattern', 'spindle', 'alignment'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-02-18'),
        createdAt: new Date('2025-12-08'),
        typePayload: {
          patternSignals: ['Drift appears after 90+ minutes', 'Tool wear increases on axis B'],
          likelyCauses: ['Bearing preload drop', 'Thermal growth mismatch in mount']
        }
      },
      {
        id: 'kr_int_001',
        type: 'EXPERT_INTERVIEW',
        title: 'Expert interview: pump seal judgement under mixed loads',
        summary: 'Interview capturing tacit checks used before disassembly.',
        body: 'Structured expert interview session recorded during reliability workshop.',
        author: 'Riley Shaw',
        reviewer: 'Evan Singh',
        approvalState: 'UNDER_REVIEW',
        confidence: 'MEDIUM',
        asset: 'PMP-03',
        system: 'Hydraulics',
        task: 'Seal troubleshooting',
        symptom: 'Intermittent leakage under variable load',
        environment: 'Plant B - pump room',
        tags: ['expert-interview', 'pump', 'seal'],
        currentVersion: 1,
        createdAt: new Date('2026-02-28'),
        typePayload: {
          expertName: 'Maria Kline',
          answers: {
            whatNoviceMisses: 'They skip vibration feel-check before opening the housing.',
            topThreeDangerSigns: 'Seal heat discoloration, milky residue, and sudden noise drop.',
            similarButDifferentFault: 'Cavitation looks similar but noise profile is sharper.',
            firstCheckBeforeOpening: 'Confirm return-line restriction and suction pressure trend.',
            whatManualMisses: 'Manual does not explain transitional load behavior after maintenance.'
          }
        }
      },
      {
        id: 'kr_shad_001',
        type: 'SHADOWING_RECORD',
        title: 'Shadowing record: junior hot-start fault triage walkthrough',
        summary: 'Hands-on session covering diagnosis sequence and escalation criteria.',
        body: 'Session focused on decision points and escalation thresholds.',
        author: 'Riley Shaw',
        reviewer: 'Evan Singh',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'CMP-07',
        system: 'Pneumatics',
        task: 'Hot-start diagnostics',
        symptom: 'No pressure build after restart',
        environment: 'Plant A - Bay 3',
        tags: ['shadowing', 'mentoring', 'hot-start'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-03-05'),
        createdAt: new Date('2026-03-01'),
        typePayload: {
          seniorTechnician: 'Maria Kline',
          juniorTechnician: 'Jamal Ortiz',
          competencyScore: 4,
          sessionOutcome: 'Junior completed full triage with one prompt and logged corrective actions.'
        }
      }
    ]
  });

  await prisma.knowledgeRelation.createMany({
    data: [
      { fromRecordId: 'kr_proc_001', toRecordId: 'kr_note_001' },
      { fromRecordId: 'kr_proc_001', toRecordId: 'kr_shad_001' },
      { fromRecordId: 'kr_note_001', toRecordId: 'kr_proc_001' },
      { fromRecordId: 'kr_int_001', toRecordId: 'kr_fail_001' },
      { fromRecordId: 'kr_shad_001', toRecordId: 'kr_proc_001' }
    ]
  });

  await prisma.expertProfile.createMany({
    data: [
      {
        id: 'ep_001',
        name: 'Maria Kline',
        roleFocus: 'Senior Pneumatics Technician',
        domains: ['Hot-start diagnostics', 'Compressor pressure recovery'],
        assets: ['CMP-07'],
        yearsExperience: 31,
        retirementWindowStart: new Date('2026-09-01'),
        retirementWindowEnd: new Date('2027-03-31'),
        riskLevel: 'HIGH',
        notes: 'Primary expert for compressor restart behavior in variable ambient conditions.'
      },
      {
        id: 'ep_002',
        name: 'Evan Singh',
        roleFocus: 'Reliability Reviewer',
        domains: ['Failure validation', 'Review governance'],
        assets: ['CMP-07', 'CNC-12'],
        yearsExperience: 18,
        riskLevel: 'MEDIUM'
      }
    ]
  });

  await prisma.handoverPack.createMany({
    data: [
      {
        id: 'hp_001',
        expertProfileId: 'ep_001',
        targetRole: 'SENIOR_TECHNICIAN',
        status: 'IN_PROGRESS',
        targetDate: new Date('2026-12-15'),
        coverageScore: 40,
        validatedCount: 2
      }
    ]
  });

  await prisma.handoverTask.createMany({
    data: [
      {
        handoverPackId: 'hp_001',
        title: 'Record three expert walkthroughs on hot-start fault triage',
        status: 'DONE',
        assigneeName: 'Riley Shaw',
        dueDate: new Date('2026-05-01'),
        completedAt: new Date('2026-04-25')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Validate junior shadowing sign-off on compressor restart sequence',
        status: 'IN_PROGRESS',
        assigneeName: 'Evan Singh',
        dueDate: new Date('2026-06-15')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Capture site-specific winter workaround constraints',
        status: 'OPEN',
        dueDate: new Date('2026-07-01')
      }
    ]
  });

  await prisma.knowledgeRecord.update({
    where: { id: 'kr_proc_001' },
    data: {
      sourceExpertId: 'ep_001',
      handoverPackId: 'hp_001'
    }
  });

  await prisma.knowledgeRecordVersion.createMany({
    data: [
      {
        knowledgeRecordId: 'kr_proc_001',
        versionNumber: 1,
        editedBy: 'Maria Kline',
        changeNote: 'Initial version',
        snapshot: {
          id: 'kr_proc_001',
          type: 'PROCEDURE',
          title: 'Approved method: compressor hot-start pressure recovery',
          body: 'Use this approved sequence before opening the compressor assembly.'
        },
        createdAt: new Date('2026-01-15T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_note_001',
        versionNumber: 1,
        editedBy: 'Jamal Ortiz',
        changeNote: 'Initial version',
        snapshot: {
          id: 'kr_note_001',
          type: 'FIELD_NOTE',
          title: 'Field note: morning pressure oscillation in cold ambient',
          body: 'Observed during first startup cycle on morning shift, ambient at 5C.'
        },
        createdAt: new Date('2026-03-03T06:45:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_001',
        versionNumber: 1,
        editedBy: 'Maria Kline',
        changeNote: 'Initial version',
        snapshot: {
          id: 'kr_fail_001',
          type: 'FAILURE_PATTERN',
          title: 'Failure pattern: spindle drift after thermal expansion cycle',
          body: 'Pattern observed across four jobs in two weeks with similar temperature envelope.'
        },
        createdAt: new Date('2025-12-08T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_int_001',
        versionNumber: 1,
        editedBy: 'Riley Shaw',
        changeNote: 'Initial version',
        snapshot: {
          id: 'kr_int_001',
          type: 'EXPERT_INTERVIEW',
          title: 'Expert interview: pump seal judgement under mixed loads',
          body: 'Structured expert interview session recorded during reliability workshop.'
        },
        createdAt: new Date('2026-02-28T13:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_shad_001',
        versionNumber: 1,
        editedBy: 'Riley Shaw',
        changeNote: 'Initial version',
        snapshot: {
          id: 'kr_shad_001',
          type: 'SHADOWING_RECORD',
          title: 'Shadowing record: junior hot-start fault triage walkthrough',
          body: 'Session focused on decision points and escalation thresholds.'
        },
        createdAt: new Date('2026-03-01T15:00:00Z')
      }
    ]
  });

  await prisma.auditEvent.createMany({
    data: [
      {
        knowledgeRecordId: 'kr_proc_001',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-01-15T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_001',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'STATUS_CHANGED',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        createdAt: new Date('2026-02-25T11:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_note_001',
        actorUserId: technician.id,
        actorName: technician.displayName,
        actorRole: technician.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-03-03T06:45:00Z')
      },
      {
        knowledgeRecordId: 'kr_note_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'STATUS_CHANGED',
        fromStatus: 'DRAFT',
        toStatus: 'UNDER_REVIEW',
        createdAt: new Date('2026-03-03T09:10:00Z')
      },
      {
        knowledgeRecordId: 'kr_int_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-02-28T13:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_shad_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-03-01T15:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_shad_001',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'STATUS_CHANGED',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        createdAt: new Date('2026-03-05T10:00:00Z')
      }
    ]
  });

  console.log('Seeded users, knowledge records, relationships, expert profiles, handover packs, and audit events');
  console.log('Login users: technician/technician123, senior/senior123, supervisor/supervisor123, reviewer/reviewer123, admin/admin123');
  void admin;
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
