import { useState, useEffect, useCallback, useRef } from 'react'
import type { ProofFrame } from './ProofingGallery'
import { cn } from '@/lib/cn'
import {
  studioSoundscape,
  type SoundscapeMood,
  getStoredVoiceCapsules,
  playVoiceCapsuleAudio,
  type VoiceCapsule,
} from '@/lib/soundtrack'

interface Props {
  isOpen: boolean
  onClose: () => void
  proofs: ProofFrame[]
  initialIndex?: number
  favorites: string[]
  onToggleFavorite: (id: string) => void
}

export function CinematicSlideshow({
  isOpen,
  onClose,
  proofs,
  initialIndex = 0,
  favorites,
  onToggleFavorite,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isPlaying, setIsPlaying] = useState(true)
  const [zoomPhase, setZoomPhase] = useState(false)

  // Soundtrack audio state
  const [soundtrackMood, setSoundtrackMood] = useState<SoundscapeMood>('strings')
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const soundtrackVolume = 0.28

  // Voice Capsule on current slide
  const [activeVoiceCapsule, setActiveVoiceCapsule] = useState<VoiceCapsule | null>(null)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const [voicePlaybackSeconds, setVoicePlaybackSeconds] = useState(0)

  const voiceControllerRef = useRef<{ stop: () => void } | null>(null)
  const voiceTimerRef = useRef<any>(null)

  const currentProof = proofs[currentIndex] || proofs[0]
  const isFav = currentProof ? favorites.includes(currentProof.id) : false

  // Detect capsules for current frame
  useEffect(() => {
    if (!currentProof) return
    const capsules = getStoredVoiceCapsules().filter((c) => c.proofId === currentProof.id)
    if (capsules.length > 0) {
      setActiveVoiceCapsule(capsules[0])
    } else {
      setActiveVoiceCapsule(null)
    }

    // Stop previous voice playback when changing slides
    if (voiceControllerRef.current) {
      voiceControllerRef.current.stop()
      voiceControllerRef.current = null
    }
    setIsPlayingVoice(false)
    setVoicePlaybackSeconds(0)
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current)
  }, [currentProof])

  // Play soundtrack when slideshow opens
  useEffect(() => {
    if (isOpen && !isAudioMuted && soundtrackMood !== 'off') {
      studioSoundscape.play(soundtrackMood)
      studioSoundscape.setVolume(soundtrackVolume)
    } else {
      studioSoundscape.stop()
    }

    return () => {
      studioSoundscape.stop()
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop()
      }
      if (voiceTimerRef.current) {
        clearInterval(voiceTimerRef.current)
      }
    }
  }, [isOpen, soundtrackMood, isAudioMuted, soundtrackVolume])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % proofs.length)
    setZoomPhase(false)
  }, [proofs.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + proofs.length) % proofs.length)
    setZoomPhase(false)
  }, [proofs.length])

  // Auto-advance timer (PAUSED when a voice capsule is playing so user can listen to the story)
  useEffect(() => {
    if (!isOpen || !isPlaying || isPlayingVoice) return

    const timer = setInterval(() => {
      handleNext()
    }, 6000)

    return () => clearInterval(timer)
  }, [isOpen, isPlaying, isPlayingVoice, handleNext])

  // Ken Burns zoom effect
  useEffect(() => {
    if (!isOpen) return
    const timeout = setTimeout(() => {
      setZoomPhase(true)
    }, 100)
    return () => clearTimeout(timeout)
  }, [currentIndex, isOpen])

  // Play or pause voice capsule
  const toggleVoicePlayback = () => {
    if (!activeVoiceCapsule) return

    if (isPlayingVoice) {
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stop()
        voiceControllerRef.current = null
      }
      setIsPlayingVoice(false)
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current)
      return
    }

    setIsPlayingVoice(true)
    setVoicePlaybackSeconds(0)

    voiceTimerRef.current = setInterval(() => {
      setVoicePlaybackSeconds((s) => s + 1)
    }, 1000)

    const controller = playVoiceCapsuleAudio(activeVoiceCapsule, () => {
      setIsPlayingVoice(false)
      setVoicePlaybackSeconds(0)
      if (voiceTimerRef.current) clearInterval(voiceTimerRef.current)
      voiceControllerRef.current = null
    })
    voiceControllerRef.current = controller
  }

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'v' || e.key === 'V') {
        toggleVoicePlayback()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handleNext, handlePrev, activeVoiceCapsule, isPlayingVoice])

  if (!isOpen || !currentProof) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#080809] text-cream select-none overflow-hidden animate-fadeIn">
      {/* Top Header Bar */}
      <div className="z-20 flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-gradient-to-b from-[#080809]/95 via-[#080809]/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
          <span className="font-display text-sm sm:text-base tracking-widest text-cream uppercase">
            The Heritage Atelier · Private Premiere
          </span>
          <span className="hidden sm:inline-block rounded bg-cream/10 px-2 py-0.5 text-[10px] tracking-wider text-brass uppercase font-mono">
            {currentProof.code}
          </span>
        </div>

        {/* Center / Right: Soundtrack Audio Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Soundtrack Selector */}
          <div className="flex items-center gap-2 rounded border border-cream/20 bg-cream/5 px-2.5 py-1 text-xs">
            <span className="text-[10px] uppercase tracking-wider text-brass font-medium flex items-center gap-1">
              <span>🎵</span>
              <span className="hidden md:inline">Score:</span>
            </span>

            <select
              value={soundtrackMood}
              onChange={(e) => {
                const mood = e.target.value as SoundscapeMood
                setSoundtrackMood(mood)
                if (mood === 'off') {
                  setIsAudioMuted(true)
                } else {
                  setIsAudioMuted(false)
                }
              }}
              className="bg-transparent text-xs text-cream focus:outline-none cursor-pointer"
            >
              <option value="strings" className="bg-[#121214] text-cream">
                🎻 Palace Strings (D Min)
              </option>
              <option value="piano" className="bg-[#121214] text-cream">
                🎹 Golden Hour Piano (F Maj)
              </option>
              <option value="ethereal" className="bg-[#121214] text-cream">
                🌌 Vogue Twilight (A Maj)
              </option>
              <option value="off" className="bg-[#121214] text-cream">
                🔇 Soundscape Off
              </option>
            </select>

            {/* Live Audio Visualizer Equalizer Waves */}
            {!isAudioMuted && soundtrackMood !== 'off' && (
              <div className="flex items-center gap-0.5 h-3 ml-1">
                <span className="w-0.5 bg-brass animate-pulse h-2" />
                <span className="w-0.5 bg-brass animate-pulse h-3" />
                <span className="w-0.5 bg-brass animate-pulse h-1.5" />
                <span className="w-0.5 bg-brass animate-pulse h-2.5" />
              </div>
            )}
          </div>

          {/* Pause / Play status */}
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="rounded border border-cream/20 bg-cream/5 px-3 py-1 text-xs uppercase tracking-wider text-cream hover:bg-cream/15 transition flex items-center gap-1.5"
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Heart Button */}
          <button
            type="button"
            onClick={() => onToggleFavorite(currentProof.id)}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full transition border text-sm',
              isFav
                ? 'border-rose-600 bg-rose-600 text-white'
                : 'border-cream/20 bg-cream/10 text-cream hover:border-cream/50',
            )}
            title={isFav ? 'Remove from favorites' : 'Heart for retouching'}
          >
            <span>{isFav ? '♥' : '♡'}</span>
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-cream/10 text-cream hover:bg-brass hover:text-ink transition text-sm"
            title="Exit Slideshow (Esc)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Main Image Stage with Ken Burns Smooth Pan/Zoom */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4">
        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-ink/60 text-cream hover:bg-brass hover:text-ink transition border border-cream/15 backdrop-blur-sm text-lg"
          title="Previous frame (Left arrow)"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-ink/60 text-cream hover:bg-brass hover:text-ink transition border border-cream/15 backdrop-blur-sm text-lg"
          title="Next frame (Right arrow)"
        >
          ›
        </button>

        {/* Hero Photo with Ken Burns slow scale */}
        <div className="relative max-h-[80vh] max-w-full overflow-hidden rounded shadow-2xl">
          <img
            key={currentProof.id}
            src={currentProof.image}
            alt={currentProof.title}
            className={cn(
              'max-h-[80vh] w-auto object-contain transition-all duration-[6000ms] ease-out',
              zoomPhase ? 'scale-105 translate-y-[-0.5%]' : 'scale-100',
            )}
          />

          {/* Discreet Studio Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25">
            <span className="rotate-[-30deg] font-display text-xs uppercase tracking-[0.3em] text-cream drop-shadow-md border border-cream/40 px-4 py-1 bg-ink/40">
              ✦ HERITAGE ARCHIVAL EXHIBITION · PRIVATE REVIEW
            </span>
          </div>

          {/* FLOATING VOICE CAPSULE TOAST ON THIS FRAME */}
          {activeVoiceCapsule && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
              <button
                type="button"
                onClick={toggleVoicePlayback}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2 backdrop-blur-md shadow-2xl transition-all duration-300 ${
                  isPlayingVoice
                    ? 'border-brass bg-brass text-ink scale-105 font-medium'
                    : 'border-brass/70 bg-black/75 text-cream hover:border-brass hover:bg-black/90'
                }`}
              >
                <span className="flex h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs">
                  {isPlayingVoice ? '⏸ Playing Voice Capsule' : '🎙️ Listen to Memory Capsule'}
                </span>
                <span className="font-mono text-[11px] opacity-80">
                  {isPlayingVoice
                    ? `(0:${voicePlaybackSeconds.toString().padStart(2, '0')})`
                    : `(${activeVoiceCapsule.durationSeconds}s)`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls & Metadata Bar */}
      <div className="z-20 px-6 py-4 bg-gradient-to-t from-[#080809]/95 via-[#080809]/80 to-transparent">
        <div className="mx-auto max-w-site flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-brass font-medium">
                {currentProof.category} · {currentProof.code}
              </p>
              {activeVoiceCapsule && (
                <span className="bg-brass/20 text-brass text-[9px] uppercase px-1.5 py-0.5 rounded font-medium">
                  🎙️ Voice Memo Attached
                </span>
              )}
            </div>
            <h4 className="font-display text-xl sm:text-2xl text-cream font-medium">
              {currentProof.title}
            </h4>
            <p className="mt-0.5 text-xs text-cream/60 font-mono">
              {currentProof.exif}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-cream/70 tracking-wider">
              {currentIndex + 1} / {proofs.length}
            </span>
            <div className="h-1.5 w-32 rounded-full bg-cream/15 overflow-hidden">
              <div
                className="h-full bg-brass transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / proofs.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-cream/40 uppercase tracking-widest hidden lg:inline">
              [Space] Pause · [V] Voice Capsule · [Esc] Exit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
