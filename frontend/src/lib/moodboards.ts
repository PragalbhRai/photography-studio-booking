export interface AestheticMoodboard {
  id: string
  name: string
  tagline: string
  category: string
  sampleImage: string
  palette: { name: string; hex: string }[]
  lightingStyle: string
  wardrobeAdvice: string
  suggestedProps: string[]
}

export const MOODBOARD_PRESETS: AestheticMoodboard[] = [
  {
    id: 'royal-opulence',
    name: 'Royal Heritage & Opulence',
    tagline: 'Deep jewel tones, warm gold accents, and imperial palace grandeur.',
    category: 'Weddings & Celebrations',
    sampleImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    palette: [
      { name: 'Burgundy Wine', hex: '#681B23' },
      { name: 'Imperial Gold', hex: '#D4AF37' },
      { name: 'Midnight Navy', hex: '#1B2A4A' },
      { name: 'Silk Ivory', hex: '#F7F2E8' },
    ],
    lightingStyle: 'Chiaroscuro Rembrandt directional lighting with warm tungsten kicker rim.',
    wardrobeAdvice: 'Heavy silk, raw zardozi embroidery, velvet textures, and antique heritage jewelry.',
    suggestedProps: ['Brass candelabras', 'Handmade vintage carpets', 'Heritage florals'],
  },
  {
    id: 'cinematic-editorial',
    name: 'Cinematic Editorial & Shadow',
    tagline: 'Sharp architectural lines, sculpted shadows, and 35mm film grain tone.',
    category: 'Portraits & Fashion',
    sampleImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    palette: [
      { name: 'Obsidian Noir', hex: '#1C1C1E' },
      { name: 'Tuscan Amber', hex: '#C2884A' },
      { name: 'Cool Slate', hex: '#5A6B7C' },
      { name: 'Bone White', hex: '#EAE6DF' },
    ],
    lightingStyle: 'High-contrast grid honeycomb beauty dish with dramatic feather falloff.',
    wardrobeAdvice: 'Structured tailoring, oversized power blazers, monochrome layers, and leather.',
    suggestedProps: ['Brutalist concrete plinths', 'Framed glass prisms', 'Minimalist stool'],
  },
  {
    id: 'ethereal-pastel',
    name: 'Ethereal Romance & Pastels',
    tagline: 'Diffused morning glow, gentle pastel haze, and luminous porcelain skin tones.',
    category: 'Couples & Maternity',
    sampleImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    palette: [
      { name: 'Dusty Rose', hex: '#E2B8BB' },
      { name: 'Sage Leaf', hex: '#B8CDB8' },
      { name: 'Warm Alabaster', hex: '#FBF7EE' },
      { name: 'Champagne Taupe', hex: '#C9B6A1' },
    ],
    lightingStyle: 'Oversized 7-foot parabolic diffusion umbrella with warm ambient fill.',
    wardrobeAdvice: 'Flowing sheer chiffons, unbleached organic linen, and pastel color harmonies.',
    suggestedProps: ['Delicate dried florals', 'Silk tulle swaths', 'Handmade ceramic urns'],
  },
  {
    id: 'monochrome-fineart',
    name: 'Fine-Art Monochrome Noir',
    tagline: 'Timeless black-and-white tonal gradations capturing pure soul and emotion.',
    category: 'Fine Art & Headshots',
    sampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    palette: [
      { name: 'Carbon Black', hex: '#0B0B0C' },
      { name: 'Deep Charcoal', hex: '#343438' },
      { name: 'Silver Halide', hex: '#9E9EA4' },
      { name: 'Pure Paper', hex: '#F9F9FA' },
    ],
    lightingStyle: 'Hard directional fresnel key with negative fill flags for deep specular contrast.',
    wardrobeAdvice: 'High-contrast solids (deep black turtleneck, crisp white poplin shirt, heavy knits).',
    suggestedProps: ['Solid dark canvas backdrop', 'Wood director chair', 'Vintage 35mm rangefinder'],
  },
]
