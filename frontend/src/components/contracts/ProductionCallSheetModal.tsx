import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { generateCallSheetForSitting, type ProductionCallSheet } from '@/lib/callsheet'

interface Props {
  isOpen: boolean
  onClose: () => void
  sittingId?: string
  clientName?: string
  packageName?: string
  photographerName?: string
}

export function ProductionCallSheetModal({
  isOpen,
  onClose,
  sittingId = 'NL-SIT-2026-081',
  clientName = 'Pooja & Karan Malhotra',
  packageName = 'Royal Palace Wedding Masterwork',
  photographerName = 'Aarav Sharma',
}: Props) {
  const [callSheet, setCallSheet] = useState<ProductionCallSheet>(() =>
    generateCallSheetForSitting({
      sittingId,
      clientName,
      packageName,
      photographerName,
    }),
  )
  const [activeTab, setActiveTab] = useState<'schedule' | 'crew' | 'palette' | 'gear'>('schedule')

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleRegenerate = () => {
    setCallSheet(
      generateCallSheetForSitting({
        sittingId,
        clientName,
        packageName,
        photographerName,
      }),
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded border border-line bg-paper shadow-2xl overflow-hidden my-6 flex flex-col max-h-[95vh]">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-line bg-cream px-6 py-4 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-brass font-bold uppercase tracking-wider">
                  {callSheet.productionCode}
                </span>
                <span className="text-[10px] text-mute font-mono uppercase tracking-widest">
                  Official Film & Studio Call Sheet
                </span>
              </div>
              <h2 className="font-display text-xl text-ink font-semibold">
                {callSheet.packageName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={handleRegenerate}>
              ↻ Re-run AI Scheduler
            </Button>
            <Button size="sm" onClick={handlePrint}>
              🖨️ Print / Save PDF
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-paper text-mute hover:text-ink text-sm border border-line ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Hollywood Style Key Data Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-line bg-ink px-6 py-3 text-cream font-mono text-[11px]">
          <div>
            <span className="text-brass text-[9px] uppercase tracking-wider block">Date & Call Time</span>
            <span className="text-white font-semibold">{callSheet.callTime}</span>
          </div>
          <div>
            <span className="text-brass text-[9px] uppercase tracking-wider block">Sunrise / Sunset</span>
            <span className="text-white font-semibold">☀ {callSheet.sunriseTime} · ☾ {callSheet.sunsetTime}</span>
          </div>
          <div>
            <span className="text-brass text-[9px] uppercase tracking-wider block">Morning Golden Window</span>
            <span className="text-amber-400 font-semibold">{callSheet.goldenHourMorning}</span>
          </div>
          <div>
            <span className="text-brass text-[9px] uppercase tracking-wider block">Evening Twilight Window</span>
            <span className="text-amber-400 font-semibold">{callSheet.goldenHourEvening}</span>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-line bg-paper px-6 pt-2 gap-2 text-xs overflow-x-auto">
          {[
            { id: 'schedule', label: '⏱ Minute-by-Minute Schedule' },
            { id: 'crew', label: '👥 Crew & Department Heads' },
            { id: 'palette', label: '🎨 Wardrobe Color Harmony' },
            { id: 'gear', label: '📦 Kitbag & Battery Manifest' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 px-3 py-2 text-xs uppercase tracking-wider font-medium transition ${
                activeTab === tab.id
                  ? 'border-brass text-ink font-semibold'
                  : 'border-transparent text-mute hover:text-ink'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Minute-by-Minute Timeline Schedule */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-xs uppercase tracking-wider text-brass font-bold">
                  Synchronized Production Blocks & Optical Directives
                </span>
                <span className="text-[11px] font-mono text-mute">
                  Location: {callSheet.locationName}
                </span>
              </div>

              <div className="divide-y divide-line border border-line rounded bg-cream overflow-hidden">
                {callSheet.timelineSchedule.map((block, idx) => (
                  <div key={idx} className="p-4 hover:bg-paper/70 transition flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
                    <div className="sm:w-36 flex-shrink-0">
                      <span className="rounded bg-ink px-2 py-0.5 font-mono text-[10px] text-cream uppercase font-bold">
                        {block.time}
                      </span>
                      <p className="mt-1 font-mono text-[10px] text-brass uppercase tracking-wider">
                        {block.stage}
                      </p>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-display text-sm font-semibold text-ink">
                        {block.activity}
                      </h4>
                      <p className="mt-1 font-mono text-[11px] text-mute flex items-center gap-1.5">
                        <span className="text-brass">📷 Optical Directive:</span> {block.lensLighting}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Cast, Crew & Department Heads */}
          {activeTab === 'crew' && (
            <div className="space-y-4">
              <div className="border-b border-line pb-2">
                <span className="text-xs uppercase tracking-wider text-brass font-bold">
                  Production Personnel & Key Contacts
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { role: 'Commissioning Patron / Client', name: callSheet.clientName, detail: callSheet.clientContact, badge: 'Principal' },
                  { role: 'Director of Photography', name: callSheet.leadPhotographer, detail: 'Hasselblad Master · Sensor Calibration Lead', badge: 'Key Crew' },
                  { role: 'Key Gaffer & 1st Lighting Tech', name: callSheet.gafferLead, detail: 'Profoto Pro-11 High Voltage Certified', badge: 'Key Crew' },
                  { role: 'HMUA & Wardrobe Lead', name: callSheet.hmuaLead, detail: 'Silk draping, matte finish, continuous touchups', badge: 'Key Crew' },
                  { role: '16-Bit Digital Technician / Colorist', name: callSheet.leadColorist, detail: 'Live tethering station, EIZO CG319X monitor', badge: 'Key Crew' },
                  { role: 'Emergency Medical Hospital', name: callSheet.emergencyHospital, detail: 'Distance: 6 mins (Standby trauma team)', badge: 'Safety' },
                ].map((member, i) => (
                  <div key={i} className="rounded border border-line bg-cream p-4 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider text-mute font-semibold">
                        {member.role}
                      </span>
                      <span className="rounded bg-paper px-2 py-0.5 text-[9px] uppercase tracking-wider text-brass border border-line font-mono">
                        {member.badge}
                      </span>
                    </div>
                    <p className="font-display text-base font-semibold text-ink">
                      {member.name}
                    </p>
                    <p className="font-mono text-[11px] text-mute">
                      {member.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Wardrobe Color Harmony Palette */}
          {activeTab === 'palette' && (
            <div className="space-y-4">
              <div className="border-b border-line pb-2">
                <span className="text-xs uppercase tracking-wider text-brass font-bold">
                  Camera-Calibrated Wardrobe & Backdrop Harmony
                </span>
                <p className="mt-1 text-xs text-mute">
                  Colors verified under 5600K high-CRI strobe illumination to ensure zero moiré or fabric glare.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {callSheet.wardrobePalette.map((swatch, i) => (
                  <div key={i} className="rounded border border-line bg-cream overflow-hidden shadow-sm">
                    <div className="h-24 w-full" style={{ backgroundColor: swatch.hex }} />
                    <div className="p-3 text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink">{swatch.name}</span>
                        <span className="font-mono text-[10px] text-mute">{swatch.hex}</span>
                      </div>
                      <p className="text-[10px] text-mute font-mono">{swatch.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Equipment Manifest & Battery Reserves */}
          {activeTab === 'gear' && (
            <div className="space-y-4">
              <div className="border-b border-line pb-2 flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-brass font-bold">
                  Camera, Strobe & Optical Manifest
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded font-mono uppercase font-semibold">
                  ✓ 100% Inspected & Packed
                </span>
              </div>

              <div className="divide-y divide-line border border-line rounded bg-cream overflow-hidden text-xs">
                {callSheet.equipmentManifest.map((item, i) => (
                  <div key={i} className="p-3 flex items-center justify-between hover:bg-paper/70 transition">
                    <div className="flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      <span className="font-medium text-ink">{item.item}</span>
                    </div>
                    <span className="font-mono text-[11px] text-mute bg-paper px-2 py-0.5 rounded border border-line">
                      Serial: {item.serial}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Safety & Confidentiality Notes */}
          <div className="rounded border border-line bg-cream p-4 text-xs space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-brass font-bold block">
              Director Notes & Studio Protocol:
            </span>
            <p className="text-mute leading-relaxed font-mono text-[11px]">
              {callSheet.notes}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-cream px-6 py-3.5 flex flex-wrap items-center justify-between text-xs text-mute font-mono">
          <span>Northlight Studio · Ballard Estate Production Unit</span>
          <span className="text-ink font-semibold">Status: Confirmed & Dispatched to Crew</span>
        </div>
      </div>
    </div>
  )
}
