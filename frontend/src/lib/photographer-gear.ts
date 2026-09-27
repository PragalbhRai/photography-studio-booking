export interface GearItem {
  id: string
  name: string
  category: 'camera' | 'lens' | 'lighting' | 'support'
  brand: string
  specs: string
  badge: string
  description: string
}

export interface PhotographerGearKit {
  photographerId: string
  title: string
  tagline: string
  primarySensor: string
  gear: GearItem[]
}

export const PHOTOGRAPHER_GEAR: Record<string, PhotographerGearKit> = {
  'photo-1': {
    photographerId: 'photo-1',
    title: 'Aarav Sharma · Master Kitbag',
    tagline: 'Medium format resolution and legendary German optics tailored for royal weddings and heritage commissions.',
    primarySensor: '100-Megapixel Medium Format Sensor (53.4 × 40.0mm)',
    gear: [
      {
        id: 'gear-1-1',
        name: 'Hasselblad H6D-100c',
        category: 'camera',
        brand: 'Hasselblad',
        specs: '100MP 16-Bit RAW · 15 Stops Dynamic Range',
        badge: 'Medium Format Flagship',
        description: 'Delivers unmatched tonal graduation in fine silk embroidery, skin micro-contrast, and archival large-format clarity.',
      },
      {
        id: 'gear-1-2',
        name: 'Leica M11-P Rangefinder',
        category: 'camera',
        brand: 'Leica',
        specs: '60MP BSI CMOS · Content Authenticity Credentials',
        badge: 'Candid Rangefinder',
        description: 'Silent mechanical shutter capturing spontaneous royal emotional moments without breaking visual intimacy.',
      },
      {
        id: 'gear-1-3',
        name: 'Hasselblad HC 2,2/100mm',
        category: 'lens',
        brand: 'Hasselblad',
        specs: 'f/2.2 Aperture · Central Leaf Shutter up to 1/2000s',
        badge: 'Hero Portrait Prime',
        description: 'Produces creamy optical compression with razor-sharp iris detail and natural falloff.',
      },
      {
        id: 'gear-1-4',
        name: 'Leica Summilux-M 50mm f/1.4 ASPH',
        category: 'lens',
        brand: 'Leica',
        specs: 'f/1.4 High-Speed · Aspherical Glass',
        badge: 'Legendary 50mm',
        description: 'Renowned for the timeless “Leica Glow” with micro-contrast and three-dimensional subject separation.',
      },
      {
        id: 'gear-1-5',
        name: 'Profoto Pro-11 2400 AirTTL',
        category: 'lighting',
        brand: 'Profoto',
        specs: '2400Ws Strobe Output · 1/80,000s Flash Duration',
        badge: 'High-Power Studio Pack',
        description: 'Freezes moving fabric and royal drapery with zero color temperature shift across consecutive flashes.',
      },
      {
        id: 'gear-1-6',
        name: 'Broncolor Para 133 HR Reflector',
        category: 'lighting',
        brand: 'Broncolor',
        specs: '133cm Parabolic Focusable Modifier',
        badge: 'Sculptural Parabolic',
        description: 'Focusable parabolic reflector that envelops the subject in sculpted contrast with brilliant specular highlights.',
      },
    ],
  },
  'photo-2': {
    photographerId: 'photo-2',
    title: 'Meera Joshi · Portrait & Fine Art Kitbag',
    tagline: 'Calibrated color science and ultra-wide aperture primes designed for luminous skin tones.',
    primarySensor: '102-Megapixel High-Speed Large Format Sensor',
    gear: [
      {
        id: 'gear-2-1',
        name: 'Fujifilm GFX 100 II Large Format',
        category: 'camera',
        brand: 'Fujifilm',
        specs: '102MP BSI CMOS II · 8.0 Stops In-Body Stabilization',
        badge: 'Large Format Mirrorless',
        description: 'Extreme dynamic range capturing subtlest pastel tones and nuanced facial gradations.',
      },
      {
        id: 'gear-2-2',
        name: 'Sony A1 Flagship',
        category: 'camera',
        brand: 'Sony',
        specs: '50.1MP Stacked CMOS · Real-Time Eye AF',
        badge: 'High-Speed Portrait',
        description: 'Flawless 30fps continuous focus tracking for editorial motion and natural candid expressions.',
      },
      {
        id: 'gear-2-3',
        name: 'Fujinon GF 110mm f/2 R LM WR',
        category: 'lens',
        brand: 'Fujifilm',
        specs: 'f/2.0 Ultra-Fast · Equivalent to 87mm f/1.58',
        badge: 'Master Headshot Prime',
        description: 'World-renowned portrait optic creating ethereal bokeh and pinpoint eyelash resolution.',
      },
      {
        id: 'gear-2-4',
        name: 'Sony FE 85mm f/1.2 GM Master',
        category: 'lens',
        brand: 'Sony',
        specs: 'f/1.2 Extreme Low Light · Dual XD Linear Motors',
        badge: 'Low-Light Specialist',
        description: 'Enables cinematic environmental portraits in moody candlelit heritage ballrooms.',
      },
      {
        id: 'gear-2-5',
        name: 'Profoto B10X Plus Monolights',
        category: 'lighting',
        brand: 'Profoto',
        specs: '500Ws Cordless · High Speed Sync',
        badge: 'Mobile Location Strobe',
        description: 'Battery-powered location strobes capable of overpowering midday sun in outdoor courtyard sittings.',
      },
      {
        id: 'gear-2-6',
        name: 'Elinchrom Rotalux 135cm Octabox',
        category: 'lighting',
        brand: 'Elinchrom',
        specs: '135cm Double Diffusion Octabox',
        badge: 'Beauty Key Softbox',
        description: 'Produces perfectly circular catchlights and soft, flattering shadow transitions across cheekbones.',
      },
    ],
  },
  'photo-3': {
    photographerId: 'photo-3',
    title: 'Kabir Mehta · Fashion & Cinema Kitbag',
    tagline: 'Hollywood anamorphic glass and high-framerate cinema cameras for magazine editorials and motion teasers.',
    primarySensor: 'Full-Frame 4K/120fps Dual Base ISO Cinema Sensor',
    gear: [
      {
        id: 'gear-3-1',
        name: 'Sony FX6 Full-Frame Cinema',
        category: 'camera',
        brand: 'Sony',
        specs: '4K 120p · 15+ Stops Dynamic Range · S-Cinetone',
        badge: 'Cinema Camera',
        description: 'Captures buttery slow-motion motion portraits and vertical teaser reels in cinematic 10-bit 4:2:2.',
      },
      {
        id: 'gear-3-2',
        name: 'Leica SL3 Mirrorless',
        category: 'camera',
        brand: 'Leica',
        specs: '60MP BSI Full-Frame · Maestro IV Processor',
        badge: 'High-Res Fashion',
        description: 'German industrial build engineered for demanding high-fashion editorial runway and location shoots.',
      },
      {
        id: 'gear-3-3',
        name: 'Cooke Optics Anamorphic 50mm T2.3',
        category: 'lens',
        brand: 'Cooke',
        specs: '2x Anamorphic Squeeze · Iconic Cooke Look',
        badge: 'Cinema Anamorphic Glass',
        description: 'Provides organic horizontal flare roll-offs and unique oval bokeh for fashion teaser films.',
      },
      {
        id: 'gear-3-4',
        name: 'Leica APO-Vario-Elmarit-SL 90-280mm',
        category: 'lens',
        brand: 'Leica',
        specs: 'f/2.8-4.0 · Optical Image Stabilization',
        badge: 'Telephoto Editorial',
        description: 'Compresses distant heritage palace architecture behind the model for striking editorial framing.',
      },
      {
        id: 'gear-3-5',
        name: 'Aputure LS 600d Pro Daylight',
        category: 'lighting',
        brand: 'Aputure',
        specs: '600W COB LED · CRI/TLCI 96+ · Weather-Resistant',
        badge: 'High-Output Continuous',
        description: 'Replicates intense direct sunlight through historic palace archways and stained glass windows.',
      },
      {
        id: 'gear-3-6',
        name: 'Nanlite PavoTube II 30X RGBWW (4-Pack)',
        category: 'lighting',
        brand: 'Nanlite',
        specs: '4-Foot Pixel Tubes · Full RGB Spectrum & FX',
        badge: 'Cinematic Mood Accents',
        description: 'Adds stylized rim-lighting and ambient color fills for fashion and creative evening looks.',
      },
    ],
  },
}
