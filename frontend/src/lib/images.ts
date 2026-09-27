export const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1920&q=85',
  about: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
  cta: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80',
  login: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
  register: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  fallback: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
  featured: [
    {
      src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
      alt: 'Royal Indian wedding ceremony',
      className: 'md:col-span-8 aspect-[16/10]',
    },
    {
      src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      alt: 'Traditional bridal silk editorial',
      className: 'md:col-span-4 aspect-[4/5]',
    },
    {
      src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      alt: 'Leadership studio portrait',
      className: 'md:col-span-4 aspect-[4/5]',
    },
    {
      src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
      alt: 'Pre-wedding sunset romance',
      className: 'md:col-span-8 aspect-[16/10]',
    },
  ],
}

// Explicit mappings for male and female photographers
export const PHOTOGRAPHER_PORTRAITS: Record<string, string> = {
  // Male Photographers (Aarav Sharma, Rohan Kapoor, Vikramaditya Roy, Kabir Malhotra)
  'photo-1': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80', // Aarav Sharma (Male)
  'photo-2': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', // Rohan Kapoor (Male)
  'photo-6': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80', // Vikramaditya Roy (Male)
  'photo-7': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80', // Kabir Malhotra (Male)

  // Female Photographers (Ananya Iyer, Priya Nair, Meera Deshmukh, Diya Sengupta)
  'photo-3': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', // Ananya Iyer (Female)
  'photo-4': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80', // Priya Nair (Female)
  'photo-5': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80', // Meera Deshmukh (Female)
  'photo-8': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80', // Diya Sengupta (Female)
}

const MALE_PORTRAITS = [
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
]

const FEMALE_PORTRAITS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
]

export function portraitForId(id: string, name?: string): string {
  if (PHOTOGRAPHER_PORTRAITS[id]) {
    return PHOTOGRAPHER_PORTRAITS[id]
  }

  // Determine gender by common female first names
  const lowerName = (name || id || '').toLowerCase()
  const isFemale =
    lowerName.includes('ananya') ||
    lowerName.includes('priya') ||
    lowerName.includes('meera') ||
    lowerName.includes('diya') ||
    lowerName.includes('pooja') ||
    lowerName.includes('shreya') ||
    lowerName.includes('neha') ||
    lowerName.includes('female')

  const list = isFemale ? FEMALE_PORTRAITS : MALE_PORTRAITS
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % list.length
  return list[index]
}
