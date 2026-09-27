import { MOODBOARD_PRESETS } from '@/lib/moodboards'
import { cn } from '@/lib/cn'

interface Props {
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function MoodboardSelector({ selectedId, onSelect }: Props) {
  return (
    <div className="border border-line bg-paper p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-brass">Creative Direction</p>
          <h3 className="mt-1 font-display text-2xl text-ink">Visual Aesthetic & Palette</h3>
        </div>
        {selectedId ? (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="text-[11px] text-mute hover:text-ink underline transition"
          >
            Clear selection
          </button>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-mute">
        Select a creative aesthetic for your shoot. Our lighting directors and colorists will tune their lights and grades to this lookbook.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MOODBOARD_PRESETS.map((preset) => {
          const isSelected = selectedId === preset.id
          return (
            <div
              key={preset.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(isSelected ? null : preset.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(isSelected ? null : preset.id)
                }
              }}
              className={cn(
                'group relative flex flex-col justify-between overflow-hidden rounded border p-4 text-left transition cursor-pointer select-none',
                isSelected
                  ? 'border-brass bg-cream ring-1 ring-brass shadow-sm'
                  : 'border-line bg-cream/50 hover:border-ink/40 hover:bg-cream',
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-mute">
                    {preset.category}
                  </span>
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-brass">
                      <span>✓</span> Selected
                    </span>
                  ) : null}
                </div>

                <p className="mt-1.5 font-display text-lg font-medium text-ink">
                  {preset.name}
                </p>
                <p className="mt-1 text-xs text-mute leading-relaxed">
                  {preset.tagline}
                </p>

                {/* Color Palette Swatches */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-mute">Palette:</span>
                  <div className="flex items-center -space-x-1">
                    {preset.palette.map((color) => (
                      <span
                        key={color.name}
                        className="inline-block h-4 w-4 rounded-full border border-ink/20 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Collapsible details on selected */}
              {isSelected ? (
                <div className="mt-3.5 border-t border-line/60 pt-3 text-[11px] text-mute space-y-1">
                  <p>
                    <strong className="text-ink font-medium">Lighting:</strong> {preset.lightingStyle}
                  </p>
                  <p>
                    <strong className="text-ink font-medium">Wardrobe Advice:</strong> {preset.wardrobeAdvice}
                  </p>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
