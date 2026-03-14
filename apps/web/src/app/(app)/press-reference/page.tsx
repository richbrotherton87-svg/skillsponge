import Link from 'next/link';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { requireAnyRole } from '@/lib/authz';

const BSTA_MODELS = [
  { model: 'BSTA 200', force: '200 kN (20t)', maxSpm: '2,000', optSpm: '2,300', toolArea: '600\u2013700 mm', stroke: '8\u201332 mm', ram: '\u00b15 \u00b5m (2 \u00b5m opt)', feed: 'Servo' },
  { model: 'BSTA 280', force: '280 kN (28t)', maxSpm: '1,500', optSpm: '2,000', toolArea: '750\u2013880 mm', stroke: '10\u201338 mm', ram: '\u00b15 \u00b5m (2 \u00b5m opt)', feed: 'Servo' },
  { model: 'BSTA 410', force: '410 kN (41t)', maxSpm: '1,600', optSpm: '\u2014', toolArea: '1,100 mm', stroke: '10\u201351 mm', ram: '\u00b15 \u00b5m', feed: 'Servo' },
  { model: 'BSTA 510', force: '510 kN (51t)', maxSpm: '1,120', optSpm: '\u2014', toolArea: '950\u20131,500 mm', stroke: '10\u201364 mm', ram: '\u00b15 \u00b5m (2 \u00b5m opt)', feed: 'Servo' },
  { model: 'BSTA 710', force: '710 kN (71t)', maxSpm: '850', optSpm: '\u2014', toolArea: '2,200 mm', stroke: '10\u201376 mm', ram: '\u00b15 \u00b5m', feed: 'Servo' },
  { model: 'BSTA 810', force: '810 kN (81t)', maxSpm: '1,000', optSpm: '\u2014', toolArea: '970\u20131,800 mm', stroke: '10\u201376 mm', ram: '\u00b15 \u00b5m', feed: 'Servo' },
  { model: 'BSTA 1250', force: '1,250 kN (125t)', maxSpm: '850', optSpm: '\u2014', toolArea: '1,170\u20131,810 mm', stroke: '10\u201389 mm', ram: '\u00b15 \u00b5m', feed: 'Servo' },
  { model: 'BSTA 1600', force: '1,600 kN (160t)', maxSpm: '825', optSpm: '\u2014', toolArea: '1,170\u20132,200 mm', stroke: '13\u2013100 mm', ram: '\u00b15 \u00b5m', feed: 'Servo' },
  { model: 'BSTA 2500', force: '2,500 kN (250t)', maxSpm: '710', optSpm: '\u2014', toolArea: '2,700 mm', stroke: '16\u2013127 mm', ram: '\u00b15 \u00b5m', feed: 'Servo' },
];

const KEY_SYSTEMS = [
  { system: 'Ram & Lever Mechanism', description: 'Unique lever system distributes load on the ram. Minimal bearing clearances (0.003\u20130.008 mm target). Hardened and ground spindles enable \u00b15 \u00b5m ram height adjustment during stamping.' },
  { system: 'Lubrication', description: 'Central forced-feed lubrication system. ISO VG 68 grade oil. Annual flush recommended. Low oil pressure is the most common root cause of mechanical faults.' },
  { system: 'B-Control / IPC', description: 'Touch-screen control with error archive, live press-force and position monitoring. Tool monitoring, BDC deviation alerts, and temperature tracking.' },
  { system: 'Servo Feed', description: 'Servo-driven feeding with encoder feedback. Precision at high speeds. Watch for thermal drift on encoder mounts above 1,200 spm.' },
  { system: 'Press Monitoring', description: 'Press-force sensors (2x standard). Eddy-current sensors in die measure actual BDC depth. 4-input position monitoring detects ram tilt and guide wear.' },
  { system: 'Clutch & Brake', description: 'Pneumatic clutch/brake system. Check air pressure, linkage wear, and gap. Slip at high spm indicates worn friction surfaces.' },
  { system: 'Coil Handling', description: 'Decoilers, straighteners, and rewind equipment. Foundation spec critical for high-tonnage models (300 mm reinforced concrete for BSTA 710+).' },
];

const MONITORING_SYSTEMS = [
  { system: 'B-Control IPC', detail: 'Pentium-based touch-screen control. Multilingual display with error archive, live press-force/position. Manual or automatic ram axis corrections during operation. Windows OS with OEM proprietary software.' },
  { system: 'Press-force sensors', detail: '2x or 4x load channels for tonnage measurement. Dynamic envelope curve monitoring across full stroke cycle - not just peak load at BDC.' },
  { system: 'Eddy-current sensors', detail: 'Located in the die. Measure actual insertion depth at BDC for real-time ram position control. Enable \u00b15 \u00b5m dynamic correction during stamping.' },
  { system: 'Tool monitoring', detail: 'Up to 12 separate analogue tool channels (PSA sensors). Up to 24 digital inputs/CAM outputs. Tool library holds up to 1,000 tool setups with parameters and notes.' },
  { system: 'ShopFloorConnect (OEE)', detail: 'Real-time OEE and downtime tracking. SMI 2 machine-mounted interfaces collect data with no operator involvement. Large-format factory displays highlight underperforming machines. Microsoft SQL integration.' },
];

const INDUSTRY_APPLICATIONS = [
  { sector: 'Automotive', components: 'Plug-in connectors (~8,000 per vehicle), ECU housings, terminal strips, battery contacts', growth: 'EV electrification driving massive demand for stamped connectors and motor laminations' },
  { sector: 'Electronics', components: 'IC lead frames, SIM card contacts, USB/Lightning connectors, semiconductor packages', growth: 'Miniaturisation requires tighter tolerances at higher speeds' },
  { sector: 'Medical', components: 'Surgical instrument parts, implant components, diagnostic device housings', growth: 'Growing sector for OEM UK - high precision, regulatory traceability' },
  { sector: 'Aerospace', components: 'Electrical connectors, sensor housings, structural clips and fasteners', growth: 'Electric aviation creating new demand for lightweight stamped components' },
  { sector: 'EV / Renewables', components: 'Battery tab connectors, motor rotor/stator laminations, charging connector pins', growth: 'Highest growth sector - rotor/stator laminations require absolute repeat accuracy' },
  { sector: 'Construction', components: 'Metal fixings, brackets, cable management components', growth: 'Post-fire legislation driving switch from plastic to metal fixings' },
];

const CRITICAL_TOLERANCES = [
  { item: 'Dynamic ram adjustment', value: '\u00b15 \u00b5m during stamping', source: 'Fraunhofer IWU 2024' },
  { item: 'Minimum ram adjustment (option)', value: '2 \u00b5m (BSTA 200/280/510)', source: 'STAMPER 1/17' },
  { item: 'Typical resolution', value: '10 \u00b5m', source: 'Fraunhofer IWU 2024' },
  { item: 'Bearing clearance target', value: '0.003\u20130.008 mm per side', source: 'Service manual Ch.4' },
  { item: 'Max allowable clearance', value: '0.015 mm per side', source: 'Service manual Ch.4' },
  { item: 'Guide clearance', value: 'Backlash-free at strip level', source: 'OEM AG specs' },
  { item: 'Relocation levelling', value: '0.02 mm/metre', source: 'Installation spec' },
  { item: 'Tonnage deviation after relocation', value: 'Max 2% of nominal force', source: 'Service procedure' },
];

export default async function PressReferencePage() {
  await requireAnyRole(['TECHNICIAN', 'SENIOR_TECHNICIAN', 'SUPERVISOR', 'REVIEWER', 'ADMIN']);

  return (
    <div className="space-y-6">
      <PageHeader title="High-Speed Press Reference" description="Model specifications, key systems, and critical tolerances from official OEM publications." />

      {/* Model specs table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">BSTA model specifications</CardTitle>
          <p className="text-sm text-muted-foreground">All models feature the OEM lever system and servo feed as standard. Data from oem.com and Fraunhofer IWU 2024.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Force</TableHead>
                <TableHead>Max spm</TableHead>
                <TableHead>Opt spm</TableHead>
                <TableHead>Tool area (L\u2013R)</TableHead>
                <TableHead>Stroke range</TableHead>
                <TableHead>Ram adj.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BSTA_MODELS.map((m) => (
                <TableRow key={m.model}>
                  <TableCell className="font-semibold text-primary">{m.model}</TableCell>
                  <TableCell>{m.force}</TableCell>
                  <TableCell>{m.maxSpm}</TableCell>
                  <TableCell className="text-muted-foreground">{m.optSpm}</TableCell>
                  <TableCell>{m.toolArea}</TableCell>
                  <TableCell>{m.stroke}</TableCell>
                  <TableCell>{m.ram}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Key systems */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Key systems overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {KEY_SYSTEMS.map((s) => (
              <div key={s.system} className="rounded-md border p-3">
                <h4 className="font-semibold text-primary">{s.system}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monitoring and control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Monitoring and control systems</CardTitle>
          <p className="text-sm text-muted-foreground">Systems a field service engineer interacts with on every visit. Data from oem.co.uk product pages.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {MONITORING_SYSTEMS.map((m) => (
            <div key={m.system} className="rounded-md border p-3">
              <h4 className="font-semibold text-primary">{m.system}</h4>
              <p className="mt-1 text-sm text-muted-foreground">{m.detail}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Industry applications */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Industry applications</CardTitle>
          <p className="text-sm text-muted-foreground">Key sectors served by OEM customers. Useful context for understanding what each customer site produces.</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sector</TableHead>
                <TableHead>Typical components</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INDUSTRY_APPLICATIONS.map((a) => (
                <TableRow key={a.sector}>
                  <TableCell className="font-semibold text-primary">{a.sector}</TableCell>
                  <TableCell>{a.components}</TableCell>
                  <TableCell className="text-muted-foreground">{a.growth}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Critical tolerances */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Critical tolerances and specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CRITICAL_TOLERANCES.map((t) => (
                <TableRow key={t.item}>
                  <TableCell>{t.item}</TableCell>
                  <TableCell className="font-semibold text-primary">{t.value}</TableCell>
                  <TableCell className="text-muted-foreground">{t.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button render={<Link href="/search?status=APPROVED&keyword=BSTA" />}>
          Search approved BSTA methods
        </Button>
        <Button variant="outline" render={<Link href="/dashboard" />}>
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}
