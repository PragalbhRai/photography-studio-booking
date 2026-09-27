import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

export type LightModifier = 'octabox' | 'beauty_dish' | 'fresnel' | 'softbox'
export type PresetKey = 'rembrandt' | 'butterfly' | 'split' | 'loop' | 'rim_noir' | 'commercial_highkey'

interface LightingPreset {
  id: PresetKey
  name: string
  subtitle: string
  description: string
  keyAngle: number // degrees (-180 to 180, 0 is direct front)
  keyElevation: number // degrees (0 to 80)
  keyDistance: number // meters (1 to 4)
  keyModifier: LightModifier
  fillRatio: number // 0 (no fill) to 1 (1:1 equal)
  fillAngle: number
  rimEnabled: boolean
  rimAngle: number
  tempKelvin: number
}

const PRESETS: Record<PresetKey, LightingPreset> = {
  rembrandt: {
    id: 'rembrandt',
    name: 'Rembrandt Master Light',
    subtitle: 'Classic Fine-Art Chiaroscuro',
    description: 'Key placed at 45° angle and 45° elevation. Illuminates the subject while casting a signature inverted triangle of light on the shadow cheek.',
    keyAngle: 45,
    keyElevation: 45,
    keyDistance: 2.0,
    keyModifier: 'octabox',
    fillRatio: 0.35,
    fillAngle: -45,
    rimEnabled: true,
    rimAngle: 140,
    tempKelvin: 4800,
  },
  butterfly: {
    id: 'butterfly',
    name: 'Butterfly / Paramount',
    subtitle: 'Classic Hollywood & Vogue Glamour',
    description: 'Key light positioned directly overhead and in front of the subject at 60° elevation. Creates a symmetrical butterfly-shaped shadow under the nose, carving cheekbones.',
    keyAngle: 0,
    keyElevation: 65,
    keyDistance: 1.8,
    keyModifier: 'beauty_dish',
    fillRatio: 0.5,
    fillAngle: 0,
    rimEnabled: true,
    rimAngle: 160,
    tempKelvin: 5600,
  },
  split: {
    id: 'split',
    name: 'Split Lighting',
    subtitle: 'High Drama & Mood',
    description: 'Key light positioned at exactly 90° to the side of the subject. Divides the face precisely into half brilliant illumination and half deep shadow.',
    keyAngle: 90,
    keyElevation: 20,
    keyDistance: 2.2,
    keyModifier: 'fresnel',
    fillRatio: 0.1,
    fillAngle: -90,
    rimEnabled: false,
    rimAngle: 140,
    tempKelvin: 6200,
  },
  loop: {
    id: 'loop',
    name: 'Loop Lighting',
    subtitle: 'The Universal Commercial Portrait',
    description: 'Key light at 30° creates a soft, subtle loop shadow from the nose that curves downward toward the corner of the mouth without touching the cheek shadow.',
    keyAngle: 30,
    keyElevation: 35,
    keyDistance: 2.4,
    keyModifier: 'softbox',
    fillRatio: 0.45,
    fillAngle: -40,
    rimEnabled: true,
    rimAngle: 135,
    tempKelvin: 5200,
  },
  rim_noir: {
    id: 'rim_noir',
    name: 'Cinematic Rim & Silhouette',
    subtitle: 'Editorial Edge Glow',
    description: 'Dual rim lights placed behind the subject at 145° create a razor-sharp halo highlighting hair, jawline, and shoulders while keeping front facial tone moody.',
    keyAngle: 60,
    keyElevation: 25,
    keyDistance: 3.5,
    keyModifier: 'fresnel',
    fillRatio: 0.05,
    fillAngle: -60,
    rimEnabled: true,
    rimAngle: 150,
    tempKelvin: 3400,
  },
  commercial_highkey: {
    id: 'commercial_highkey',
    name: 'High-Key Commercial Studio',
    subtitle: 'Flawless Beauty & Clean Shadowless Tone',
    description: 'Balanced dual 1:1.5 parabolic softboxes flanking the camera. Shadows are completely lifted with luminous catchlights in both eyes.',
    keyAngle: 25,
    keyElevation: 30,
    keyDistance: 1.6,
    keyModifier: 'octabox',
    fillRatio: 0.85,
    fillAngle: -25,
    rimEnabled: true,
    rimAngle: 170,
    tempKelvin: 5600,
  },
}

const SUBJECT_PORTRAITS = [
  {
    id: 'editorial-bride',
    name: 'Heritage Silk Portrait (Meera)',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'palace-groom',
    name: 'Classic Monochrome Profile (Aarav)',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'executive-woman',
    name: 'Corporate Editorial High-Key (Ananya)',
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
  },
]

export function VirtualLightingStudio() {
  const [activePreset, setActivePreset] = useState<PresetKey>('rembrandt')
  const [keyAngle, setKeyAngle] = useState(45)
  const [keyElevation, setKeyElevation] = useState(45)
  const [keyDistance, setKeyDistance] = useState(2.0)
  const [keyModifier, setKeyModifier] = useState<LightModifier>('octabox')
  const [fillRatio, setFillRatio] = useState(0.35)
  const [fillAngle, setFillAngle] = useState(-45)
  const [fillEnabled, setFillEnabled] = useState(true)
  const [rimEnabled, setRimEnabled] = useState(true)
  const [rimAngle, setRimAngle] = useState(140)
  const [tempKelvin, setTempKelvin] = useState(4800)
  const [selectedSubject, setSelectedSubject] = useState(0)
  const [copiedRecipe, setCopiedRecipe] = useState(false)

  // Apply preset
  const applyPreset = (presetKey: PresetKey) => {
    const p = PRESETS[presetKey]
    setActivePreset(presetKey)
    setKeyAngle(p.keyAngle)
    setKeyElevation(p.keyElevation)
    setKeyDistance(p.keyDistance)
    setKeyModifier(p.keyModifier)
    setFillRatio(p.fillRatio)
    setFillAngle(p.fillAngle)
    setFillEnabled(p.fillRatio > 0.1)
    setRimEnabled(p.rimEnabled)
    setRimAngle(p.rimAngle)
    setTempKelvin(p.tempKelvin)
  }

  // Interactive Overhead Dragging logic
  const stageRef = useRef<SVGSVGElement>(null)
  const [draggingLight, setDraggingLight] = useState<'key' | 'fill' | 'rim' | null>(null)

  const handlePointerDown = (light: 'key' | 'fill' | 'rim') => (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggingLight(light)
  }

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingLight || !stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = centerY - e.clientY // SVG Y inverted (positive is toward camera/front)

      // Calculate angle from front (0 deg is front, positive is right, negative is left)
      let angle = Math.atan2(dx, dy) * (180 / Math.PI)
      angle = Math.round(angle)

      // Calculate distance in meters based on radius (center to edge = 4 meters)
      const maxRadiusPx = rect.width / 2.3
      const distPx = Math.sqrt(dx * dx + dy * dy)
      const distMeters = Math.max(1.0, Math.min(4.5, Number(((distPx / maxRadiusPx) * 4).toFixed(1))))

      if (draggingLight === 'key') {
        setKeyAngle(angle)
        setKeyDistance(distMeters)
      } else if (draggingLight === 'fill') {
        setFillAngle(angle)
      } else if (draggingLight === 'rim') {
        setRimAngle(angle)
      }
    },
    [draggingLight],
  )

  const handlePointerUp = useCallback(() => {
    setDraggingLight(null)
  }, [])

  // Physics Calculations
  // 1. Inverse Square Law ($E = I / d^2$)
  const baseIntensity = (1 / (keyDistance * keyDistance)).toFixed(2)
  const fStopDrop = (2 * Math.log2(keyDistance / 1.0)).toFixed(1)

  // 2. Dynamic Shadow Shading
  const keyRad = (keyAngle * Math.PI) / 180
  const shadowX = -Math.sin(keyRad) * 45 // offset shadow opposite of light
  const shadowY = (keyElevation / 90) * 35 // downward shadow based on elevation
  const shadowSpread = keyModifier === 'fresnel' ? 10 : keyModifier === 'beauty_dish' ? 22 : 38

  // 3. Color temperature tint
  let kelvinR = 255
  let kelvinG = 255
  let kelvinB = 255
  if (tempKelvin < 5000) {
    kelvinR = 255
    kelvinG = Math.round(180 + (tempKelvin - 3000) * 0.035)
    kelvinB = Math.round(100 + (tempKelvin - 3000) * 0.065)
  } else if (tempKelvin > 5600) {
    kelvinR = Math.round(255 - (tempKelvin - 5600) * 0.04)
    kelvinG = Math.round(240 - (tempKelvin - 5600) * 0.02)
    kelvinB = 255
  }

  // 4. Modifier spec
  const modifierNames = {
    octabox: 'Profoto 4ft Parabolic Octabox (Soft wrap)',
    beauty_dish: '22" Silver Beauty Dish + 25° Honeycomb Grid',
    fresnel: 'Cooke 10" Optical Glass Fresnel Spotlight',
    softbox: 'Chimera Medium Strip Softbox with Diffusion',
  }

  const copyRecipe = () => {
    const text = `Northlight Studio 3D Lighting Setup:
Pattern: ${PRESETS[activePreset].name}
Key Light: ${keyAngle}° at ${keyElevation}° height, ${keyDistance}m distance (${modifierNames[keyModifier]})
Color Temp: ${tempKelvin}K
Fill Light: ${fillEnabled ? `${fillAngle}°, 1:${(1 / fillRatio).toFixed(1)} ratio` : 'None'}
Rim Light: ${rimEnabled ? `${rimAngle}°, Hair & Shoulder contour` : 'None'}`
    navigator.clipboard.writeText(text)
    setCopiedRecipe(true)
    setTimeout(() => setCopiedRecipe(false), 3000)
  }

  return (
    <div className="rounded border border-brass/60 bg-paper p-6 sm:p-10 shadow-lg">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-line pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
            <p className="text-[11px] uppercase tracking-[0.24em] text-brass font-medium">
              Interactive 3D Photometrics Engine
            </p>
          </div>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl text-ink">
            Virtual 3D Lighting Simulator & Gaffer Rig
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-mute">
            Manipulate studio strobes, modifiers, and color temperatures in real-time. Watch how classical portrait lighting patterns sculpt facial geometry before stepping into the studio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={copyRecipe}>
            {copiedRecipe ? '✓ Recipe Copied!' : '📋 Copy Studio Lighting Recipe'}
          </Button>
        </div>
      </div>

      {/* Lighting Pattern Quick Presets */}
      <div className="mt-6">
        <label className="text-xs uppercase tracking-wider text-mute font-semibold block mb-2.5">
          Select Master Lighting Pattern Preset:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
            const p = PRESETS[key]
            const isSelected = activePreset === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                className={cn(
                  'rounded border p-2.5 text-left transition relative flex flex-col justify-between',
                  isSelected
                    ? 'border-brass bg-cream shadow-sm text-ink ring-1 ring-brass/60'
                    : 'border-line bg-paper/60 hover:border-ink hover:bg-cream/40 text-mute',
                )}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-brass font-bold block">
                    {p.name.split(' ')[0]}
                  </span>
                  <span className="font-display text-sm font-semibold text-ink line-clamp-1">
                    {p.name}
                  </span>
                </div>
                <p className="mt-1 text-[9px] text-mute line-clamp-2 leading-tight">
                  {p.subtitle}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Dual Stage (Overhead 3D Floor Plan vs Live Portrait Renderer) */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Overhead 3D Interactive Studio Floor Plan (5 Cols) */}
        <div className="lg:col-span-6 rounded border border-line bg-ink p-5 text-cream relative overflow-hidden select-none">
          <div className="flex items-center justify-between border-b border-cream/15 pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-brass font-semibold">
                Studio A · Overhead Plot (360° Field)
              </span>
              <p className="text-xs text-cream/70 font-mono">
                Drag any light strobe to position in real-time
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cream/60">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> Key
              <span className="inline-block h-2 w-2 rounded-full bg-sky-400" /> Fill
              <span className="inline-block h-2 w-2 rounded-full bg-purple-400" /> Rim
            </div>
          </div>

          {/* Interactive SVG Radar Stage */}
          <div className="relative mt-4 flex items-center justify-center">
            <svg
              ref={stageRef}
              viewBox="-200 -200 400 400"
              className="h-[360px] sm:h-[400px] w-full cursor-crosshair touch-none"
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Background Seamless Wall Cyclorama */}
              <path
                d="M -160 -150 Q 0 -170 160 -150"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
                strokeDasharray="4 4"
              />
              <text x="0" y="-175" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="monospace">
                CYC SEAMLESS BACKDROP
              </text>

              {/* Distance Grid Rings (1m, 2m, 3m, 4m) */}
              {[45, 90, 135, 180].map((r, i) => (
                <g key={r}>
                  <circle cx="0" cy="0" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <text x={r - 4} y="12" fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace">
                    {i + 1}m
                  </text>
                </g>
              ))}

              {/* Crosshair Center Lines */}
              <line x1="-180" y1="0" x2="180" y2="0" stroke="rgba(255,255,255,0.06)" />
              <line x1="0" y1="-180" x2="0" y2="180" stroke="rgba(255,255,255,0.06)" />

              {/* Camera Icon at Bottom (Directly in front, 0°) */}
              <g transform="translate(0, 160)">
                <rect x="-16" y="-10" width="32" height="20" rx="3" fill="#333" stroke="#C5A059" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="5" fill="#C5A059" />
                {/* Camera View Angle Cone */}
                <path d="M 0 0 L -80 -160 L 80 -160 Z" fill="rgba(197,160,89,0.03)" />
                <text x="0" y="24" textAnchor="middle" fill="#C5A059" fontSize="9" fontFamily="monospace">
                  HASSELBLAD (0°)
                </text>
              </g>

              {/* Subject Head & Nose in Center */}
              <g transform="translate(0, 0)">
                {/* Subject Head */}
                <circle cx="0" cy="0" r="22" fill="#222" stroke="#fff" strokeWidth="1.5" />
                {/* Nose Pointer facing Camera (downward) */}
                <polygon points="0,22 -5,12 5,12" fill="#C5A059" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">
                  SUBJECT
                </text>
              </g>

              {/* Key Light Beam & Strobe Head */}
              {(() => {
                const rad = (keyAngle * Math.PI) / 180
                const radiusPx = (keyDistance / 4) * 180
                const x = Math.sin(rad) * radiusPx
                const y = Math.cos(rad) * radiusPx

                return (
                  <g>
                    {/* Glowing Light Beam Cone toward Subject */}
                    <polygon
                      points={`${x},${y} -20,0 20,0`}
                      fill="rgba(251, 191, 36, 0.12)"
                    />
                    {/* Beam Connection line */}
                    <line x1={x} y1={y} x2="0" y2="0" stroke="rgba(251, 191, 36, 0.5)" strokeDasharray="3 3" />
                    {/* Draggable Strobe Head */}
                    <g
                      transform={`translate(${x}, ${y})`}
                      onPointerDown={handlePointerDown('key')}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <circle cx="0" cy="0" r="16" fill="#F59E0B" stroke="#fff" strokeWidth="2" />
                      <circle cx="0" cy="0" r="22" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
                      <text x="0" y="4" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">
                        KEY
                      </text>
                      <text x="0" y="-22" textAnchor="middle" fill="#F59E0B" fontSize="9" fontFamily="monospace">
                        {keyAngle}° ({keyDistance}m)
                      </text>
                    </g>
                  </g>
                )
              })()}

              {/* Fill Light Beam & Strobe Head */}
              {fillEnabled &&
                (() => {
                  const rad = (fillAngle * Math.PI) / 180
                  const radiusPx = 130
                  const x = Math.sin(rad) * radiusPx
                  const y = Math.cos(rad) * radiusPx

                  return (
                    <g>
                      <polygon points={`${x},${y} -15,0 15,0`} fill="rgba(56, 189, 248, 0.08)" />
                      <line x1={x} y1={y} x2="0" y2="0" stroke="rgba(56, 189, 248, 0.4)" strokeDasharray="3 3" />
                      <g
                        transform={`translate(${x}, ${y})`}
                        onPointerDown={handlePointerDown('fill')}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <circle cx="0" cy="0" r="14" fill="#38BDF8" stroke="#fff" strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">
                          FILL
                        </text>
                        <text x="0" y="-18" textAnchor="middle" fill="#38BDF8" fontSize="8" fontFamily="monospace">
                          {fillAngle}°
                        </text>
                      </g>
                    </g>
                  )
                })()}

              {/* Rim Light Beam & Strobe Head */}
              {rimEnabled &&
                (() => {
                  const rad = (rimAngle * Math.PI) / 180
                  const radiusPx = 150
                  const x = Math.sin(rad) * radiusPx
                  const y = Math.cos(rad) * radiusPx

                  return (
                    <g>
                      <polygon points={`${x},${y} -12,-10 12,-10`} fill="rgba(192, 132, 252, 0.1)" />
                      <line x1={x} y1={y} x2="0" y2="0" stroke="rgba(192, 132, 252, 0.4)" strokeDasharray="3 3" />
                      <g
                        transform={`translate(${x}, ${y})`}
                        onPointerDown={handlePointerDown('rim')}
                        className="cursor-grab active:cursor-grabbing"
                      >
                        <circle cx="0" cy="0" r="13" fill="#C084FC" stroke="#fff" strokeWidth="1.5" />
                        <text x="0" y="3" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">
                          RIM
                        </text>
                        <text x="0" y="-16" textAnchor="middle" fill="#C084FC" fontSize="8" fontFamily="monospace">
                          {rimAngle}°
                        </text>
                      </g>
                    </g>
                  )
                })()}
            </svg>
          </div>

          {/* Inverse Square Law Callout Footer */}
          <div className="mt-4 rounded bg-white/5 border border-white/10 p-3 text-xs font-mono flex items-center justify-between">
            <div>
              <span className="text-brass">INVERSE SQUARE FALLOFF:</span>
              <p className="text-[11px] text-cream/70">
                Distance: {keyDistance}m → Relative Intensity: {baseIntensity}x ({fStopDrop} EV)
              </p>
            </div>
            <span className="text-[10px] text-cream/50 bg-black/40 px-2 py-1 rounded">
              I ∝ 1/d²
            </span>
          </div>
        </div>

        {/* Right: Live Rendered Portrait View (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col">
          {/* Subject Switcher */}
          <div className="flex items-center justify-between border-b border-line pb-2.5">
            <span className="text-xs uppercase tracking-wider text-ink font-semibold">
              Live Studio Portrait Preview
            </span>
            <div className="flex gap-1">
              {SUBJECT_PORTRAITS.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSubject(idx)}
                  className={cn(
                    'rounded px-2.5 py-1 text-[10px] uppercase tracking-wider transition border',
                    selectedSubject === idx
                      ? 'bg-ink text-cream border-ink font-semibold'
                      : 'bg-cream text-mute border-line hover:text-ink',
                  )}
                >
                  Model {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Portrait Canvas Stage */}
          <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden rounded border border-line bg-ink shadow-2xl flex items-center justify-center">
            {/* Base Studio Portrait Image */}
            <img
              src={SUBJECT_PORTRAITS[selectedSubject].src}
              alt="Studio portrait lighting model"
              className="h-full w-full object-cover transition-all duration-300"
            />

            {/* Dynamic Directional Shadow Layer (Calculated from Key Angle & Elevation) */}
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-200"
              style={{
                background: `linear-gradient(${keyAngle + 90}deg, rgba(0,0,0,0) 25%, rgba(0,0,0,${Math.min(0.85, 0.95 - fillRatio * 0.7)}) 85%)`,
                mixBlendMode: 'multiply',
              }}
            />

            {/* Facial Chiaroscuro Sculpture Overlay (Nose & Eye Socket Shadow Displacement) */}
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-200"
              style={{
                background: `radial-gradient(circle at ${50 - shadowX * 0.4}% ${40 + shadowY * 0.3}%, rgba(0,0,0,0) 20%, rgba(0,0,0,${Math.max(0.15, 0.7 - fillRatio * 0.5)}) ${shadowSpread + 30}%)`,
                mixBlendMode: 'multiply',
              }}
            />

            {/* Specular Skin Highlight & Cheekbone Luster */}
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-200"
              style={{
                background: `radial-gradient(circle at ${50 + Math.sin(keyRad) * 25}% ${35 - (keyElevation / 90) * 15}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 45%)`,
                mixBlendMode: 'overlay',
                opacity: keyModifier === 'beauty_dish' ? 0.9 : 0.65,
              }}
            />

            {/* Dynamic Catchlight Pupil Reflections (Position shifts with Key angle & elevation) */}
            <div
              className="pointer-events-none absolute z-20 transition-all duration-150"
              style={{
                top: '38%',
                left: '46.5%', // Left eye pupil region
                transform: `translate(${Math.sin(keyRad) * 4}px, ${-(keyElevation / 90) * 3}px)`,
              }}
            >
              <div
                className={cn(
                  'rounded-full bg-white shadow-[0_0_4px_#fff]',
                  keyModifier === 'beauty_dish' ? 'h-1.5 w-1.5 ring-1 ring-black/40' : 'h-1 w-1',
                )}
              />
            </div>
            <div
              className="pointer-events-none absolute z-20 transition-all duration-150"
              style={{
                top: '38%',
                left: '54.5%', // Right eye pupil region
                transform: `translate(${Math.sin(keyRad) * 4}px, ${-(keyElevation / 90) * 3}px)`,
              }}
            >
              <div
                className={cn(
                  'rounded-full bg-white shadow-[0_0_4px_#fff]',
                  keyModifier === 'beauty_dish' ? 'h-1.5 w-1.5 ring-1 ring-black/40' : 'h-1 w-1',
                )}
              />
            </div>

            {/* Color Temperature Tint Layer (3200K Tungsten to 6500K Cool Cinema) */}
            <div
              className="pointer-events-none absolute inset-0 transition-colors duration-300"
              style={{
                backgroundColor: `rgb(${kelvinR}, ${kelvinG}, ${kelvinB})`,
                mixBlendMode: 'color',
                opacity: 0.28,
              }}
            />

            {/* Rim Light / Hair Silhouette Contour Glow */}
            {rimEnabled && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  boxShadow: `inset ${Math.sin((rimAngle * Math.PI) / 180) * 20}px 0 35px rgba(255, 235, 200, 0.45)`,
                  mixBlendMode: 'screen',
                }}
              />
            )}

            {/* Live Camera Viewfinder Overlay */}
            <div className="pointer-events-none absolute inset-3 border border-white/20 rounded flex flex-col justify-between p-3 text-[10px] font-mono text-white/70">
              <div className="flex items-center justify-between">
                <span>[● REC] 16-BIT RAW</span>
                <span className="bg-black/50 px-2 py-0.5 rounded text-amber-400">
                  {tempKelvin}K
                </span>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-white/40 text-lg">+</span>
              </div>
              <div className="flex items-center justify-between text-[9px]">
                <span>ISO 100 · f/2.8 · 1/250s</span>
                <span>{PRESETS[activePreset].name.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Current Recipe Explanation Card */}
          <div className="mt-4 rounded border border-line bg-cream p-4">
            <h4 className="font-display text-base font-semibold text-ink">
              {PRESETS[activePreset].name} Pattern Analysis
            </h4>
            <p className="mt-1 text-xs text-mute leading-relaxed">
              {PRESETS[activePreset].description}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Fine-Tuning Sliders & Modifiers */}
      <div className="mt-8 border-t border-line pt-6">
        <h3 className="text-xs uppercase tracking-wider text-ink font-semibold mb-4">
          Photometric Gaffer Controls & Light Modifier Setup:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Light Controls */}
          <div className="rounded border border-line bg-cream p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Key Light (Main Strobe)
              </span>
              <span className="font-mono text-xs text-ink">{keyAngle}°</span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-mute mb-1">
                <span>Angle Position (-180° to +180°)</span>
                <span className="font-mono text-ink">{keyAngle}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={keyAngle}
                onChange={(e) => setKeyAngle(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-mute mb-1">
                <span>Elevation / Height (0° to 80°)</span>
                <span className="font-mono text-ink">{keyElevation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={keyElevation}
                onChange={(e) => setKeyElevation(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-mute mb-1">
                <span>Distance from Subject</span>
                <span className="font-mono text-ink">{keyDistance}m</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={keyDistance}
                onChange={(e) => setKeyDistance(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <span className="text-[11px] text-mute block mb-1">Modifier Hood</span>
              <select
                value={keyModifier}
                onChange={(e) => setKeyModifier(e.target.value as LightModifier)}
                className="w-full rounded border border-line bg-paper p-1.5 text-xs text-ink focus:outline-none"
              >
                <option value="octabox">Profoto 4-Foot Parabolic Octabox</option>
                <option value="beauty_dish">22" Silver Beauty Dish (Crisp)</option>
                <option value="fresnel">Optical Fresnel Spotlight (Hard Edge)</option>
                <option value="softbox">Chimera Medium Softbox</option>
              </select>
            </div>
          </div>

          {/* Fill Light Controls */}
          <div className="rounded border border-line bg-cream p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                Fill Light & Shadow Depth
              </span>
              <input
                type="checkbox"
                checked={fillEnabled}
                onChange={(e) => setFillEnabled(e.target.checked)}
                className="h-4 w-4 accent-sky-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-mute mb-1">
                <span>Fill Ratio (Shadow Density)</span>
                <span className="font-mono text-ink">
                  {fillEnabled ? `1:${(1 / Math.max(0.05, fillRatio)).toFixed(1)}` : 'Off'}
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.9"
                step="0.05"
                disabled={!fillEnabled}
                value={fillRatio}
                onChange={(e) => setFillRatio(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer disabled:opacity-40"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-mute mb-1">
                <span>Fill Light Angle</span>
                <span className="font-mono text-ink">{fillAngle}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                disabled={!fillEnabled}
                value={fillAngle}
                onChange={(e) => setFillAngle(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer disabled:opacity-40"
              />
            </div>

            <p className="text-[11px] text-mute pt-2 leading-relaxed">
              Fill controls the contrast ratio. A 1:1 ratio is flat commercial beauty, while 1:8 delivers moody cinematic drama.
            </p>
          </div>

          {/* Color Temperature & Rim Halo */}
          <div className="rounded border border-line bg-cream p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-800 uppercase tracking-wider">
                Color Temp & Hair Rim
              </span>
              <span className="font-mono text-xs text-ink">{tempKelvin}K</span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-mute mb-1">
                <span>Kelvin White Balance</span>
                <span className="font-mono text-ink">{tempKelvin}K</span>
              </div>
              <input
                type="range"
                min="3200"
                max="6500"
                step="100"
                value={tempKelvin}
                onChange={(e) => setTempKelvin(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-mute mt-1">
                <span>3200K (Tungsten)</span>
                <span>5600K (Daylight)</span>
                <span>6500K (Cool)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-line">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-ink">Rim Backlight Silhouette</span>
                <input
                  type="checkbox"
                  checked={rimEnabled}
                  onChange={(e) => setRimEnabled(e.target.checked)}
                  className="h-4 w-4 accent-purple-600"
                />
              </div>
              <div className="flex justify-between text-[11px] text-mute mb-1">
                <span>Rim Angle</span>
                <span className="font-mono text-ink">{rimAngle}°</span>
              </div>
              <input
                type="range"
                min="100"
                max="180"
                disabled={!rimEnabled}
                value={rimAngle}
                onChange={(e) => setRimAngle(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer disabled:opacity-40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
