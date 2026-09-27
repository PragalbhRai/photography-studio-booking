/**
 * Web Audio API procedural luxury soundscape generator
 * and Voice Capsule memory management engine.
 */

export interface VoiceCapsule {
  id: string
  proofId: string
  authorName: string
  role: 'photographer' | 'client' | 'family'
  title: string
  transcript: string
  durationSeconds: number
  audioDataUri?: string // base64 recorded audio or synthesized audio
  createdAt: string
}

export type SoundscapeMood = 'strings' | 'piano' | 'ethereal' | 'off'

export interface SoundtrackTrack {
  id: SoundscapeMood
  title: string
  subtitle: string
  tempo: string
  key: string
  description: string
}

export const SOUNDTRACK_TRACKS: SoundtrackTrack[] = [
  {
    id: 'strings',
    title: 'Palace Grandeur',
    subtitle: 'Acoustic Strings & Cello Drone',
    tempo: 'Adagio · 64 BPM',
    key: 'D Minor',
    description: 'Rich, cinematic warmth tailored for heritage palaces, royal weddings, and timeless celebrations.',
  },
  {
    id: 'piano',
    title: 'Golden Hour Reverie',
    subtitle: 'Warm Intimate Piano & Reverberance',
    tempo: 'Lento · 72 BPM',
    key: 'F Major',
    description: 'Poetic, gentle piano harmonics ideal for intimate portraits, maternity milestones, and fine art.',
  },
  {
    id: 'ethereal',
    title: 'Vogue Twilight',
    subtitle: 'Atmospheric Analog Ambient Synthesizer',
    tempo: 'Andante · 80 BPM',
    key: 'A Major',
    description: 'Sophisticated modern soundscape for high-fashion lookbooks and architectural geometries.',
  },
]

// Default pre-loaded voice capsules for demo proofs
export const DEFAULT_VOICE_CAPSULES: VoiceCapsule[] = [
  {
    id: 'vc-1',
    proofId: 'proof-1',
    authorName: 'Aarav Sharma',
    role: 'photographer',
    title: 'Director BTS: Catching the Crimson Veil',
    transcript:
      'We had exactly an 8-second window when the desert wind swept through the palace courtyard. The Hasselblad 100mm captured the silk in mid-flight with zero motion blur.',
    durationSeconds: 14,
    createdAt: '2026-09-21T16:30:00Z',
  },
  {
    id: 'vc-2',
    proofId: 'proof-1',
    authorName: 'Maharani Gayatri Singh',
    role: 'client',
    title: 'Patron Memory: The Royal Courtyard',
    transcript:
      'I remember stepping into the courtyard right as the flute players started in the distance. The sunlight felt so warm on my shoulders.',
    durationSeconds: 11,
    createdAt: '2026-09-21T18:15:00Z',
  },
  {
    id: 'vc-3',
    proofId: 'proof-2',
    authorName: 'Aarav Sharma',
    role: 'photographer',
    title: 'Architectural Framing Geometry',
    transcript:
      'Positioned the Leica M11 right along the central axis of the 300-year-old sandstone arch. The natural ambient rim light separated the silhouette flawlessly.',
    durationSeconds: 12,
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'vc-4',
    proofId: 'proof-8',
    authorName: 'Aarav Sharma',
    role: 'photographer',
    title: 'Sunset Stepwell Golden Halo',
    transcript:
      'Shot at 5:48 PM during the final seven minutes of golden hour. The sunlight bounced off the water reservoir to create a natural spherical halo.',
    durationSeconds: 13,
    createdAt: '2026-09-23T17:50:00Z',
  },
]

const CAPSULES_STORAGE_KEY = 'studio_proof_voice_capsules'

export function getStoredVoiceCapsules(): VoiceCapsule[] {
  try {
    const raw = localStorage.getItem(CAPSULES_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(DEFAULT_VOICE_CAPSULES))
      return DEFAULT_VOICE_CAPSULES
    }
    const parsed = JSON.parse(raw) as VoiceCapsule[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_VOICE_CAPSULES
  } catch {
    return DEFAULT_VOICE_CAPSULES
  }
}

export function saveVoiceCapsule(capsule: VoiceCapsule): void {
  const current = getStoredVoiceCapsules()
  const updated = [capsule, ...current]
  localStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(updated))
}

export function deleteVoiceCapsule(id: string): void {
  const current = getStoredVoiceCapsules()
  const updated = current.filter((c) => c.id !== id)
  localStorage.setItem(CAPSULES_STORAGE_KEY, JSON.stringify(updated))
}

/* ==========================================================================
   WEB AUDIO API PROCEDURAL SOUNDSCAPE ENGINE
   Synthesizes lush ambient cinematic music in real-time with zero external files
   ========================================================================== */

class SoundscapeEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private duckGain: GainNode | null = null
  private activeOscillators: OscillatorNode[] = []
  private isPlaying = false
  private currentMood: SoundscapeMood = 'strings'
  private loopInterval: any = null

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.duckGain = this.ctx.createGain()

      // Connect: oscillators -> duckGain -> masterGain -> destination
      this.duckGain.connect(this.masterGain)
      this.masterGain.connect(this.ctx.destination)

      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime)
      this.duckGain.gain.setValueAtTime(1.0, this.ctx.currentTime)
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
  }

  public play(mood: SoundscapeMood = 'strings') {
    this.initContext()
    if (!this.ctx || !this.duckGain) return

    this.stop()
    this.currentMood = mood
    this.isPlaying = true

    if (mood === 'off') {
      this.isPlaying = false
      return
    }

    // Configure chord frequencies based on mood
    // D Minor for Strings: D2, A2, D3, F3, A3
    // F Major for Piano: F2, C3, A3, C4, E4
    // A Major for Ethereal: A2, E3, A3, C#4, E4
    let baseNotes: number[] = []
    if (mood === 'strings') {
      baseNotes = [73.42, 110.0, 146.83, 174.61, 220.0] // D2, A2, D3, F3, A3
    } else if (mood === 'piano') {
      baseNotes = [87.31, 130.81, 174.61, 220.0, 261.63] // F2, C3, F3, A3, C4
    } else {
      baseNotes = [110.0, 164.81, 220.0, 277.18, 329.63] // A2, E3, A3, C#4, E4
    }

    // Create lush multi-voice drone with gentle low-pass filter
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(mood === 'strings' ? 650 : mood === 'piano' ? 950 : 1200, this.ctx.currentTime)
    filter.connect(this.duckGain)

    baseNotes.forEach((freq, idx) => {
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()

      // Waveform type
      osc.type = mood === 'strings' ? 'sawtooth' : mood === 'piano' ? 'sine' : 'triangle'
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime)

      // Slight detune for analog warmth
      const detuneCents = (idx % 2 === 0 ? 1 : -1) * (idx * 3.5)
      osc.detune.setValueAtTime(detuneCents, this.ctx.currentTime)

      // Volume envelope per harmonic
      const noteGain = 0.08 / (idx + 1)
      oscGain.gain.setValueAtTime(noteGain, this.ctx.currentTime)

      // Connect
      osc.connect(oscGain)
      oscGain.connect(filter)
      osc.start()
      this.activeOscillators.push(osc)
    })

    // Gentle rhythmic pulsing envelope every 4-5 seconds
    const intervalTime = mood === 'strings' ? 4800 : mood === 'piano' ? 3800 : 5400
    this.loopInterval = setInterval(() => {
      if (!this.ctx || !this.duckGain || !this.isPlaying) return
      const now = this.ctx.currentTime
      filter.frequency.linearRampToValueAtTime(filter.frequency.value + 180, now + 1.8)
      filter.frequency.linearRampToValueAtTime(filter.frequency.value, now + 3.6)
    }, intervalTime)
  }

  public stop() {
    this.isPlaying = false
    if (this.loopInterval) {
      clearInterval(this.loopInterval)
      this.loopInterval = null
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop()
        osc.disconnect()
      } catch {
        // already stopped
      }
    })
    this.activeOscillators = []
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, volume))
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime)
    }
  }

  // Audio ducking when voice memo is played
  public duck() {
    if (this.duckGain && this.ctx) {
      this.duckGain.gain.cancelScheduledValues(this.ctx.currentTime)
      this.duckGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.4)
    }
  }

  public unduck() {
    if (this.duckGain && this.ctx) {
      this.duckGain.gain.cancelScheduledValues(this.ctx.currentTime)
      this.duckGain.gain.linearRampToValueAtTime(1.0, this.ctx.currentTime + 0.8)
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying
  }

  public getCurrentMood(): SoundscapeMood {
    return this.currentMood
  }
}

export const studioSoundscape = new SoundscapeEngine()

/* ==========================================================================
   VOICE CAPSULE PLAYBACK SIMULATOR (WITH DUCKING)
   Plays voice audio memo or procedural speech acoustic tone with ducking
   ========================================================================== */

export function playVoiceCapsuleAudio(
  capsule: VoiceCapsule,
  onEnded: () => void,
): { stop: () => void } {
  // Duck background music immediately
  studioSoundscape.duck()

  // If a real audio data URI exists (e.g. from user mic recording)
  if (capsule.audioDataUri) {
    const audio = new Audio(capsule.audioDataUri)
    audio.play().catch(() => {})
    audio.onended = () => {
      studioSoundscape.unduck()
      onEnded()
    }
    return {
      stop: () => {
        audio.pause()
        studioSoundscape.unduck()
      },
    }
  }

  // Otherwise, use browser Web SpeechSynthesis if available, or procedural acoustic memo chime
  if ('speechSynthesis' in window && capsule.transcript) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(capsule.transcript)
    utterance.rate = 0.95
    utterance.pitch = capsule.role === 'photographer' ? 0.9 : 1.05

    utterance.onend = () => {
      studioSoundscape.unduck()
      onEnded()
    }
    utterance.onerror = () => {
      studioSoundscape.unduck()
      onEnded()
    }

    window.speechSynthesis.speak(utterance)

    return {
      stop: () => {
        window.speechSynthesis.cancel()
        studioSoundscape.unduck()
      },
    }
  }

  // Fallback: procedural timer
  const timer = setTimeout(() => {
    studioSoundscape.unduck()
    onEnded()
  }, (capsule.durationSeconds || 8) * 1000)

  return {
    stop: () => {
      clearTimeout(timer)
      studioSoundscape.unduck()
    },
  }
}
