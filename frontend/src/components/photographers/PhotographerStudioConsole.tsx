import { useState, useEffect } from 'react'
import {
  PipelineSession,
  ShotListItem,
  HardwareItem,
  STAGES_CONFIG,
  getPipelineSessions,
  advanceSessionStage,
  getShotList,
  toggleShotItem,
  addCustomShot,
  getHardwareChecklist,
  toggleHardwareItem,
} from '@/lib/photographer-pipeline'
import { Button } from '@/components/ui/Button'

export function PhotographerStudioConsole() {
  const [sessions, setSessions] = useState<PipelineSession[]>([])
  const [shots, setShots] = useState<ShotListItem[]>([])
  const [hardware, setHardware] = useState<HardwareItem[]>([])
  const [newShotTitle, setNewShotTitle] = useState('')
  const [activeTab, setActiveTab] = useState<'pipeline' | 'shots' | 'hardware'>('pipeline')
  const [flashMessage, setFlashMessage] = useState<string | null>(null)

  useEffect(() => {
    setSessions(getPipelineSessions())
    setShots(getShotList())
    setHardware(getHardwareChecklist())
  }, [])

  const handleAdvance = (sessionId: string) => {
    const updated = advanceSessionStage(sessionId)
    setSessions(updated)
    const target = updated.find((s) => s.id === sessionId)
    if (target) {
      setFlashMessage(`Advanced ${target.clientName} to "${STAGES_CONFIG[target.stage].label}"!`)
      setTimeout(() => setFlashMessage(null), 4000)
    }
  }

  const handleToggleShot = (shotId: string) => {
    const updated = toggleShotItem(shotId)
    setShots(updated)
  }

  const handleAddShot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newShotTitle.trim()) return
    const updated = addCustomShot(newShotTitle.trim())
    setShots(updated)
    setNewShotTitle('')
  }

  const handleToggleHw = (id: string) => {
    const updated = toggleHardwareItem(id)
    setHardware(updated)
  }

  const packedCount = hardware.filter((h) => h.isPacked).length
  const totalHardware = hardware.length
  const completedShotsCount = shots.filter((s) => s.isCompleted).length

  return (
    <div className="mt-10 space-y-8">
      {/* Top Banner & Quick Metrics */}
      <div className="relative overflow-hidden border border-line bg-gradient-to-br from-cream via-[#f7f4ee] to-[#ebe5d8] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-[11px] font-medium tracking-[0.2em] uppercase text-brass">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-600" />
              Studio Master Command Center
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl text-ink">
              Production & Post-Delivery Suite
            </h2>
            <p className="mt-1 text-sm text-mute">
              Real-time pipeline orchestration, on-set director's shot list, and pre-flight hardware readiness.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-line bg-cream/90 px-4 py-3 text-center shadow-xs">
              <span className="block text-[10px] uppercase tracking-wider text-mute">Next Shoot</span>
              <span className="font-display text-xl font-semibold text-ink">In 3h 45m</span>
              <span className="block text-[10px] text-brass">Palace Courtyard Bay 1</span>
            </div>
            <div className="border border-line bg-cream/90 px-4 py-3 text-center shadow-xs">
              <span className="block text-[10px] uppercase tracking-wider text-mute">Client Rating</span>
              <span className="font-display text-xl font-semibold text-ink">★ 4.98 / 5.0</span>
              <span className="block text-[10px] text-mute">98 Verified Reviews</span>
            </div>
            <div className="border border-line bg-cream/90 px-4 py-3 text-center shadow-xs">
              <span className="block text-[10px] uppercase tracking-wider text-mute">Gear Ready</span>
              <span className={`font-display text-xl font-semibold ${packedCount === totalHardware ? 'text-emerald-700' : 'text-amber-700'}`}>
                {packedCount}/{totalHardware} Packed
              </span>
              <span className="block text-[10px] text-mute">Pre-flight Checklist</span>
            </div>
          </div>
        </div>

        {/* Flash Message */}
        {flashMessage && (
          <div className="mt-4 flex items-center justify-between border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs text-emerald-900 transition-all">
            <span>✓ {flashMessage}</span>
            <button onClick={() => setFlashMessage(null)} className="text-emerald-700 hover:text-emerald-950 font-bold">✕</button>
          </div>
        )}

        {/* Sub-Navigation Tabs */}
        <div className="mt-6 flex border-b border-line gap-4 text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`pb-3 border-b-2 font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-mute hover:text-ink'
            }`}
          >
            Post-Production Pipeline ({sessions.length} Active)
          </button>
          <button
            onClick={() => setActiveTab('shots')}
            className={`pb-3 border-b-2 font-medium transition-colors ${
              activeTab === 'shots'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-mute hover:text-ink'
            }`}
          >
            On-Set Shot List ({completedShotsCount}/{shots.length} Done)
          </button>
          <button
            onClick={() => setActiveTab('hardware')}
            className={`pb-3 border-b-2 font-medium transition-colors ${
              activeTab === 'hardware'
                ? 'border-ink text-ink font-semibold'
                : 'border-transparent text-mute hover:text-ink'
            }`}
          >
            Hardware & Kitbag ({packedCount}/{totalHardware} Ready)
          </button>
        </div>
      </div>

      {/* TAB 1: POST-PRODUCTION PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl text-ink">Post-Production Workflow & Vault Dispatch</h3>
              <p className="text-xs text-mute mt-0.5">
                Track sessions from physical camera ingest down to 3D monograph proofing vault live publication.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {sessions.map((sess) => {
              const currentStageConfig = STAGES_CONFIG[sess.stage]
              const stageOrder = [
                'session_completed',
                'raw_ingested',
                'culling',
                'color_grading',
                'proofing_live',
                'delivered',
              ]
              const currentIndex = stageOrder.indexOf(sess.stage)
              const isFinal = currentIndex === stageOrder.length - 1

              return (
                <div
                  key={sess.id}
                  className="border border-line bg-cream p-6 shadow-xs transition-all hover:border-ink/40"
                >
                  {/* Session Header */}
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-2xl font-medium text-ink">
                          {sess.clientName}
                        </span>
                        <span className="rounded-full bg-brass/15 px-2.5 py-0.5 text-[11px] font-medium text-brass">
                          {sess.packageName}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-mute">
                        Contact: <span className="text-ink">{sess.clientEmail}</span> · Shoot Date:{' '}
                        {new Date(sess.shootDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span
                          className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                          style={{ backgroundColor: currentStageConfig.color }}
                        >
                          Step {currentStageConfig.step}/6: {currentStageConfig.label}
                        </span>
                        <p className="mt-1 text-[11px] text-mute">{currentStageConfig.description}</p>
                      </div>

                      {!isFinal && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAdvance(sess.id)}
                          className="whitespace-nowrap shadow-xs"
                        >
                          Advance Stage →
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Stage Stepper Breadcrumb */}
                  <div className="mt-6 border-t border-line/60 pt-4">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                      {stageOrder.map((stgKey, idx) => {
                        const isPast = idx < currentIndex
                        const isCurrent = idx === currentIndex
                        const cfg = STAGES_CONFIG[stgKey as keyof typeof STAGES_CONFIG]
                        return (
                          <div
                            key={stgKey}
                            className={`p-2.5 text-center text-xs border transition-all ${
                              isCurrent
                                ? 'border-ink bg-ink text-cream shadow-xs font-semibold'
                                : isPast
                                ? 'border-emerald-700/40 bg-emerald-50/50 text-emerald-900'
                                : 'border-line/60 bg-white/40 text-mute opacity-60'
                            }`}
                          >
                            <span className="block text-[10px] uppercase tracking-wider">
                              {isPast ? '✓ Done' : isCurrent ? `● Step ${idx + 1}` : `○ Step ${idx + 1}`}
                            </span>
                            <span className="mt-1 block truncate font-medium text-[11px]">{cfg.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Editorial Detail Badges & Stats */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-line/50 pt-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-mute">Raw Exposures: </span>
                        <strong className="text-ink">{sess.totalFrames} frames</strong>
                      </div>
                      <div>
                        <span className="text-mute">Master Culls: </span>
                        <strong className="text-ink">{sess.culledFrames} selects</strong>
                      </div>
                      <div>
                        <span className="text-mute">Retouched & Graded: </span>
                        <strong className="text-ink">{sess.retouchedFrames} ready</strong>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-mute">Palette: </span>
                        <div className="flex -space-x-1">
                          {sess.wardrobePalette.map((col, i) => (
                            <span
                              key={i}
                              className="inline-block h-3.5 w-3.5 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: col }}
                              title={col}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs italic text-mute">
                      Director Note: "{sess.notes}"
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ON-SET SHOT LIST */}
      {activeTab === 'shots' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl text-ink">Director’s Live On-Set Shot List</h3>
              <p className="text-xs text-mute mt-0.5">
                Check off compositions live during shooting, note focal lengths, and log spontaneous poses on set.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-mute">
                Progress: <strong className="text-ink">{completedShotsCount} of {shots.length}</strong> shots captured
              </span>
              <div className="h-2 w-32 overflow-hidden bg-line">
                <div
                  className="h-full bg-emerald-600 transition-all"
                  style={{ width: `${(completedShotsCount / (shots.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Add custom shot form */}
          <form onSubmit={handleAddShot} className="flex gap-2">
            <input
              type="text"
              value={newShotTitle}
              onChange={(e) => setNewShotTitle(e.target.value)}
              placeholder="e.g. Spontaneous royal balcony portrait with bridal dupatta wind catch..."
              className="flex-1 border border-line bg-cream px-4 py-2 text-sm text-ink placeholder:text-mute focus:border-ink focus:outline-hidden"
            />
            <Button variant="primary" size="sm" type="submit">
              + Add On-Set Shot
            </Button>
          </form>

          {/* Shot list items */}
          <div className="divide-y divide-line border border-line bg-cream">
            {shots.map((shot) => {
              const priorityConfig = {
                must_have: { label: 'Must Have', badge: 'bg-rose-100 text-rose-800 border-rose-300' },
                creative: { label: 'Creative', badge: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
                golden_hour: { label: 'Golden Hour', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
              }[shot.priority]

              return (
                <div
                  key={shot.id}
                  onClick={() => handleToggleShot(shot.id)}
                  className={`flex cursor-pointer items-start justify-between p-4 transition-colors hover:bg-[#f5f1e8] ${
                    shot.isCompleted ? 'bg-cream/50 opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={shot.isCompleted}
                      onChange={() => handleToggleShot(shot.id)}
                      className="mt-1 h-4 w-4 cursor-pointer accent-ink"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`font-medium text-sm ${
                            shot.isCompleted ? 'line-through text-mute' : 'text-ink'
                          }`}
                        >
                          {shot.title}
                        </span>
                        <span
                          className={`rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priorityConfig.badge}`}
                        >
                          {priorityConfig.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-mute">
                        Lens: <span className="font-mono text-ink">{shot.lensRecommendation}</span> · Light:{' '}
                        <span className="italic">{shot.lightingNote}</span>
                      </p>
                    </div>
                  </div>

                  <span className="text-xs uppercase tracking-wider font-semibold text-mute">
                    {shot.isCompleted ? '✓ Captured' : 'Pending'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: HARDWARE & PRE-FLIGHT KITBAG */}
      {activeTab === 'hardware' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-display text-2xl text-ink">Hardware Pre-Flight Kitbag Checklist</h3>
              <p className="text-xs text-mute mt-0.5">
                Verify cameras, calibrated lenses, formatted dual storage, and high-output Profoto strobes before departing.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  packedCount === totalHardware
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {packedCount === totalHardware
                  ? 'All Systems Ready For Set (100%)'
                  : `${packedCount}/${totalHardware} Packed · Action Required`}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {hardware.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleHw(item.id)}
                className={`flex cursor-pointer items-start justify-between border p-4 transition-all hover:border-ink/50 ${
                  item.isPacked
                    ? 'border-emerald-700/30 bg-emerald-50/20'
                    : 'border-line bg-cream'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.isPacked}
                    onChange={() => handleToggleHw(item.id)}
                    className="mt-1 h-4 w-4 cursor-pointer accent-emerald-700"
                  />
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-brass">
                      [{item.category}]
                    </span>
                    <h4
                      className={`text-sm font-medium ${
                        item.isPacked ? 'text-ink' : 'text-ink/80 font-normal'
                      }`}
                    >
                      {item.name}
                    </h4>
                    <p className="mt-0.5 text-xs text-mute">{item.status}</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold uppercase tracking-wider ${
                    item.isPacked ? 'text-emerald-700' : 'text-amber-800'
                  }`}
                >
                  {item.isPacked ? '✓ In Pelican Case' : 'Unpacked'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
