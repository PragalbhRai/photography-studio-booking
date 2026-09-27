import { createFileRoute } from '@tanstack/react-router'
import { VirtualLightingStudio } from '@/components/studio/VirtualLightingStudio'
import { Reveal } from '@/components/ui/Reveal'

export const Route = createFileRoute('/studio-lighting')({
  component: StudioLightingPage,
})

function StudioLightingPage() {
  return (
    <div className="mx-auto max-w-site px-5 py-12 md:px-8 md:py-20">
      <Reveal>
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">
            Research & Technology Lab
          </p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl text-ink">
            Virtual 3D Lighting Studio
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-mute">
            Explore how our Hasselblad master photographers shape shadow and highlight across different portrait genres. Drag strobes around the subject in real-time or switch between iconic patterns like Rembrandt, Butterfly, and Split.
          </p>
        </div>
      </Reveal>

      <VirtualLightingStudio />
    </div>
  )
}
