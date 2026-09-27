export type PipelineStage =
  | 'session_completed'
  | 'raw_ingested'
  | 'culling'
  | 'color_grading'
  | 'proofing_live'
  | 'delivered'

export interface PipelineSession {
  id: string
  bookingId: string
  clientName: string
  clientEmail: string
  packageName: string
  shootDate: string
  stage: PipelineStage
  progressPercent: number
  totalFrames: number
  culledFrames: number
  retouchedFrames: number
  notes: string
  moodboardName: string
  wardrobePalette: string[]
}

export interface ShotListItem {
  id: string
  title: string
  lensRecommendation: string
  lightingNote: string
  priority: 'must_have' | 'creative' | 'golden_hour'
  isCompleted: boolean
}

export interface HardwareItem {
  id: string
  category: 'Body' | 'Lens' | 'Lighting' | 'Media'
  name: string
  status: string
  isPacked: boolean
}

export const STAGES_CONFIG: Record<
  PipelineStage,
  { label: string; step: number; color: string; description: string }
> = {
  session_completed: {
    label: 'Sitting Completed',
    step: 1,
    color: '#b45309',
    description: 'On-set capture concluded; awaiting physical card offload',
  },
  raw_ingested: {
    label: 'RAW Ingested & Backed Up',
    step: 2,
    color: '#0f766e',
    description: 'Dual SSD local backup + cloud archive verified',
  },
  culling: {
    label: 'Culling & 1st Cut',
    step: 3,
    color: '#4338ca',
    description: 'Curating 800+ raw exposures down to 80 master contenders',
  },
  color_grading: {
    label: 'Color Grading & Retouching',
    step: 4,
    color: '#7c2d12',
    description: 'Capture One skin tones, highlight rolloff & editorial tone curve',
  },
  proofing_live: {
    label: 'Proofing Vault Published',
    step: 5,
    color: '#047857',
    description: 'Private client gallery accessible for heart selections & 3D book',
  },
  delivered: {
    label: 'Archival Master Delivered',
    step: 6,
    color: '#15803d',
    description: 'Physical Hahnemühle prints & high-res masters delivered',
  },
}

export const DEFAULT_PIPELINE_SESSIONS: PipelineSession[] = [
  {
    id: 'pipe-1',
    bookingId: 'book-p1',
    clientName: 'Maharani Gayatri Singh',
    clientEmail: 'gayatri.singh@heritage.in',
    packageName: 'The Grand Royal Wedding',
    shootDate: '2026-09-21T10:00:00Z',
    stage: 'color_grading',
    progressPercent: 70,
    totalFrames: 1240,
    culledFrames: 120,
    retouchedFrames: 25,
    notes: 'Preserve deep crimson hues in the veil; match palace sandstone warmth.',
    moodboardName: 'Royal Opulence & Heritage',
    wardrobePalette: ['#800020', '#C5A059', '#1A2E40', '#F5F2EB'],
  },
  {
    id: 'pipe-2',
    bookingId: 'book-p2',
    clientName: 'Devika Singhania',
    clientEmail: 'devika@vogueindia.com',
    packageName: 'Haute Couture Editorial Lookbook',
    shootDate: '2026-09-24T14:00:00Z',
    stage: 'culling',
    progressPercent: 50,
    totalFrames: 850,
    culledFrames: 60,
    retouchedFrames: 12,
    notes: 'High fashion contrast; clean shadows for architectural lookbook spreads.',
    moodboardName: 'Vogue Minimalist Editorial',
    wardrobePalette: ['#1A1A1A', '#FFFFFF', '#9E2A2B', '#E5E5E5'],
  },
  {
    id: 'pipe-3',
    bookingId: 'book-p3',
    clientName: 'Kabir & Tara Malhotra',
    clientEmail: 'kabir.malhotra@gmail.com',
    packageName: 'Heritage Couple Editorial',
    shootDate: '2026-09-26T16:30:00Z',
    stage: 'raw_ingested',
    progressPercent: 30,
    totalFrames: 620,
    culledFrames: 0,
    retouchedFrames: 0,
    notes: 'Sunset backlight was incredible at 5:45 PM; prioritize silhouette frames.',
    moodboardName: 'Cinematic Golden Hour',
    wardrobePalette: ['#D4AF37', '#2C3E50', '#EAE6DF', '#8B5A2B'],
  },
]

export const DEFAULT_SHOT_LIST: Record<string, ShotListItem[]> = {
  general: [
    {
      id: 'shot-1',
      title: 'Palace Courtyard Veil Sweep (Full-length landscape)',
      lensRecommendation: 'Hasselblad 100mm f/2.2',
      lightingNote: 'Natural desert ambient with low-angle warm rim fill',
      priority: 'must_have',
      isCompleted: true,
    },
    {
      id: 'shot-2',
      title: 'Silhouette in Central Sandstone Archway',
      lensRecommendation: 'Leica Summilux 50mm f/1.4',
      lightingNote: 'Backlit by courtyard sunlight; expose for architectural edge',
      priority: 'must_have',
      isCompleted: true,
    },
    {
      id: 'shot-3',
      title: 'Macro Ring & Heirloom Jewelry Detail',
      lensRecommendation: 'Sony 100mm f/2.8 Macro GM',
      lightingNote: 'Profoto B10 with mini reflector at 45°',
      priority: 'creative',
      isCompleted: false,
    },
    {
      id: 'shot-4',
      title: 'Golden Hour Stepwell Promenade (14° low angle)',
      lensRecommendation: 'Sony 85mm f/1.2 GM',
      lightingNote: 'Direct sunlight backlight; use lens hood to control flare',
      priority: 'golden_hour',
      isCompleted: false,
    },
    {
      id: 'shot-5',
      title: 'Candlelit Palace Corridor Intimate Portrait',
      lensRecommendation: '50mm f/1.4 Prime',
      lightingNote: 'Ambient candle glow supplemented with 3200K tungsten kicker',
      priority: 'creative',
      isCompleted: false,
    },
  ],
}

export const DEFAULT_HARDWARE_CHECKLIST: HardwareItem[] = [
  {
    id: 'hw-1',
    category: 'Body',
    name: 'Hasselblad H6D-100c Medium Format Body',
    status: 'Sensor Cleaned · Firmware v2.4',
    isPacked: true,
  },
  {
    id: 'hw-2',
    category: 'Body',
    name: 'Sony A7R V Primary High-Speed Body',
    status: 'Dual Slot Active · Battery 100%',
    isPacked: true,
  },
  {
    id: 'hw-3',
    category: 'Lens',
    name: 'Sony FE 85mm f/1.2 GM Portrait Prime',
    status: 'Glass Pristine · CPL Filter Fitted',
    isPacked: true,
  },
  {
    id: 'hw-4',
    category: 'Lens',
    name: 'Leica Summilux 50mm f/1.4 Aspherical',
    status: 'Smooth Focus Ring · Clean Aperture',
    isPacked: true,
  },
  {
    id: 'hw-5',
    category: 'Lighting',
    name: 'Profoto B10X Plus 500W Strobes (Pair)',
    status: 'Li-Ion Batteries 100% · Transceiver Synced',
    isPacked: true,
  },
  {
    id: 'hw-6',
    category: 'Media',
    name: 'Sony CFexpress Type A 512GB (Dual Formatted)',
    status: 'Empty · Ready for 4,000+ uncompressed RAWs',
    isPacked: true,
  },
  {
    id: 'hw-7',
    category: 'Media',
    name: 'TetherPro USB-C High-Speed Studio Cable (15ft)',
    status: 'Jerkstopper Secured · Laptop Tested',
    isPacked: false,
  },
]

const PIPELINE_KEY = 'studio_photographer_pipeline_v1'
const SHOTS_KEY = 'studio_photographer_shots_v1'
const HARDWARE_KEY = 'studio_photographer_hardware_v1'

export function getPipelineSessions(): PipelineSession[] {
  try {
    const raw = localStorage.getItem(PIPELINE_KEY)
    if (!raw) {
      localStorage.setItem(PIPELINE_KEY, JSON.stringify(DEFAULT_PIPELINE_SESSIONS))
      return DEFAULT_PIPELINE_SESSIONS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PIPELINE_SESSIONS
  } catch {
    return DEFAULT_PIPELINE_SESSIONS
  }
}

export function advanceSessionStage(sessionId: string): PipelineSession[] {
  const current = getPipelineSessions()
  const stageOrder: PipelineStage[] = [
    'session_completed',
    'raw_ingested',
    'culling',
    'color_grading',
    'proofing_live',
    'delivered',
  ]

  const updated = current.map((sess) => {
    if (sess.id === sessionId) {
      const currentIndex = stageOrder.indexOf(sess.stage)
      if (currentIndex < stageOrder.length - 1) {
        const nextStage = stageOrder[currentIndex + 1]
        const percent = Math.round(((currentIndex + 2) / stageOrder.length) * 100)
        return {
          ...sess,
          stage: nextStage,
          progressPercent: percent,
        }
      }
    }
    return sess
  })

  localStorage.setItem(PIPELINE_KEY, JSON.stringify(updated))
  return updated
}

export function getShotList(): ShotListItem[] {
  try {
    const raw = localStorage.getItem(SHOTS_KEY)
    if (!raw) {
      localStorage.setItem(SHOTS_KEY, JSON.stringify(DEFAULT_SHOT_LIST.general))
      return DEFAULT_SHOT_LIST.general
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SHOT_LIST.general
  } catch {
    return DEFAULT_SHOT_LIST.general
  }
}

export function toggleShotItem(shotId: string): ShotListItem[] {
  const current = getShotList()
  const updated = current.map((s) => (s.id === shotId ? { ...s, isCompleted: !s.isCompleted } : s))
  localStorage.setItem(SHOTS_KEY, JSON.stringify(updated))
  return updated
}

export function addCustomShot(title: string): ShotListItem[] {
  const current = getShotList()
  const newItem: ShotListItem = {
    id: `shot-${Date.now()}`,
    title,
    lensRecommendation: 'Prime Lens of Choice',
    lightingNote: 'Spontaneous client-directed pose on set',
    priority: 'creative',
    isCompleted: false,
  }
  const updated = [...current, newItem]
  localStorage.setItem(SHOTS_KEY, JSON.stringify(updated))
  return updated
}

export function getHardwareChecklist(): HardwareItem[] {
  try {
    const raw = localStorage.getItem(HARDWARE_KEY)
    if (!raw) {
      localStorage.setItem(HARDWARE_KEY, JSON.stringify(DEFAULT_HARDWARE_CHECKLIST))
      return DEFAULT_HARDWARE_CHECKLIST
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_HARDWARE_CHECKLIST
  } catch {
    return DEFAULT_HARDWARE_CHECKLIST
  }
}

export function toggleHardwareItem(id: string): HardwareItem[] {
  const current = getHardwareChecklist()
  const updated = current.map((item) => (item.id === id ? { ...item, isPacked: !item.isPacked } : item))
  localStorage.setItem(HARDWARE_KEY, JSON.stringify(updated))
  return updated
}
