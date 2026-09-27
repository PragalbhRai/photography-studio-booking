import { DEMO_PACKAGES, DEMO_PHOTOGRAPHERS } from './mock-data'
import { PHOTOGRAPHER_GEAR } from './photographer-gear'
import { formatPrice } from './format'

export interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  timestamp: string
  actionCard?: {
    type: 'package' | 'harmonizer' | 'shotlist' | 'gear'
    packageId?: string
    packageName?: string
    packagePrice?: number
    photographerId?: string
    photographerName?: string
    buttonText?: string
    linkUrl?: string
    palette?: string[]
    shotListItems?: string[]
  }
}

export function generateConciergeReply(userMessage: string): ChatMessage {
  const lower = userMessage.toLowerCase().trim()
  const id = 'msg-' + Date.now()
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // 1. Wedding / Royal Ceremony matching
  if (lower.includes('wedding') || lower.includes('ceremony') || lower.includes('mandap') || lower.includes('shaadi') || lower.includes('sangeet')) {
    const pkg = DEMO_PACKAGES.find((p) => p.id === 'pkg-1') || DEMO_PACKAGES[0]
    const photog = DEMO_PHOTOGRAPHERS.find((p) => p.id === 'photo-1') || DEMO_PHOTOGRAPHERS[0]

    return {
      id,
      sender: 'ai',
      text: `For grand celebrations and ceremonies, our signature recommendation is **${pkg.name}** led by master artist **${photog.full_name}**.\n\nAarav captures on **Hasselblad 100-Megapixel Medium Format** with 16-bit color depth, ensuring every weave of silk zardozi and heirloom jewelry is captured with archival fidelity. We also recommend pairing this with our **Licensed Drone Cinematographer** add-on for courtyard perspectives.`,
      timestamp,
      actionCard: {
        type: 'package',
        packageId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price,
        photographerId: photog.id,
        photographerName: photog.full_name,
        buttonText: `Book ${pkg.name} (${formatPrice(pkg.price)})`,
        linkUrl: `/book?packageId=${pkg.id}&photographerId=${photog.id}`,
      },
    }
  }

  // 2. Pre-wedding / Couple / Romance / Sunset / Golden Hour
  if (lower.includes('pre-wedding') || lower.includes('couple') || lower.includes('engagement') || lower.includes('golden hour') || lower.includes('sunset')) {
    const pkg = DEMO_PACKAGES.find((p) => p.id === 'pkg-4') || DEMO_PACKAGES[3]
    const photog = DEMO_PHOTOGRAPHERS.find((p) => p.id === 'photo-2') || DEMO_PHOTOGRAPHERS[1]

    return {
      id,
      sender: 'ai',
      text: `For cinematic couple stories, I recommend our **${pkg.name}** with **${photog.full_name}**.\n\nOur system automatically highlights our **✨ Golden Hour slots (04:00 PM – 05:30 PM)** during booking, maximizing the warm natural rim light across Mumbai's historic heritage district.`,
      timestamp,
      actionCard: {
        type: 'package',
        packageId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price,
        photographerId: photog.id,
        photographerName: photog.full_name,
        buttonText: `Reserve Golden Hour Session (${formatPrice(pkg.price)})`,
        linkUrl: `/book?packageId=${pkg.id}&photographerId=${photog.id}`,
      },
    }
  }

  // 3. Portraits / Headshots / Corporate / Executive
  if (lower.includes('portrait') || lower.includes('headshot') || lower.includes('executive') || lower.includes('linkedin') || lower.includes('founder')) {
    const pkg = DEMO_PACKAGES.find((p) => p.id === 'pkg-5') || DEMO_PACKAGES[4]
    const photog = DEMO_PHOTOGRAPHERS.find((p) => p.id === 'photo-3') || DEMO_PHOTOGRAPHERS[2]

    return {
      id,
      sender: 'ai',
      text: `For leadership profiles and personal branding, our **${pkg.name}** with **${photog.full_name}** is the gold standard.\n\nIncludes 30+ retouched deliverables, camera tethering to high-res calibrated displays, and an optional 48-Hour Priority Express Vault delivery for urgent press releases.`,
      timestamp,
      actionCard: {
        type: 'package',
        packageId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price,
        photographerId: photog.id,
        photographerName: photog.full_name,
        buttonText: `Book Executive Portrait (${formatPrice(pkg.price)})`,
        linkUrl: `/book?packageId=${pkg.id}&photographerId=${photog.id}`,
      },
    }
  }

  // 4. Fashion / Editorial / Runway / Lookbook
  if (lower.includes('fashion') || lower.includes('editorial') || lower.includes('designer') || lower.includes('couture') || lower.includes('lookbook')) {
    const pkg = DEMO_PACKAGES.find((p) => p.id === 'pkg-7') || DEMO_PACKAGES[6]
    const photog = DEMO_PHOTOGRAPHERS.find((p) => p.id === 'photo-4') || DEMO_PHOTOGRAPHERS[3]

    return {
      id,
      sender: 'ai',
      text: `For couture designers and fashion houses, our **${pkg.name}** led by **${photog.full_name}** provides full creative studio production.\n\nIncludes 35mm & 120 film profiles, high-speed Broncolor lighting, model posing coaching, and 150+ master retouched lookbook finals.`,
      timestamp,
      actionCard: {
        type: 'package',
        packageId: pkg.id,
        packageName: pkg.name,
        packagePrice: pkg.price,
        photographerId: photog.id,
        photographerName: photog.full_name,
        buttonText: `Book Fashion Editorial (${formatPrice(pkg.price)})`,
        linkUrl: `/book?packageId=${pkg.id}&photographerId=${photog.id}`,
      },
    }
  }

  // 5. Wardrobe / Color harmony / Dress code
  if (lower.includes('wardrobe') || lower.includes('wear') || lower.includes('color') || lower.includes('outfit') || lower.includes('dress') || lower.includes('clothes')) {
    return {
      id,
      sender: 'ai',
      text: `Here is our master color theory guidance for studio camera sensors:\n\n✦ **Fabrics that shine**: Raw silk, heavy velvet, unbleached linen, structured wool, and jacquard textures.\n✦ **Colors**: Jewel tones (burgundy, emerald, midnight navy), warm terracotta, or clean ivory.\n✦ **Avoid**: Tight micro-houndstooth or fine pinstripes (causes digital sensor moiré). Bring 2 to 3 pressed outfits on wooden hangers.`,
      timestamp,
      actionCard: {
        type: 'harmonizer',
        buttonText: 'View Studio Prep Guide on Dashboard',
        linkUrl: '/dashboard',
        palette: ['#681B23', '#D4AF37', '#1B2A4A', '#F7F2E8', '#5A6B7C'],
      },
    }
  }

  // 6. Camera gear / Equipment / Hasselblad / Leica
  if (lower.includes('gear') || lower.includes('camera') || lower.includes('lens') || lower.includes('hasselblad') || lower.includes('leica') || lower.includes('sensor')) {
    const aaravGear = PHOTOGRAPHER_GEAR['photo-1']
    return {
      id,
      sender: 'ai',
      text: `At Northlight Studio, we capture exclusively on museum-grade medium format and German optical systems:\n\n• **Flagship Body**: ${aaravGear.gear[0].name} (${aaravGear.gear[0].specs})\n• **Candid Rangefinder**: ${aaravGear.gear[1].name}\n• **Master Primes**: Hasselblad HC 100mm f/2.2 & Leica Summilux 50mm f/1.4\n• **Lighting**: Profoto Pro-11 2400Ws studio packs with Broncolor Para 133cm reflectors.`,
      timestamp,
      actionCard: {
        type: 'gear',
        buttonText: 'Explore Complete Kitbag Showcase',
        linkUrl: '/photographers/photo-1',
      },
    }
  }

  // 7. Shot list request
  if (lower.includes('shot list') || lower.includes('shotlist') || lower.includes('poses') || lower.includes('shots')) {
    return {
      id,
      sender: 'ai',
      text: `I've prepared our curated **Editorial Sitting Shot-List** for your reference:\n\n1. **Hero Environmental Key**: Wide architectural frame with full garment sweep.\n2. **Three-Quarter Poise**: Dynamic posture with soft side-fill light.\n3. **Tight Macro Portrait**: Razor-sharp iris and texture focus with creamy falloff.\n4. **Candid Motion In-Between**: Unrehearsed laugh or fabric stride between takes.\n5. **Silhouette & Rim Glow**: Dramatic backlighting against dark canvas.\n6. **Monochrome Hero**: High-contrast black & white tonal study.`,
      timestamp,
      actionCard: {
        type: 'shotlist',
        buttonText: 'Browse Lookbook Aesthetics',
        linkUrl: '/book',
        shotListItems: [
          'Hero Environmental Key',
          'Three-Quarter Poise',
          'Tight Macro Portrait',
          'Candid Motion In-Between',
          'Silhouette & Rim Glow',
          'Monochrome Hero',
        ],
      },
    }
  }

  // 8. Location & Directions / Address
  if (lower.includes('location') || lower.includes('address') || lower.includes('where') || lower.includes('directions') || lower.includes('parking') || lower.includes('mumbai')) {
    return {
      id,
      sender: 'ai',
      text: `Northlight Studio is nestled in Mumbai's historic heritage quarter:\n\n📍 **Address**: 14, Ballard Estate, Heritage District, Fort, Mumbai 400001.\n🚗 **Valet Parking**: Complimentary private valet at the Calicut Road courtyard gate.\n🏢 **Studio Suite**: Suite 4B (Dedicated freight elevator available for gown trunks).`,
      timestamp,
      actionCard: {
        type: 'harmonizer',
        buttonText: 'Open in Google Maps',
        linkUrl: 'https://maps.google.com/?q=Ballard+Estate+Fort+Mumbai',
      },
    }
  }

  // 9. Pricing / Calculator
  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('how much') || lower.includes('budget') || lower.includes('calculator')) {
    return {
      id,
      sender: 'ai',
      text: `Our transparent commissions begin at **₹8,000** for express headshots up to **₹150,000** for full-day royal palace wedding productions.\n\nYou can also use our new **Interactive Investment Calculator** on the packages page to customize your exact hours, retouched frames, and crew configuration!`,
      timestamp,
      actionCard: {
        type: 'package',
        buttonText: 'Launch Investment Calculator',
        linkUrl: '/packages',
      },
    }
  }

  // 10. Default Luxury Studio Concierge fallback
  return {
    id,
    sender: 'ai',
    text: `Welcome to Northlight Studio. I am **Aura**, your creative concierge.\n\nI can assist you with:\n• **Tailored Package Matching** (Weddings, Portraits, Pre-Wedding, Fashion)\n• **Wardrobe Color Harmony** & Fabric Guidance\n• **Golden Hour Scheduling** in Ballard Estate\n• **Optical Kitbag & Medium Format Specs**\n\nHow may I help curate your upcoming sitting today?`,
    timestamp,
    actionCard: {
      type: 'package',
      buttonText: 'Explore All Packages',
      linkUrl: '/packages',
    },
  }
}
