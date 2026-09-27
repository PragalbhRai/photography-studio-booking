import { useState, useRef, useEffect } from 'react'
import type { ProofFrame } from './ProofingGallery'
import {
  type VoiceCapsule,
  getStoredVoiceCapsules,
  saveVoiceCapsule,
  deleteVoiceCapsule,
  playVoiceCapsuleAudio,
} from '@/lib/soundtrack'
import { Button } from '@/components/ui/Button'

interface VoiceCapsuleModalProps {
  proof: ProofFrame | null
  isOpen: boolean
  onClose: () => void
  onCapsuleUpdated?: () => void
}

export function VoiceCapsuleModal({
  proof,
  isOpen,
  onClose,
  onCapsuleUpdated,
}: VoiceCapsuleModalProps) {
  const [capsules, setCapsules] = useState<VoiceCapsule[]>([])
  const [playingCapsuleId, setPlayingCapsuleId] = useState<string | null>(null)
  const [activePlaybackSeconds, setActivePlaybackSeconds] = useState(0)

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [recordingTitle, setRecordingTitle] = useState('')
  const [recordingTranscript, setRecordingTranscript] = useState('')
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null)
  const [showRecorder, setShowRecorder] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<any>(null)
  const playbackControllerRef = useRef<{ stop: () => void } | null>(null)

  // Load capsules when modal opens or proof changes
  useEffect(() => {
    if (isOpen && proof) {
      const all = getStoredVoiceCapsules()
      setCapsules(all.filter((c) => c.proofId === proof.id))
      setShowRecorder(false)
      setIsRecording(false)
      setPlayingCapsuleId(null)
    }
  }, [isOpen, proof])

  // Stop playback when unmounting or closing
  useEffect(() => {
    return () => {
      if (playbackControllerRef.current) {
        playbackControllerRef.current.stop()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  if (!isOpen || !proof) return null

  // Play a capsule
  const handlePlayCapsule = (capsule: VoiceCapsule) => {
    if (playingCapsuleId === capsule.id) {
      if (playbackControllerRef.current) {
        playbackControllerRef.current.stop()
      }
      setPlayingCapsuleId(null)
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    if (playbackControllerRef.current) {
      playbackControllerRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)

    setPlayingCapsuleId(capsule.id)
    setActivePlaybackSeconds(0)

    timerRef.current = setInterval(() => {
      setActivePlaybackSeconds((sec) => {
        if (sec >= capsule.durationSeconds) {
          clearInterval(timerRef.current)
          return capsule.durationSeconds
        }
        return sec + 1
      })
    }, 1000)

    const controller = playVoiceCapsuleAudio(capsule, () => {
      setPlayingCapsuleId(null)
      setActivePlaybackSeconds(0)
      if (timerRef.current) clearInterval(timerRef.current)
    })
    playbackControllerRef.current = controller
  }

  // Start Mic Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.readAsDataURL(audioBlob)
        reader.onloadend = () => {
          setRecordedAudioUri(reader.result as string)
        }
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingSeconds(0)

      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1)
      }, 1000)
    } catch {
      // If mic is denied or not supported, allow voice note memo typing
      setIsRecording(true)
      setRecordingSeconds(0)
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1)
      }, 1000)
    }
  }

  // Stop Mic Recording
  const stopRecording = () => {
    setIsRecording(false)
    if (timerRef.current) clearInterval(timerRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  // Save new capsule
  const handleSaveRecordedCapsule = () => {
    if (!recordingTranscript.trim() && !recordedAudioUri) return

    const newCapsule: VoiceCapsule = {
      id: `vc-${Date.now()}`,
      proofId: proof.id,
      authorName: 'Patron Voice Note',
      role: 'client',
      title: recordingTitle || 'Patron Memory & Reflection',
      transcript: recordingTranscript || 'Voice memo recorded during client sitting review.',
      durationSeconds: Math.max(recordingSeconds, 5),
      audioDataUri: recordedAudioUri || undefined,
      createdAt: new Date().toISOString(),
    }

    saveVoiceCapsule(newCapsule)
    const updated = getStoredVoiceCapsules().filter((c) => c.proofId === proof.id)
    setCapsules(updated)
    setShowRecorder(false)
    setRecordingTitle('')
    setRecordingTranscript('')
    setRecordedAudioUri(null)
    setRecordingSeconds(0)
    if (onCapsuleUpdated) onCapsuleUpdated()
  }

  const handleDeleteCapsule = (id: string) => {
    deleteVoiceCapsule(id)
    const updated = getStoredVoiceCapsules().filter((c) => c.proofId === proof.id)
    setCapsules(updated)
    if (onCapsuleUpdated) onCapsuleUpdated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl border border-brass/40 bg-[#0e0d0c] text-cream shadow-2xl">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 rounded-full bg-brass animate-pulse" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-brass">
                Audio-Visual Memory Capsule
              </p>
              <h2 className="font-display text-xl">{proof.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-white/60 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-12">
          {/* Left Column: Photograph Display */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center bg-black/40 p-3 border border-white/5">
            <img
              src={proof.image}
              alt={proof.title}
              className="max-h-[360px] w-auto object-contain shadow-2xl"
            />
            <div className="mt-3 text-center">
              <span className="font-mono text-xs text-brass">{proof.code}</span>
              <p className="mt-0.5 text-[11px] text-white/50">{proof.exif}</p>
            </div>
          </div>

          {/* Right Column: Voice Capsules List & Recorder */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Attached Voice Memories ({capsules.length})
                </span>
                {!showRecorder && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowRecorder(true)}
                    className="border-brass/40 text-brass hover:bg-brass/10"
                  >
                    🎙️ Record Memory
                  </Button>
                )}
              </div>

              {/* Capsules List */}
              <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {capsules.length === 0 ? (
                  <div className="py-8 text-center text-xs text-white/40">
                    <p>No voice capsules attached to this frame yet.</p>
                    <p className="mt-1">
                      Record a personal memory, vow excerpt, or director behind-the-scenes story.
                    </p>
                  </div>
                ) : (
                  capsules.map((capsule) => {
                    const isCurrentPlaying = playingCapsuleId === capsule.id
                    return (
                      <div
                        key={capsule.id}
                        className={`border p-4 transition ${
                          isCurrentPlaying
                            ? 'border-brass bg-brass/10 shadow-lg'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-medium ${
                                  capsule.role === 'photographer'
                                    ? 'bg-brass/20 text-brass'
                                    : 'bg-emerald-950 text-emerald-300'
                                }`}
                              >
                                {capsule.role === 'photographer'
                                  ? 'Director BTS Note'
                                  : 'Patron Voice Note'}
                              </span>
                              <span className="text-xs font-semibold text-cream">
                                {capsule.authorName}
                              </span>
                            </div>
                            <h4 className="mt-1 text-sm font-medium text-cream">{capsule.title}</h4>
                            <p className="mt-1 text-xs text-white/70 italic leading-relaxed">
                              "{capsule.transcript}"
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePlayCapsule(capsule)}
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-brass bg-brass/20 text-brass transition hover:scale-105 hover:bg-brass hover:text-black"
                            title={isCurrentPlaying ? 'Pause' : 'Play Voice Memo'}
                          >
                            {isCurrentPlaying ? '⏸' : '▶'}
                          </button>
                        </div>

                        {/* Animated Waveform when playing */}
                        {isCurrentPlaying && (
                          <div className="mt-3 flex items-center gap-2 border-t border-brass/30 pt-2 text-xs text-brass">
                            <div className="flex items-center gap-1 h-3">
                              <span className="w-1 bg-brass animate-pulse h-2" />
                              <span className="w-1 bg-brass animate-pulse h-3" />
                              <span className="w-1 bg-brass animate-pulse h-1.5" />
                              <span className="w-1 bg-brass animate-pulse h-3" />
                              <span className="w-1 bg-brass animate-pulse h-2" />
                            </div>
                            <span className="font-mono text-[10px]">
                              0:
                              {activePlaybackSeconds.toString().padStart(2, '0')} / 0:
                              {capsule.durationSeconds.toString().padStart(2, '0')}
                            </span>
                            <span className="text-[10px] text-white/50 italic">
                              (Background soundtrack ducked)
                            </span>
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
                          <span>{capsule.durationSeconds}s duration</span>
                          {capsule.role === 'client' && (
                            <button
                              onClick={() => handleDeleteCapsule(capsule.id)}
                              className="text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Recorder Pane */}
            {showRecorder && (
              <div className="border border-brass/50 bg-[#161412] p-4 text-cream animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isRecording ? 'bg-red-500 animate-ping' : 'bg-brass'
                      }`}
                    />
                    <span className="text-xs uppercase tracking-wider text-brass font-medium">
                      {isRecording ? 'Recording Live Voice Memo...' : 'Record Voice Capsule'}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-white/70">
                    0:{recordingSeconds.toString().padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Memory Title (e.g. The Vow Exchange, First Giggle)"
                    value={recordingTitle}
                    onChange={(e) => setRecordingTitle(e.target.value)}
                    className="w-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-cream focus:border-brass focus:outline-none"
                  />
                  <textarea
                    placeholder="Spoken words / Transcription note (e.g. 'I remember the sound of the courtyard fountain...')"
                    rows={2}
                    value={recordingTranscript}
                    onChange={(e) => setRecordingTranscript(e.target.value)}
                    className="w-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-cream focus:border-brass focus:outline-none"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 transition flex items-center gap-1.5"
                      >
                        <span>🔴</span> Record
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="rounded bg-white/20 px-3 py-1 text-xs text-cream hover:bg-white/30 transition flex items-center gap-1.5"
                      >
                        <span>⏹</span> Stop Recording
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowRecorder(false)}
                      className="px-2 py-1 text-xs text-white/50 hover:text-white"
                    >
                      Cancel
                    </button>
                    <Button
                      size="sm"
                      onClick={handleSaveRecordedCapsule}
                      disabled={isRecording || (!recordingTranscript.trim() && !recordedAudioUri)}
                    >
                      Save to Photo
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-[11px] text-white/40">
                Voice capsules auto-sync with the Cinematic Slideshow.
              </span>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
