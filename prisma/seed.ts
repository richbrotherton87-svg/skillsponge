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
        displayName: 'Field Technician',
        role: 'TECHNICIAN'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'senior',
        passwordHash: await bcrypt.hash('senior123', 10),
        displayName: 'Senior Field Engineer',
        role: 'SENIOR_TECHNICIAN'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'supervisor',
        passwordHash: await bcrypt.hash('supervisor123', 10),
        displayName: 'Service Supervisor',
        role: 'SUPERVISOR'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'reviewer',
        passwordHash: await bcrypt.hash('reviewer123', 10),
        displayName: 'Technical Reviewer',
        role: 'REVIEWER'
      }
    }),
    prisma.appUser.create({
      data: {
        username: 'admin',
        passwordHash: await bcrypt.hash('admin123', 10),
        displayName: 'Service Director',
        role: 'ADMIN'
      }
    })
  ]);

  await prisma.knowledgeRecord.createMany({
    data: [
      {
        id: 'kr_proc_001',
        type: 'PROCEDURE',
        title: 'Approved method: BSTA 510 annual lubrication system service',
        summary: 'Complete lubrication system flush and refill procedure for BSTA 510 high-performance stamping press.',
        body: 'This procedure covers the full annual lubrication service for the BSTA 510 lever system, ram bearings, and slide guides. The BSTA lever mechanism distributes load across the ram and relies on minimal bearing clearances - correct lubrication grade and fill sequence is critical to maintaining press precision and longevity. Must be performed with press isolated and ram at BDC.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-510',
        system: 'Lubrication',
        task: 'Annual lubrication service',
        symptom: 'Scheduled maintenance',
        environment: 'Customer site - Precision pressings, Birmingham',
        tags: ['approved-method', 'lubrication', 'annual-service', 'BSTA-510', 'preventive'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-02-20'),
        createdAt: new Date('2026-01-10'),
        typePayload: {
          steps: [
            'Isolate press and confirm ram at BDC. Lock out main drive and verify zero energy state.',
            'Drain existing lubricant from central lubrication reservoir. Inspect for metal particulate or discoloration - document findings.',
            'Remove and inspect all lubrication line filters. Replace any showing >60% blockage or discoloration.',
            'Flush lubrication channels with approved OEM flushing agent (part no. BRU-LUB-FLUSH-01). Run flush pump for 15 minutes.',
            'Inspect ram bearing journals and slide guide surfaces for scoring or wear marks. Measure clearances with feeler gauge - must be within 0.005mm of factory spec.',
            'Refill with OEM-approved ISO VG 68 lubricant (part no. BRU-LUB-68). Fill to sight glass indicator line.',
            'Run central lubrication pump manually for 5 cycles. Check all distribution points for flow confirmation.',
            'Start press in inching mode. Run 50 slow strokes and check for even oil film on all bearing surfaces.',
            'Record all measurements and findings on OEM service report form. Update OEE system maintenance log.'
          ]
        }
      },
      {
        id: 'kr_note_001',
        type: 'FIELD_NOTE',
        title: 'Field note: BSTA 280 servo feed drift at high stroke rates',
        summary: 'Servo feeder losing synchronisation above 1,200 spm on customer BSTA 280. Temperature-related encoder issue identified.',
        body: 'Called to customer site for intermittent feed misalignment on their BSTA 280 running connector strip at 1,350 spm. Strip was shifting 0.15mm left after 20 minutes of continuous running. Issue only appeared above 1,200 spm and after the servo motor housing reached approximately 55°C.',
        author: 'Field Technician',
        reviewer: 'Technical Reviewer',
        approvalState: 'UNDER_REVIEW',
        confidence: 'MEDIUM',
        asset: 'BSTA-280',
        system: 'Servo feed',
        task: 'Feed alignment diagnosis',
        symptom: 'Strip drift at high stroke rates',
        environment: 'Customer site - Connector manufacturer, Hertfordshire',
        tags: ['field-observation', 'servo-feed', 'high-speed', 'temperature', 'encoder'],
        currentVersion: 1,
        createdAt: new Date('2026-03-01'),
        typePayload: {
          observation: 'Servo encoder signal degrading as motor housing temperature exceeds 55°C. Encoder mounting bracket thermal expansion causing 0.15mm positional drift. Issue not present below 1,200 spm as motor does not reach critical temperature threshold.',
          immediateAction: 'Applied temporary thermal shielding between motor and encoder bracket. Ordered replacement thermally-compensated encoder mount (part no. BRU-SRV-ENC-TC). Reduced stroke rate to 1,100 spm as interim measure until part arrives.'
        }
      },
      {
        id: 'kr_fail_001',
        type: 'FAILURE_PATTERN',
        title: 'Failure pattern: BSTA 810 shaft tile temperature rise after extended run',
        summary: 'Recurring shaft tile overheating pattern on BSTA 810 presses in automotive sector running continuous 8-hour shifts.',
        body: 'Pattern documented across three BSTA 810 installations running automotive connector strip in continuous production. Shaft tile temperature consistently rises above alarm threshold (75°C) after 6-7 hours of continuous running at >800 spm. Issue has been traced to a combination of factors related to bearing clearance specification and lubrication flow rate at sustained high speeds.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-810',
        system: 'Ram and lever mechanism',
        task: 'Shaft tile temperature diagnosis',
        symptom: 'Shaft tile overheating after extended run',
        environment: 'Customer site - Automotive sector',
        tags: ['failure-pattern', 'shaft-tile', 'overheating', 'BSTA-810', 'continuous-production'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-02-15'),
        createdAt: new Date('2025-11-20'),
        typePayload: {
          patternSignals: [
            'Shaft tile temperature rises steadily after 5+ hours continuous running above 800 spm',
            'Lubrication oil return temperature 8-12°C above normal after 6 hours',
            'Slight increase in press noise level precedes temperature alarm by approximately 30 minutes',
            'Issue only manifests on BSTA 810 units running above 80% of max stroke rate for extended periods'
          ],
          likelyCauses: [
            'Factory bearing clearance set to standard spec - needs opening to upper tolerance band for sustained high-speed automotive applications',
            'Central lubrication flow rate insufficient for continuous high-speed duty - flow restrictor orifice needs upsizing from 1.2mm to 1.5mm',
            'Oil cooler capacity marginal for ambient temperatures above 28°C in automotive press shops - recommend supplementary cooling circuit'
          ]
        }
      },
      {
        id: 'kr_lesson_001',
        type: 'LESSON_LEARNED',
        title: 'Lesson learned: die alignment tolerance differences between BSTA 510 and BSTA 810',
        summary: 'Critical lesson from commissioning error where BSTA 510 die alignment specs were incorrectly applied to a BSTA 810 installation.',
        body: 'During commissioning of a new BSTA 810 at an aerospace customer, die alignment was set using BSTA 510 tolerance specifications from the previous job. The BSTA 810 has different ram geometry and the lever system distributes force differently at higher tonnages. This resulted in uneven strip deformation on initial trial runs. The error was caught during quality inspection of first-off parts but could have caused tool damage if the press had been run at full production speed.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-810',
        system: 'Die alignment',
        task: 'Press commissioning',
        symptom: 'Uneven strip deformation on trial',
        environment: 'Customer site - Aerospace sector',
        tags: ['lesson-learned', 'commissioning', 'die-alignment', 'BSTA-810', 'tolerance'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-01-30'),
        createdAt: new Date('2025-12-05'),
        typePayload: {
          lessonPoints: [
            'Always reference the model-specific commissioning manual - BSTA 510 and 810 have different ram parallelism tolerances despite similar visual appearance',
            'BSTA 810 die alignment spec is ±0.008mm vs BSTA 510 at ±0.012mm due to the higher force distribution in the lever system',
            'Create a pre-commissioning checklist that requires explicit model number verification against the spec sheet being used',
            'On multi-press sites, label service documentation with machine serial number and model to prevent cross-reference errors',
            'Run trial parts at 25% speed before ramping up - this catches alignment issues before they can cause tool damage at full stroke rate'
          ]
        }
      },
      {
        id: 'kr_int_001',
        type: 'EXPERT_INTERVIEW',
        title: 'Expert interview: BSTA press diagnostics - Senior Field Engineer, 28 years experience',
        summary: 'Structured interview capturing tacit diagnostic knowledge from senior field service engineer with deep expertise across the full BSTA range.',
        body: 'Formal knowledge capture session conducted at Telford Competence Centre. The senior field engineer is the most experienced BSTA service engineer in the UK operation, with hands-on experience across every model from the BSTA 200 to the BSTA 2500. This interview focuses on diagnostic approach and the judgement calls that differentiate an experienced engineer from a novice.',
        author: 'Service Supervisor',
        reviewer: 'Technical Reviewer',
        approvalState: 'UNDER_REVIEW',
        confidence: 'HIGH',
        asset: 'BSTA-510',
        system: 'Ram and lever mechanism',
        task: 'General press diagnostics',
        symptom: 'Multiple - diagnostic methodology',
        environment: 'Telford Competence Centre',
        tags: ['expert-interview', 'diagnostics', 'tacit-knowledge', 'BSTA-range'],
        currentVersion: 1,
        createdAt: new Date('2026-02-25'),
        typePayload: {
          expertName: 'Senior Field Engineer',
          answers: {
            whatNoviceMisses: 'They go straight to the electronics. Nine times out of ten on a BSTA press, the root cause is mechanical - bearing wear, lubrication starvation, or a die issue that is putting asymmetric load on the ram. I always listen to the press running before I touch anything. The sound tells you more than any diagnostic screen. A healthy BSTA has a clean, rhythmic punch. Any tonal change, any vibration you can feel through the floor - that is your first clue.',
            topThreeDangerSigns: 'First: any change in the sound profile at constant speed - this usually means bearing wear or a lubrication issue developing. Second: oil return temperature creeping up over a shift - the bearings are working harder than they should be. Third: parts quality drift that the operator is compensating for by adjusting feed parameters - this masks the real problem and makes diagnosis harder later.',
            similarButDifferentFault: 'Strip feed misalignment and die wear look identical on the finished part - you get the same off-centre hit pattern. But the root cause is completely different. Feed issues are consistent and repeatable - every part is offset by the same amount. Die wear creates a progressive drift that gets worse over the production run. Check 10 parts from different points in the run and you will see the difference immediately.',
            firstCheckBeforeOpening: 'Before I open anything, I check the OEE data and the lubrication system pressure gauge. The OEE trend tells me if performance has degraded gradually or dropped suddenly - that alone narrows down the fault category. Then I check the lubrication pressure - if it is low or fluctuating, I know the bearings are not getting what they need and half the time that is your answer right there.',
            whatManualMisses: 'The manual gives you factory specifications, but every press settles into its own character after a few thousand hours. The bearing clearances that are optimal for a new press are not always optimal for a press with 15,000 hours on the clock. Experienced engineers know that the upper tolerance band works better on high-hour presses - it reduces friction heat and extends service intervals. The manual does not tell you that because it is written for new machines.'
          }
        }
      },
      {
        id: 'kr_shad_001',
        type: 'SHADOWING_RECORD',
        title: 'Shadowing record: BSTA 410 commissioning and customer handover',
        summary: 'Junior engineer shadowed full press commissioning at EV connector manufacturer, covering mechanical setup through customer operator training.',
        body: 'Full-day shadowing session during BSTA 410 commissioning at new EV battery connector customer. Session covered site preparation checks, machine levelling, servo feeder calibration, die installation, tonnage verification, first-off trial runs, and operator training handover. Junior engineer performed the servo feeder calibration under supervision and led the operator training session.',
        author: 'Service Supervisor',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-410',
        system: 'Full press system',
        task: 'Press commissioning',
        symptom: 'New installation',
        environment: 'Customer site - EV connector manufacturer, Midlands',
        tags: ['shadowing', 'commissioning', 'BSTA-410', 'operator-training', 'EV-sector'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-03-05'),
        createdAt: new Date('2026-02-18'),
        typePayload: {
          seniorTechnician: 'Senior Field Engineer',
          juniorTechnician: 'Field Technician',
          competencyScore: 4,
          sessionOutcome: 'Junior completed servo feeder calibration independently with correct alignment within spec (±0.02mm). Led 45-minute operator training session confidently. Needs more experience with tonnage verification on larger presses - understood the theory but was hesitant on interpreting load cell readings at the upper range. Recommend they lead next BSTA 410 commissioning with senior engineer on standby.'
        }
      },
      {
        id: 'kr_proc_002',
        type: 'PROCEDURE',
        title: 'Approved method: BSTA press bearing clearance inspection and adjustment',
        summary: 'Standard procedure for measuring and adjusting ram bearing clearances on BSTA series presses during scheduled service visits.',
        body: 'Bearing clearance inspection is the single most important measurement during any BSTA service visit. The unique lever system relies on minimal clearances to maintain the precision that OEM presses are known for. This procedure applies to BSTA 200 through BSTA 810 models. Larger models (1250, 1600, 2500) follow similar principles but have additional measurement points - refer to model-specific supplement.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-510',
        system: 'Ram and lever mechanism',
        task: 'Bearing clearance inspection',
        symptom: 'Scheduled inspection',
        environment: 'Customer site - General',
        tags: ['approved-method', 'bearing-clearance', 'inspection', 'BSTA-range', 'critical'],
        currentVersion: 2,
        lastValidatedAt: new Date('2026-03-01'),
        createdAt: new Date('2025-10-15'),
        typePayload: {
          steps: [
            'Position ram at BDC and isolate press. Fit dial indicator gauges at four measurement points: front-left, front-right, rear-left, rear-right of ram.',
            'Record initial clearance readings at all four points. Compare against model-specific factory specification (see OEM service manual chapter 4).',
            'Maximum allowable clearance for BSTA 200-810: 0.015mm per side. Any reading above 0.012mm should be flagged for adjustment.',
            'To adjust: loosen the bearing cap retaining bolts in the sequence specified in the service manual (always cross-pattern, never sequential).',
            'Insert OEM precision shims (part no. BRU-SHIM-SET) to bring clearance within 0.003-0.008mm range. Use calibrated feeler gauges to verify.',
            'Torque bearing cap bolts to model-specific torque values (BSTA 510: 185Nm, BSTA 810: 240Nm). Use calibrated torque wrench only.',
            'Rotate crankshaft by hand through one full revolution. Clearance readings should remain consistent ±0.001mm through full rotation.',
            'Run press in inching mode for 20 strokes. Re-check all four clearance points. If readings have shifted, repeat adjustment.',
            'Document all before/after readings on OEM service report. Flag any readings approaching upper tolerance for reduced service interval.'
          ]
        }
      },
      {
        id: 'kr_note_002',
        type: 'FIELD_NOTE',
        title: 'Field note: coil handling unit vibration on BSTA 1250 high-tonnage line',
        summary: 'Excessive vibration in decoiler unit traced to floor mounting issue, not equipment fault. Important site preparation lesson.',
        body: 'Called to a medical device stamper running a BSTA 1250 with integrated OEM decoiler. Customer reported vibration in the coil handling unit causing strip tension variation. Initial assumption was decoiler bearing wear, but investigation revealed the issue was foundation-related.',
        author: 'Field Technician',
        reviewer: 'Technical Reviewer',
        approvalState: 'DRAFT',
        confidence: 'MEDIUM',
        asset: 'BSTA-1250',
        system: 'Coil handling',
        task: 'Vibration diagnosis',
        symptom: 'Decoiler vibration and strip tension variation',
        environment: 'Customer site - Medical device manufacturer, Cambridge',
        tags: ['field-observation', 'coil-handling', 'vibration', 'foundation', 'BSTA-1250'],
        currentVersion: 1,
        createdAt: new Date('2026-03-08'),
        typePayload: {
          observation: 'Decoiler vibration was not originating from the unit itself. Floor-mounted accelerometer showed the concrete pad under the decoiler had developed a crack, creating a resonance at the press operating frequency (650 spm). The BSTA 1250 generates significant dynamic force that the original floor specification was marginal for. Vibration amplitude was 0.8mm at the decoiler base vs 0.1mm at the press base - confirming the floor was the issue.',
          immediateAction: 'Recommended customer engage structural engineer to assess foundation. Provided OEM floor specification document (BRU-INST-FLOOR-1250) showing minimum 300mm reinforced concrete pad requirement for BSTA 1250. Reduced stroke rate to 500 spm as interim measure to bring vibration within acceptable limits. Arranged follow-up visit for after foundation repair.'
        }
      },
      {
        id: 'kr_fail_002',
        type: 'FAILURE_PATTERN',
        title: 'Failure pattern: press monitoring false alarms on BSTA 200 running thin copper strip',
        summary: 'Pattern of false tonnage alarms on BSTA 200 presses running thin copper alloy strip (<0.2mm) at high speed for electronics connectors.',
        body: 'Multiple BSTA 200 customers in the electronics connector sector reporting frequent tonnage monitor false alarms when running thin copper alloy strip (0.1-0.2mm thickness) at speeds above 1,500 spm. The alarms trigger emergency stops that disrupt production and cause operator frustration. Pattern consistent across four different customer sites.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-200',
        system: 'Press monitoring',
        task: 'Tonnage monitor calibration',
        symptom: 'False tonnage alarms at high speed on thin strip',
        environment: 'Customer site - Electronics connector sector',
        tags: ['failure-pattern', 'press-monitoring', 'false-alarm', 'thin-strip', 'BSTA-200', 'high-speed'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-02-28'),
        createdAt: new Date('2025-12-12'),
        typePayload: {
          patternSignals: [
            'False tonnage alarms occurring 3-8 times per shift on thin strip (<0.2mm) above 1,500 spm',
            'Alarms always on the low-force side - monitor interpreting fast return stroke as under-tonnage',
            'No alarm events on same press running thicker strip (>0.3mm) at same speed',
            'Oscilloscope trace of load cell signal shows genuine force signature buried in high-frequency noise at top speed'
          ],
          likelyCauses: [
            'Default tonnage monitor sampling rate too slow for the force pulse width at maximum speed on thin strip - signal is being aliased',
            'Low-pass filter threshold on the monitoring unit set for general-purpose applications, not optimised for high-speed thin-strip work',
            'Solution: adjust monitoring unit filter frequency from 2kHz to 5kHz (OEM service parameter M-217) and reduce sampling window from 8ms to 3ms (parameter M-218). Requires factory-level access code.'
          ]
        }
      },
      {
        id: 'kr_proc_003',
        type: 'PROCEDURE',
        title: 'Approved method: BSTA press machine relocation - site preparation and re-levelling',
        summary: 'Complete procedure for press relocation including disconnection, transport preparation, site readiness checks, and precision re-levelling.',
        body: 'Machine relocations are a key service offering. This procedure covers the critical steps for safely relocating any BSTA press and ensuring it is returned to factory-level precision at the new site. A poorly executed relocation can take weeks to recover from. This procedure has been refined through over 200 successful relocations across the UK.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'UNDER_REVIEW',
        confidence: 'HIGH',
        asset: 'BSTA-510',
        system: 'Full press system',
        task: 'Machine relocation',
        symptom: 'Planned relocation',
        environment: 'Customer site - General',
        tags: ['approved-method', 'relocation', 'levelling', 'site-preparation', 'commissioning'],
        currentVersion: 1,
        createdAt: new Date('2026-03-06'),
        typePayload: {
          steps: [
            'Pre-move survey: verify new site floor specification meets OEM requirements (min 200mm reinforced concrete for BSTA 200-510, 300mm for BSTA 710+). Check crane access, power supply spec, and compressed air availability.',
            'At existing site: run press and record baseline measurements - bearing clearances, ram parallelism, tonnage signature, and vibration profile. These are your target values for the new site.',
            'Disconnect all services: electrical (photograph all connections before disconnecting), pneumatic, lubrication, and monitoring systems. Secure all loose components and drain lubrication system.',
            'Fit transit locks to ram and crankshaft per OEM transport specification. Protect slide guides with corrosion inhibitor and wrap exposed surfaces.',
            'At new site: position press on anti-vibration mounts per OEM layout drawing. Level press bed to within 0.02mm/metre using precision spirit level.',
            'Reconnect all services. Refill lubrication system and run pump for 10 cycles before first start.',
            'Run press in inching mode. Measure bearing clearances and ram parallelism - compare to pre-move baseline. Adjust as needed to match or better pre-move readings.',
            'Perform full tonnage verification with calibrated load cells. Compare to pre-move signature. Maximum allowable deviation: 2% of nominal force.',
            'Run 1-hour production trial at customer operating parameters. Verify part quality matches pre-move standard. Sign off relocation report with customer.'
          ]
        }
      },
      {
        id: 'kr_proc_004',
        type: 'PROCEDURE',
        title: 'OEM BSTA fault-finding walkthrough (B-Control, sensors, mechanical tolerances)',
        summary: 'Standard diagnostic sequence for BSTA high-speed stamping presses. Start here on every call-out. Covers B-Control IPC, eddy-current sensors, lubrication checks, and critical tolerances from official OEM publications.',
        body: [
          '# OEM BSTA Fault-Finding Walkthrough',
          '',
          '## Step 1: B-Control / IPC Screen (30 seconds)',
          '- Open the touch-screen control. Check error archive + live press-force / position monitoring.',
          '- Look for: tool monitoring alarms, BDC deviation, temperature alerts.',
          '',
          '## Step 2: Electronics and Sensors',
          '- Press-force sensors (2x standard) - compare to expected tonnage.',
          '- Eddy-current sensors in the die - measure actual insertion depth at BDC.',
          '  Source: "With the analogue SKILLSPONGE ram position control, the distance is measured by means of eddy current sensors, which are located in the die." (STAMPER magazine 2/06)',
          '',
          '## Step 3: PLC / Control Quick Checks',
          '- 24 VDC supply, Ethernet to peripherals, I/O status on screen.',
          '- Cycle power only if CPU error (rare).',
          '',
          '## Step 4: Lubrication (MOST COMMON ROOT CAUSE)',
          '- Pressure and flow on screen + visual leak check.',
          '- Low oil = instant bearing/gear wear risk. Check reservoir, filters, and distribution points.',
          '',
          '## Step 5: Clutch/Brake and Mechanical',
          '- Air pressure, linkage, gap.',
          '- Vibration - check mass-balancing and tie-rods.',
          '',
          '## Step 6: Run and Handover',
          '- Single stroke in setup mode - watch live ram correction.',
          '- Document findings before leaving site.',
          '',
          '## Critical Tolerances (from official OEM publications)',
          '- Dynamic ram height adjustment during stamping: +/-5 um',
          '  Source: "Thanks to the hardened and ground spindles, it is possible to adjust the ram height by +/- 5 um during the stamping process" (Fraunhofer IWU Workshop 2024, OEM presentation)',
          '- Typical ram adjustment resolution: 10 um (up to 2000 spm / 2500 kN)',
          '- Minimum ram adjustment (optional on BSTA 200/280/510): 2 um',
          '- Guide clearance: backlash-free at strip level',
          '',
          '## Common Failures',
          '- Lubrication failure - overheating and vibration',
          '- Ram BDC out of tolerance - bad parts (correct with eddy-current feedback)',
          '- Clutch slip at high spm',
          '- Sensor fault - auto-stop'
        ].join('\n'),
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA Series (all models)',
        system: 'Ram and guides / Clutch and brake / Lubrication / IPC control',
        task: 'Fault diagnosis and repair',
        symptom: 'Any downtime (lubrication failure, ram misalignment, clutch slip, vibration)',
        environment: 'High-speed stamping production - all sites',
        tags: ['approved-method', 'fault-finding', 'bsta', 'b-control', 'eddy-current', 'ram-correction', 'tolerances', 'diagnostics'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-03-10'),
        createdAt: new Date('2026-03-10'),
        typePayload: {
          steps: [
            'Start at B-Control error archive - check for recent alarms and fault codes',
            'Verify eddy-current sensor readings in the die - confirm BDC depth is within tolerance',
            'Check lubrication system pressure and flow - most common root cause of mechanical faults',
            'Inspect clutch/brake air pressure, linkage and gap',
            'Check mass-balancing and tie-rod condition if vibration is reported',
            'Run single stroke in setup mode - observe motorised ram correction in real time',
            'Run stamping trial at target spm and verify part quality'
          ],
          tolerances: {
            ramAdjustment: '+/-5 um during stamping (source: Fraunhofer IWU 2024 OEM presentation)',
            typicalResolution: '10 um',
            minimumOption: '2 um (optional on BSTA 200/280/510)',
            guideClearance: 'Backlash-free at strip level',
            bdcControl: 'Maintained via press-force + eddy-current sensors in die'
          },
          commonFailures: [
            'Lubrication failure - overheating',
            'Ram BDC out of tolerance - bad parts',
            'Clutch slip at high spm',
            'Sensor fault - auto-stop'
          ],
          publicSources: [
            'Fraunhofer IWU Workshop 2024 - OEM presentation on precision stamping',
            'STAMPER magazine 2/06 - eddy-current sensor technology',
            'STAMPER magazine 1/17 - 2 um precision option'
          ]
        }
      },
      {
        id: 'kr_proc_005',
        type: 'PROCEDURE',
        title: 'Approved method: pre-visit site checklist for BSTA service calls',
        summary: 'Standard preparation checklist before travelling to any customer site for scheduled service, breakdown, or commissioning work.',
        body: 'This checklist ensures every field service visit starts with the right information, tools, and parts. Completing it before leaving the Telford base or home avoids wasted journeys and delays on site. Applies to all visit types: scheduled service, breakdown response, commissioning, and relocation.',
        author: 'Service Supervisor',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA Series (all models)',
        system: 'Full press system',
        task: 'Pre-visit preparation',
        symptom: 'All visit types',
        environment: 'Telford base / home / en route',
        tags: ['approved-method', 'pre-visit', 'checklist', 'preparation', 'site-visit'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-03-12'),
        createdAt: new Date('2026-03-12'),
        typePayload: {
          steps: [
            'Confirm customer details: site address, contact name, phone number, access arrangements (security, PPE requirements, parking)',
            'Check machine details: model number, serial number, approximate running hours, last service date. Pull previous service reports from database.',
            'Review reported fault or service scope: what symptoms are they seeing? When did it start? Has anything changed recently (new tooling, speed change, relocation)?',
            'Check parts availability: verify required spares are in the van or order from Telford stock. Common items: lubrication filters, shim sets, seals, encoder mounts.',
            'Tool check: calibrated torque wrench (in date?), feeler gauge set, dial indicators, multimeter, thermal camera if available, laptop with B-Control software.',
            'Documentation: blank service report forms, model-specific service manual (digital or printed), relevant approved methods from SkillSponge.',
            'Travel and logistics: estimated travel time, expected duration on site, accommodation needed for multi-day jobs? Inform customer of ETA.',
            'Safety: site-specific risk assessment reviewed, LOTO locks packed, PPE appropriate for customer site (safety boots, hi-vis, ear defenders, safety glasses).',
            'Handover: if this is a machine you have not visited before, check SkillSponge for any site-specific notes, field observations, or previous failure patterns for this serial number.'
          ]
        }
      },
      {
        id: 'kr_fail_003',
        type: 'FAILURE_PATTERN',
        title: 'Failure pattern: clutch slip on BSTA 410 at high stroke rates during summer months',
        summary: 'Intermittent clutch slip causing missed strokes on BSTA 410 presses running above 1,200 spm when ambient temperature exceeds 30°C.',
        body: 'Pattern seen at two customer sites running BSTA 410 presses in non-air-conditioned press shops during summer. Clutch begins slipping intermittently after 3-4 hours of continuous running at high speed, causing missed strokes and emergency stops. Issue resolves when ambient temperature drops below 28°C.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-410',
        system: 'Clutch and brake',
        task: 'Clutch slip diagnosis',
        symptom: 'Intermittent missed strokes at high speed in warm conditions',
        environment: 'Customer site - Non-air-conditioned press shops',
        tags: ['failure-pattern', 'clutch', 'temperature', 'BSTA-410', 'seasonal'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-03-11'),
        createdAt: new Date('2026-01-20'),
        typePayload: {
          patternSignals: [
            'Missed strokes occurring after 3-4 hours of continuous running above 1,200 spm',
            'Only occurs when ambient temperature exceeds 30°C',
            'Clutch air pressure reads normal on gauge but response time is degraded',
            'Friction surface temperature measured at 85°C+ (normal operating range is 40-60°C)'
          ],
          likelyCauses: [
            'Clutch friction material losing grip coefficient at elevated temperature - material rated for max 75°C continuous',
            'Compressed air supply temperature rising in hot press shop - warmer air delivers less effective clamping force at same pressure',
            'Solution: increase air supply pressure by 0.5 bar during summer months (within safe operating range) and install air dryer on supply line to reduce moisture content. Long-term: recommend customer install localised cooling for the clutch/brake assembly.'
          ]
        }
      },
      {
        id: 'kr_fail_004',
        type: 'FAILURE_PATTERN',
        title: 'Failure pattern: progressive die misalignment on BSTA 510 after tooling change',
        summary: 'Recurring die misalignment issue after tool changeover on BSTA 510 presses. Root cause traced to inconsistent die clamping sequence.',
        body: 'Pattern seen at three BSTA 510 customer sites where operators are performing their own die changes. Parts quality degrades within the first 500 strokes after a tool change, showing progressive off-centre hits. Issue does not occur when OEM-trained setters perform the changeover.',
        author: 'Senior Field Engineer',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'HIGH',
        asset: 'BSTA-510',
        system: 'Die alignment',
        task: 'Die changeover diagnosis',
        symptom: 'Progressive off-centre hits after tool change',
        environment: 'Customer site - Various',
        tags: ['failure-pattern', 'die-alignment', 'tool-change', 'BSTA-510', 'operator-training'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-03-08'),
        createdAt: new Date('2026-02-01'),
        typePayload: {
          patternSignals: [
            'Parts show progressive off-centre hit pattern within first 500 strokes after tool change',
            'Issue worsens with increasing stroke rate',
            'Die appears correctly seated on visual inspection but is micro-shifted under dynamic load',
            'Problem only occurs with operator-performed changeovers, not OEM-trained setter changeovers'
          ],
          likelyCauses: [
            'Operators tightening die clamps in sequential order instead of cross-pattern - creates uneven clamping force that allows micro-movement under dynamic load',
            'Die locating pins not fully engaged before clamping - operators pushing die into approximate position rather than letting pins locate precisely',
            'Solution: operator retraining on OEM die changeover procedure. Key point: always cross-pattern tighten clamps, verify locating pin engagement with 0.02mm feeler gauge, and run 50 slow strokes before production speed. Consider installing die presence sensors for positive confirmation.'
          ]
        }
      },
      {
        id: 'kr_fail_005',
        type: 'FAILURE_PATTERN',
        title: 'Failure pattern: servo feed encoder failure after coolant contamination',
        summary: 'Servo feed encoder failures on BSTA presses in environments where cutting coolant mist is present. Encoder seal degradation leads to signal loss.',
        body: 'Three encoder failures in 6 months across two customer sites where BSTA presses are installed adjacent to CNC machining centres. Coolant mist from nearby machines is contaminating the servo feed encoder, degrading the seal and causing intermittent signal loss that presents as random feed length errors.',
        author: 'Field Technician',
        reviewer: 'Technical Reviewer',
        approvalState: 'APPROVED',
        confidence: 'MEDIUM',
        asset: 'BSTA-280',
        system: 'Servo feed',
        task: 'Encoder fault diagnosis',
        symptom: 'Random feed length errors, encoder signal loss',
        environment: 'Customer site - Mixed press/CNC environment',
        tags: ['failure-pattern', 'servo-feed', 'encoder', 'contamination', 'coolant', 'environment'],
        currentVersion: 1,
        lastValidatedAt: new Date('2026-03-09'),
        createdAt: new Date('2026-02-10'),
        typePayload: {
          patternSignals: [
            'Random feed length errors appearing 2-3 times per shift',
            'Errors not speed-dependent (unlike thermal drift pattern)',
            'Encoder signal trace shows intermittent dropouts rather than drift',
            'Visual inspection shows coolant residue around encoder housing seal',
            'Sites have CNC machining centres within 5 metres of the press'
          ],
          likelyCauses: [
            'Coolant mist from adjacent CNC machines penetrating encoder seal - standard IP54 seal not rated for continuous mist exposure',
            'Coolant chemistry (water-soluble type) accelerates seal degradation compared to oil-based coolants',
            'Solution: fit IP67-rated encoder cover (OEM retrofit kit BRU-SRV-ENC-IP67) and install mist extraction or physical barrier between press and CNC machines. Preventive: add encoder seal inspection to 6-monthly service checklist for sites with mixed press/CNC environments.'
          ]
        }
      }
    ]
  });

  await prisma.knowledgeRelation.createMany({
    data: [
      { fromRecordId: 'kr_proc_001', toRecordId: 'kr_fail_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_fail_001', toRecordId: 'kr_proc_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_001', toRecordId: 'kr_proc_002', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_002', toRecordId: 'kr_proc_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_int_001', toRecordId: 'kr_fail_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_int_001', toRecordId: 'kr_proc_002', relationType: 'RELATED' },
      { fromRecordId: 'kr_shad_001', toRecordId: 'kr_lesson_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_lesson_001', toRecordId: 'kr_shad_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_note_001', toRecordId: 'kr_fail_002', relationType: 'RELATED' },
      { fromRecordId: 'kr_note_002', toRecordId: 'kr_proc_003', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_004', toRecordId: 'kr_proc_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_004', toRecordId: 'kr_proc_002', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_004', toRecordId: 'kr_fail_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_004', toRecordId: 'kr_int_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_005', toRecordId: 'kr_proc_003', relationType: 'RELATED' },
      { fromRecordId: 'kr_proc_005', toRecordId: 'kr_proc_004', relationType: 'RELATED' },
      { fromRecordId: 'kr_fail_003', toRecordId: 'kr_proc_004', relationType: 'RELATED' },
      { fromRecordId: 'kr_fail_004', toRecordId: 'kr_lesson_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_fail_004', toRecordId: 'kr_shad_001', relationType: 'RELATED' },
      { fromRecordId: 'kr_fail_005', toRecordId: 'kr_note_001', relationType: 'RELATED' }
    ]
  });

  await prisma.expertProfile.createMany({
    data: [
      {
        id: 'ep_001',
        name: 'Senior Field Engineer',
        roleFocus: 'Senior Field Service Engineer - BSTA Press Specialist',
        domains: [
          'BSTA press diagnostics',
          'Bearing clearance and ram geometry',
          'Lubrication system service',
          'Press commissioning and relocation',
          'Tonnage verification and calibration',
          'High-speed stamping optimisation'
        ],
        assets: ['BSTA-200', 'BSTA-280', 'BSTA-410', 'BSTA-510', 'BSTA-710', 'BSTA-810', 'BSTA-1250'],
        yearsExperience: 28,
        retirementWindowStart: new Date('2027-01-01'),
        retirementWindowEnd: new Date('2027-09-30'),
        riskLevel: 'HIGH',
        notes: 'Most experienced BSTA field engineer in UK operation. Only engineer with hands-on experience across the full model range including legacy units. Sole holder of knowledge on several legacy customer installations dating back to the 1990s. Critical knowledge transfer priority - no single replacement available. Knowledge must be distributed across multiple engineers.'
      },
      {
        id: 'ep_002',
        name: 'Technical Reviewer',
        roleFocus: 'Technical Review Lead - Factory Liaison',
        domains: [
          'Technical review and validation',
          'Factory specification compliance',
          'Swiss HQ technical liaison',
          'Service documentation standards'
        ],
        assets: ['BSTA-510', 'BSTA-810', 'BSTA-1250', 'BSTA-1600', 'BSTA-2500'],
        yearsExperience: 15,
        riskLevel: 'LOW'
      },
      {
        id: 'ep_003',
        name: 'Service Supervisor',
        roleFocus: 'Service Supervisor - UK Operations',
        domains: [
          'Service scheduling and coordination',
          'Customer relationship management',
          'Turnkey project management',
          'Apprentice development'
        ],
        assets: ['BSTA-280', 'BSTA-410', 'BSTA-510'],
        yearsExperience: 19,
        riskLevel: 'MEDIUM',
        notes: 'Key holder of customer relationship knowledge and site-specific installation history across the UK customer base. Manages the service schedule and knows the quirks of individual customer installations.'
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
        targetDate: new Date('2027-06-30'),
        coverageScore: 35,
        validatedCount: 3
      },
      {
        id: 'hp_002',
        expertProfileId: 'ep_003',
        targetRole: 'SUPERVISOR',
        status: 'IN_PROGRESS',
        targetDate: new Date('2028-03-31'),
        coverageScore: 15,
        validatedCount: 0
      }
    ]
  });

  await prisma.handoverTask.createMany({
    data: [
      {
        handoverPackId: 'hp_001',
        title: 'Record expert walkthrough: BSTA 810 shaft tile diagnosis and adjustment procedure',
        status: 'DONE',
        assigneeName: 'Service Supervisor',
        dueDate: new Date('2026-04-30'),
        completedAt: new Date('2026-03-05')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Capture bearing clearance adjustment knowledge for all BSTA models with model-specific tolerance notes',
        status: 'DONE',
        assigneeName: 'Service Supervisor',
        dueDate: new Date('2026-05-15'),
        completedAt: new Date('2026-03-01')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Shadow senior engineer on next BSTA 1250 or 1600 service visit - large press service knowledge is most at-risk',
        status: 'IN_PROGRESS',
        assigneeName: 'Field Technician',
        dueDate: new Date('2026-06-30')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Document legacy customer installation history (pre-2010 machines) - senior engineer is sole knowledge holder',
        status: 'OPEN',
        dueDate: new Date('2026-08-31')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Record expert interview: diagnostic sound recognition and press health assessment by ear',
        status: 'DONE',
        assigneeName: 'Service Supervisor',
        dueDate: new Date('2026-05-01'),
        completedAt: new Date('2026-02-25')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Capture relocation procedure refinements and site-specific lessons from 200+ UK relocations',
        status: 'IN_PROGRESS',
        assigneeName: 'Field Technician',
        dueDate: new Date('2026-07-15')
      },
      {
        handoverPackId: 'hp_001',
        title: 'Validate junior engineer competency on BSTA 510 full annual service - independent sign-off',
        status: 'OPEN',
        assigneeName: 'Technical Reviewer',
        dueDate: new Date('2026-09-30')
      },
      {
        handoverPackId: 'hp_002',
        title: 'Document customer-specific service history and relationship notes for top 20 UK accounts',
        status: 'IN_PROGRESS',
        assigneeName: 'Service Supervisor',
        dueDate: new Date('2027-06-30')
      },
      {
        handoverPackId: 'hp_002',
        title: 'Create service scheduling playbook covering seasonal demand patterns and customer SLA requirements',
        status: 'OPEN',
        dueDate: new Date('2027-09-30')
      }
    ]
  });

  // Link knowledge records to expert profiles and handover packs
  await prisma.knowledgeRecord.update({
    where: { id: 'kr_proc_001' },
    data: { sourceExpertId: 'ep_001', handoverPackId: 'hp_001' }
  });
  await prisma.knowledgeRecord.update({
    where: { id: 'kr_fail_001' },
    data: { sourceExpertId: 'ep_001', handoverPackId: 'hp_001' }
  });
  await prisma.knowledgeRecord.update({
    where: { id: 'kr_int_001' },
    data: { sourceExpertId: 'ep_001', handoverPackId: 'hp_001' }
  });
  await prisma.knowledgeRecord.update({
    where: { id: 'kr_proc_002' },
    data: { sourceExpertId: 'ep_001', handoverPackId: 'hp_001' }
  });
  await prisma.knowledgeRecord.update({
    where: { id: 'kr_lesson_001' },
    data: { sourceExpertId: 'ep_001', handoverPackId: 'hp_001' }
  });
  await prisma.knowledgeRecord.update({
    where: { id: 'kr_shad_001' },
    data: { sourceExpertId: 'ep_001', handoverPackId: 'hp_001' }
  });
  await prisma.knowledgeRecord.update({
    where: { id: 'kr_proc_004' },
    data: { sourceExpertId: 'ep_001' }
  });

  await prisma.knowledgeRecordVersion.createMany({
    data: [
      {
        knowledgeRecordId: 'kr_proc_001',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - documented from 15 years of BSTA 510 service experience',
        snapshot: {
          id: 'kr_proc_001',
          type: 'PROCEDURE',
          title: 'Approved method: BSTA 510 annual lubrication system service',
          body: 'This procedure covers the full annual lubrication service for the BSTA 510 lever system, ram bearings, and slide guides.'
        },
        createdAt: new Date('2026-01-10T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_note_001',
        versionNumber: 1,
        editedBy: 'Field Technician',
        changeNote: 'Initial version - captured immediately after site visit',
        snapshot: {
          id: 'kr_note_001',
          type: 'FIELD_NOTE',
          title: 'Field note: BSTA 280 servo feed drift at high stroke rates',
          body: 'Called to customer site for intermittent feed misalignment on their BSTA 280.'
        },
        createdAt: new Date('2026-03-01T17:30:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_001',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - pattern confirmed across three customer sites',
        snapshot: {
          id: 'kr_fail_001',
          type: 'FAILURE_PATTERN',
          title: 'Failure pattern: BSTA 810 shaft tile temperature rise after extended run',
          body: 'Pattern documented across three BSTA 810 installations running automotive connector strip.'
        },
        createdAt: new Date('2025-11-20T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_lesson_001',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - documented after commissioning near-miss incident',
        snapshot: {
          id: 'kr_lesson_001',
          type: 'LESSON_LEARNED',
          title: 'Lesson learned: die alignment tolerance differences between BSTA 510 and BSTA 810',
          body: 'During commissioning of a new BSTA 810 at an aerospace customer, die alignment was set using BSTA 510 tolerance specifications.'
        },
        createdAt: new Date('2025-12-05T14:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_int_001',
        versionNumber: 1,
        editedBy: 'Service Supervisor',
        changeNote: 'Initial version - recorded at Telford Competence Centre knowledge capture session',
        snapshot: {
          id: 'kr_int_001',
          type: 'EXPERT_INTERVIEW',
          title: 'Expert interview: BSTA press diagnostics - Senior Field Engineer, 28 years experience',
          body: 'Formal knowledge capture session conducted at Telford Competence Centre.'
        },
        createdAt: new Date('2026-02-25T10:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_shad_001',
        versionNumber: 1,
        editedBy: 'Service Supervisor',
        changeNote: 'Initial version - shadowing session during BSTA 410 commissioning',
        snapshot: {
          id: 'kr_shad_001',
          type: 'SHADOWING_RECORD',
          title: 'Shadowing record: BSTA 410 commissioning and customer handover',
          body: 'Full-day shadowing session during BSTA 410 commissioning at new EV battery connector customer.'
        },
        createdAt: new Date('2026-02-18T17:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_002',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version',
        snapshot: {
          id: 'kr_proc_002',
          type: 'PROCEDURE',
          title: 'Approved method: BSTA press bearing clearance inspection and adjustment',
          body: 'Bearing clearance inspection is the single most important measurement during any BSTA service visit.'
        },
        createdAt: new Date('2025-10-15T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_002',
        versionNumber: 2,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Updated torque values for BSTA 810 following factory bulletin BRU-SB-2026-003',
        snapshot: {
          id: 'kr_proc_002',
          type: 'PROCEDURE',
          title: 'Approved method: BSTA press bearing clearance inspection and adjustment',
          body: 'Bearing clearance inspection is the single most important measurement during any BSTA service visit.'
        },
        createdAt: new Date('2026-03-01T11:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_note_002',
        versionNumber: 1,
        editedBy: 'Field Technician',
        changeNote: 'Initial version - captured after site visit',
        snapshot: {
          id: 'kr_note_002',
          type: 'FIELD_NOTE',
          title: 'Field note: coil handling unit vibration on BSTA 1250 high-tonnage line',
          body: 'Called to a medical device stamper running a BSTA 1250 with integrated OEM decoiler.'
        },
        createdAt: new Date('2026-03-08T16:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_002',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - pattern confirmed across four customer sites in electronics sector',
        snapshot: {
          id: 'kr_fail_002',
          type: 'FAILURE_PATTERN',
          title: 'Failure pattern: press monitoring false alarms on BSTA 200 running thin copper strip',
          body: 'Multiple BSTA 200 customers in the electronics connector sector reporting frequent tonnage monitor false alarms.'
        },
        createdAt: new Date('2025-12-12T10:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_003',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - distilled from 200+ UK press relocations',
        snapshot: {
          id: 'kr_proc_003',
          type: 'PROCEDURE',
          title: 'Approved method: BSTA press machine relocation - site preparation and re-levelling',
          body: 'Machine relocations are a key service offering.'
        },
        createdAt: new Date('2026-03-06T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_004',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - compiled from official OEM publications (Fraunhofer IWU 2024, STAMPER magazines)',
        snapshot: {
          id: 'kr_proc_004',
          type: 'PROCEDURE',
          title: 'OEM BSTA fault-finding walkthrough (B-Control, sensors, mechanical tolerances)',
          body: 'Standard diagnostic sequence for BSTA high-speed stamping presses.'
        },
        createdAt: new Date('2026-03-10T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_005',
        versionNumber: 1,
        editedBy: 'Service Supervisor',
        changeNote: 'Initial version - standard pre-visit checklist formalised from team best practice',
        snapshot: {
          id: 'kr_proc_005',
          type: 'PROCEDURE',
          title: 'Approved method: pre-visit site checklist for BSTA service calls',
          body: 'This checklist ensures every field service visit starts with the right information, tools, and parts.'
        },
        createdAt: new Date('2026-03-12T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_003',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - pattern confirmed at two customer sites over summer 2025',
        snapshot: {
          id: 'kr_fail_003',
          type: 'FAILURE_PATTERN',
          title: 'Failure pattern: clutch slip on BSTA 410 at high stroke rates during summer months',
          body: 'Intermittent clutch slip causing missed strokes on BSTA 410 presses.'
        },
        createdAt: new Date('2026-01-20T10:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_004',
        versionNumber: 1,
        editedBy: 'Senior Field Engineer',
        changeNote: 'Initial version - pattern confirmed across three customer sites with operator-performed changeovers',
        snapshot: {
          id: 'kr_fail_004',
          type: 'FAILURE_PATTERN',
          title: 'Failure pattern: progressive die misalignment on BSTA 510 after tooling change',
          body: 'Recurring die misalignment issue after tool changeover on BSTA 510 presses.'
        },
        createdAt: new Date('2026-02-01T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_005',
        versionNumber: 1,
        editedBy: 'Field Technician',
        changeNote: 'Initial version - three encoder failures documented in 6 months at two sites',
        snapshot: {
          id: 'kr_fail_005',
          type: 'FAILURE_PATTERN',
          title: 'Failure pattern: servo feed encoder failure after coolant contamination',
          body: 'Three encoder failures in 6 months across two customer sites.'
        },
        createdAt: new Date('2026-02-10T15:00:00Z')
      }
    ]
  });

  await prisma.auditEvent.createMany({
    data: [
      // kr_proc_001 - lubrication procedure: created -> approved
      {
        knowledgeRecordId: 'kr_proc_001',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-01-10T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'STATUS_CHANGED',
        fromStatus: 'DRAFT',
        toStatus: 'UNDER_REVIEW',
        createdAt: new Date('2026-01-12T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_001',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Comprehensive procedure validated against factory specifications. Approved for use across all UK BSTA 510 service visits.' },
        createdAt: new Date('2026-02-20T14:00:00Z')
      },

      // kr_note_001 - servo feed drift: created -> under review
      {
        knowledgeRecordId: 'kr_note_001',
        actorUserId: technician.id,
        actorName: technician.displayName,
        actorRole: technician.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-03-01T17:30:00Z')
      },
      {
        knowledgeRecordId: 'kr_note_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'STATUS_CHANGED',
        fromStatus: 'DRAFT',
        toStatus: 'UNDER_REVIEW',
        createdAt: new Date('2026-03-02T09:15:00Z')
      },

      // kr_fail_001 - shaft tile pattern: created -> approved
      {
        knowledgeRecordId: 'kr_fail_001',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2025-11-20T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_001',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Critical pattern validated with factory engineering team in Frasnacht. Solution confirmed effective.' },
        createdAt: new Date('2026-02-15T11:00:00Z')
      },

      // kr_lesson_001 - die alignment lesson: created -> approved
      {
        knowledgeRecordId: 'kr_lesson_001',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2025-12-05T14:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_lesson_001',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Important safety lesson. Added to mandatory pre-commissioning checklist.' },
        createdAt: new Date('2026-01-30T10:00:00Z')
      },

      // kr_int_001 - expert interview: created -> under review
      {
        knowledgeRecordId: 'kr_int_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-02-25T10:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_int_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'STATUS_CHANGED',
        fromStatus: 'DRAFT',
        toStatus: 'UNDER_REVIEW',
        createdAt: new Date('2026-02-26T08:30:00Z')
      },

      // kr_shad_001 - shadowing: created -> approved
      {
        knowledgeRecordId: 'kr_shad_001',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-02-18T17:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_shad_001',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Good progress documented. Competency assessment aligns with observation.' },
        createdAt: new Date('2026-03-05T10:00:00Z')
      },

      // kr_proc_002 - bearing clearance: created -> approved (v2 update)
      {
        knowledgeRecordId: 'kr_proc_002',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2025-10-15T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_002',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Core procedure validated against OEM factory service manual. Critical for all field engineers.' },
        createdAt: new Date('2026-03-01T11:00:00Z')
      },

      // kr_note_002 - coil handling vibration: created (draft)
      {
        knowledgeRecordId: 'kr_note_002',
        actorUserId: technician.id,
        actorName: technician.displayName,
        actorRole: technician.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-03-08T16:00:00Z')
      },

      // kr_fail_002 - false alarms: created -> approved
      {
        knowledgeRecordId: 'kr_fail_002',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2025-12-12T10:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_002',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Solution verified with OEM AG monitoring systems team. Parameter changes confirmed safe for all BSTA 200 units.' },
        createdAt: new Date('2026-02-28T15:00:00Z')
      },

      // kr_proc_003 - relocation: created -> under review
      {
        knowledgeRecordId: 'kr_proc_003',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-03-06T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_003',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'STATUS_CHANGED',
        fromStatus: 'DRAFT',
        toStatus: 'UNDER_REVIEW',
        createdAt: new Date('2026-03-07T08:00:00Z')
      },

      // kr_proc_004 - fault-finding walkthrough: created -> approved
      {
        knowledgeRecordId: 'kr_proc_004',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-03-10T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_004',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Verified against official OEM publications. Tolerances cross-checked with Frasnacht engineering. Approved as standard diagnostic reference.' },
        createdAt: new Date('2026-03-10T14:00:00Z')
      },

      // kr_proc_005 - pre-visit checklist: created -> approved
      {
        knowledgeRecordId: 'kr_proc_005',
        actorUserId: supervisor.id,
        actorName: supervisor.displayName,
        actorRole: supervisor.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-03-12T08:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_proc_005',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Standard pre-visit checklist approved. Mandatory for all service visits.' },
        createdAt: new Date('2026-03-12T11:00:00Z')
      },

      // kr_fail_003 - clutch slip: created -> approved
      {
        knowledgeRecordId: 'kr_fail_003',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-01-20T10:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_003',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Seasonal pattern confirmed. Air pressure adjustment within safe operating range.' },
        createdAt: new Date('2026-03-11T09:00:00Z')
      },

      // kr_fail_004 - die misalignment: created -> approved
      {
        knowledgeRecordId: 'kr_fail_004',
        actorUserId: senior.id,
        actorName: senior.displayName,
        actorRole: senior.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-02-01T09:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_004',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'Root cause validated. Operator retraining procedure added to service offering.' },
        createdAt: new Date('2026-03-08T14:00:00Z')
      },

      // kr_fail_005 - encoder contamination: created -> approved
      {
        knowledgeRecordId: 'kr_fail_005',
        actorUserId: technician.id,
        actorName: technician.displayName,
        actorRole: technician.role,
        eventType: 'RECORD_CREATED',
        toStatus: 'DRAFT',
        createdAt: new Date('2026-02-10T15:00:00Z')
      },
      {
        knowledgeRecordId: 'kr_fail_005',
        actorUserId: reviewer.id,
        actorName: reviewer.displayName,
        actorRole: reviewer.role,
        eventType: 'REVIEW_DECISION',
        fromStatus: 'UNDER_REVIEW',
        toStatus: 'APPROVED',
        metadata: { reviewDecision: 'APPROVE', reviewerRationale: 'IP67 retrofit kit confirmed available from OEM AG parts catalogue. Added to environmental risk checklist.' },
        createdAt: new Date('2026-03-09T10:00:00Z')
      }
    ]
  });

  console.log('Seeded OEM UK field service knowledge base:');
  console.log('  - 5 users (role-based)');
  console.log('  - 15 knowledge records');
  console.log('  - 20 knowledge relations');
  console.log('  - 3 expert profiles');
  console.log('  - 2 handover packs with 9 tasks');
  console.log('  - 16 record versions');
  console.log('  - 31 audit events');
  console.log('');
  console.log('Login: technician/technician123, senior/senior123, supervisor/supervisor123, reviewer/reviewer123, admin/admin123');
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
