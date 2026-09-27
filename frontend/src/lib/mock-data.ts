import type {
  AvailabilitySlot,
  Booking,
  Package,
  PhotographerDetail,
  PhotographerListItem,
  User,
} from './types'

export const DEMO_PACKAGES: Package[] = [
  {
    id: 'pkg-1',
    name: 'The Grand Royal Wedding',
    description:
      'Complete wedding day coverage from Haldi and Baraat to the Varmala and Reception. Includes lead and secondary photographers, 600+ master-graded images, and curated digital gallery.',
    price: 150000,
    duration_minutes: 480,
    category: 'Weddings & Celebrations',
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-2',
    name: 'Intimate Mandap Ceremony',
    description:
      'Focused coverage for intimate weddings, Anand Karaj, or temple rituals. Four hours of dedicated photography with 300+ edited images delivered digitally.',
    price: 65000,
    duration_minutes: 240,
    category: 'Weddings & Celebrations',
    image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-3',
    name: 'Heritage Couple Editorial',
    description:
      'Cinematic pre-wedding session in your choice of palace ruins, heritage stepwells, or scenic landscapes. Two hours of creative styling and 100+ high-res images.',
    price: 35000,
    duration_minutes: 120,
    category: 'Pre-Wedding & Engagement',
    image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-4',
    name: 'Sunset Pre-Wedding Romance',
    description:
      'Romantic golden hour photography session. Ideal for engagement invitations or pre-wedding teaser reels with 80+ color-graded portraits.',
    price: 25000,
    duration_minutes: 90,
    category: 'Pre-Wedding & Engagement',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-5',
    name: 'Signature Executive Portrait',
    description:
      'Premium portrait session for leadership profiles, founders, and personal branding. Studio or outdoor set, professional retouching, and 30+ deliverable files.',
    price: 15000,
    duration_minutes: 90,
    category: 'Portraits & Headshots',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-6',
    name: 'Professional Headshots',
    description:
      'Modern studio headshots for LinkedIn, corporate directories, and publication bylines. Fast turnaround with 10 retouched finals.',
    price: 8000,
    duration_minutes: 60,
    category: 'Portraits & Headshots',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-7',
    name: 'High Fashion Editorial Day',
    description:
      'Full-day high fashion and couture editorial production. Concept board, lookbook guidance, strobe setups, and 150+ high-end retouched frames.',
    price: 55000,
    duration_minutes: 360,
    category: 'Fashion & Editorial',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-8',
    name: 'Designer Campaign Collection',
    description:
      'Half-day fashion shoot for boutique labels, festive drops, and e-commerce hero banners. Includes 80+ edited frames.',
    price: 35000,
    duration_minutes: 180,
    category: 'Fashion & Editorial',
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-9',
    name: 'Fine Art Maternity',
    description:
      'Poetic maternity portraits honoring your motherhood chapter. Studio drape styling, partner poses, and 50+ warm fine-art images.',
    price: 22000,
    duration_minutes: 90,
    category: 'Maternity & Newborn',
    image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-10',
    name: 'Motherhood & Newborn Story',
    description:
      'Two combined sessions: one during third trimester and one newborn session at your home. Gentle, unhurried posing with 100+ edited photographs.',
    price: 32000,
    duration_minutes: 120,
    category: 'Maternity & Newborn',
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-11',
    name: 'Corporate Summit & Gala Coverage',
    description:
      'Comprehensive photography for high-profile business summits, award nights, and panel sessions. Real-time media deliverables and full high-res catalog.',
    price: 45000,
    duration_minutes: 360,
    category: 'Events & Corporate',
    image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-12',
    name: 'Brand Event & Celebration',
    description:
      'Half-day coverage for product reveals, milestone dinners, and festive gatherings. 150+ vibrant candid and keynote frames.',
    price: 25000,
    duration_minutes: 180,
    category: 'Events & Corporate',
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-13',
    name: 'Luxury Jewelry & Product Launch',
    description:
      'High-magnification studio photography for jewelry, luxury goods, and craft objects. Focus stacking, color accuracy, and reflective surface mastery.',
    price: 35000,
    duration_minutes: 240,
    category: 'Product & Brand Photography',
    image_url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-14',
    name: 'Brand Content & Catalog Session',
    description:
      'Tactile lifestyle product photography for digital storefronts and social feeds. Half-day session with 75+ polished frames.',
    price: 22000,
    duration_minutes: 180,
    category: 'Product & Brand Photography',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-15',
    name: 'Destination Travel & Heritage Story',
    description:
      "Full-day lifestyle and documentary series across India's vibrant locales. Ideal for hospitality, luxury travel publications, and private visual diaries.",
    price: 60000,
    duration_minutes: 360,
    category: 'Travel & Lifestyle',
    image_url: 'https://images.unsplash.com/photo-1524492417038-a47738b556f4?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
  {
    id: 'pkg-16',
    name: 'Lifestyle Journey Feature',
    description:
      'Half-day experiential photo session celebrating local heritage, culinary moments, and atmospheric travel stories. 100+ edited images.',
    price: 28000,
    duration_minutes: 180,
    category: 'Travel & Lifestyle',
    image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
  },
]

export const DEMO_PHOTOGRAPHERS: PhotographerListItem[] = [
  {
    id: 'photo-1',
    full_name: 'Aarav Sharma',
    bio: 'Award-winning wedding photographer with 12+ years capturing lavish celebrations and intimate rituals across Jaipur, Udaipur, and Goa. Blends royal editorial framing with candid emotional moments.',
    specialties: ['Weddings & Celebrations', 'Pre-Wedding & Engagement'],
  },
  {
    id: 'photo-2',
    full_name: 'Rohan Kapoor',
    bio: 'Specializing in cinematic pre-wedding and engagement stories in iconic heritage forts, ghats, and mountain getaways. Dedicated to capturing spontaneous chemistry and grand vistas.',
    specialties: ['Pre-Wedding & Engagement', 'Portraits & Headshots'],
  },
  {
    id: 'photo-3',
    full_name: 'Ananya Iyer',
    bio: 'Portrait and personal branding specialist crafting expressive headshots for founders, artists, and leaders. Masters natural light and studio strobe minimalism.',
    specialties: ['Portraits & Headshots', 'Fashion & Editorial'],
  },
  {
    id: 'photo-4',
    full_name: 'Priya Nair',
    bio: 'Fashion and haute-couture editorial photographer collaborating with leading Indian designers, Lakmé Fashion Week campaigns, and high-street textile houses.',
    specialties: ['Fashion & Editorial', 'Product & Brand Photography'],
  },
  {
    id: 'photo-5',
    full_name: 'Meera Deshmukh',
    bio: 'Fine art maternity and newborn photographer creating gentle, warm portraits that celebrate motherhood and growing families with delicate attention.',
    specialties: ['Maternity & Newborn'],
  },
  {
    id: 'photo-6',
    full_name: 'Vikramaditya Roy',
    bio: 'Documentary and large-scale corporate event specialist for technology summits, cultural festivals, award galas, and national brand conventions.',
    specialties: ['Events & Corporate'],
  },
  {
    id: 'photo-7',
    full_name: 'Kabir Malhotra',
    bio: 'Precision product and heritage jewelry photographer helping modern direct-to-consumer and luxury brands tell tactile, desire-inducing visual stories.',
    specialties: ['Product & Brand Photography'],
  },
  {
    id: 'photo-8',
    full_name: 'Diya Sengupta',
    bio: 'Travel and heritage documentarian capturing cultural tapestries, colonial architecture, Himalayan expeditions, and living crafts across South Asia.',
    specialties: ['Travel & Lifestyle'],
  },
]

export const DEMO_PHOTOGRAPHER_DETAILS: Record<string, PhotographerDetail> = {
  'photo-1': {
    id: 'photo-1',
    full_name: 'Aarav Sharma',
    email: 'aarav@studio.com',
    bio: 'Award-winning wedding photographer with 12+ years capturing lavish celebrations and intimate rituals across Jaipur, Udaipur, and Goa. Blends royal editorial framing with candid emotional moments.',
    specialties: ['Weddings & Celebrations', 'Pre-Wedding & Engagement'],
    portfolio_images: [
      { id: 'img-1-1', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a', caption: 'Palace wedding celebration', sort_order: 0 },
      { id: 'img-1-2', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', caption: 'Bridal portrait in traditional silks', sort_order: 1 },
      { id: 'img-1-3', image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552', caption: 'Sangeet evening celebration', sort_order: 2 },
      { id: 'img-1-4', image_url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92', caption: 'Varmala ceremony under mandap', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[0], DEMO_PACKAGES[1], DEMO_PACKAGES[2]],
  },
  'photo-2': {
    id: 'photo-2',
    full_name: 'Rohan Kapoor',
    email: 'rohan@studio.com',
    bio: 'Specializing in cinematic pre-wedding and engagement stories in iconic heritage forts, ghats, and mountain getaways. Dedicated to capturing spontaneous chemistry and grand vistas.',
    specialties: ['Pre-Wedding & Engagement', 'Portraits & Headshots'],
    portfolio_images: [
      { id: 'img-2-1', image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2', caption: 'Sunset dunes pre-wedding session', sort_order: 0 },
      { id: 'img-2-2', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', caption: 'Heritage royal couple portrait', sort_order: 1 },
      { id: 'img-2-3', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a', caption: 'Palace courtyard golden hour', sort_order: 2 },
      { id: 'img-2-4', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', caption: 'Groom fine art portrait', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[2], DEMO_PACKAGES[3], DEMO_PACKAGES[4]],
  },
  'photo-3': {
    id: 'photo-3',
    full_name: 'Ananya Iyer',
    email: 'ananya@studio.com',
    bio: 'Portrait and personal branding specialist crafting expressive headshots for founders, artists, and leaders. Masters natural light and studio strobe minimalism.',
    specialties: ['Portraits & Headshots', 'Fashion & Editorial'],
    portfolio_images: [
      { id: 'img-3-1', image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2', caption: 'Corporate leadership portrait', sort_order: 0 },
      { id: 'img-3-2', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', caption: 'Natural daylight studio portrait', sort_order: 1 },
      { id: 'img-3-3', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', caption: 'Founder executive headshot', sort_order: 2 },
      { id: 'img-3-4', image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', caption: 'Editorial monochrome portrait', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[4], DEMO_PACKAGES[5], DEMO_PACKAGES[6]],
  },
  'photo-4': {
    id: 'photo-4',
    full_name: 'Priya Nair',
    email: 'priya@studio.com',
    bio: 'Fashion and haute-couture editorial photographer collaborating with leading Indian designers, Lakmé Fashion Week campaigns, and high-street textile houses.',
    specialties: ['Fashion & Editorial', 'Product & Brand Photography'],
    portfolio_images: [
      { id: 'img-4-1', image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb', caption: 'Haute-couture lehenga lookbook', sort_order: 0 },
      { id: 'img-4-2', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', caption: 'Festive Banarasi weave story', sort_order: 1 },
      { id: 'img-4-3', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb', caption: 'Editorial model campaign', sort_order: 2 },
      { id: 'img-4-4', image_url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed', caption: 'Kundan jewelry showcase', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[6], DEMO_PACKAGES[7], DEMO_PACKAGES[12]],
  },
  'photo-5': {
    id: 'photo-5',
    full_name: 'Meera Deshmukh',
    email: 'meera@studio.com',
    bio: 'Fine art maternity and newborn photographer creating gentle, warm portraits that celebrate motherhood and growing families with delicate attention.',
    specialties: ['Maternity & Newborn'],
    portfolio_images: [
      { id: 'img-5-1', image_url: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9', caption: 'Motherhood studio drape sitting', sort_order: 0 },
      { id: 'img-5-2', image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4', caption: 'Peaceful newborn slumber series', sort_order: 1 },
      { id: 'img-5-3', image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', caption: 'Expectant parents gentle warmth', sort_order: 2 },
      { id: 'img-5-4', image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2', caption: 'Family golden hour celebration', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[8], DEMO_PACKAGES[9]],
  },
  'photo-6': {
    id: 'photo-6',
    full_name: 'Vikramaditya Roy',
    email: 'vikram@studio.com',
    bio: 'Documentary and large-scale corporate event specialist for technology summits, cultural festivals, award galas, and national brand conventions.',
    specialties: ['Events & Corporate'],
    portfolio_images: [
      { id: 'img-6-1', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', caption: 'Tech visionary keynote keynote', sort_order: 0 },
      { id: 'img-6-2', image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865', caption: 'National leadership awards gala', sort_order: 1 },
      { id: 'img-6-3', image_url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329', caption: 'Auditorium lighting & delegates', sort_order: 2 },
      { id: 'img-6-4', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', caption: 'Panel discussion candid series', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[10], DEMO_PACKAGES[11]],
  },
  'photo-7': {
    id: 'photo-7',
    full_name: 'Kabir Malhotra',
    email: 'kabir@studio.com',
    bio: 'Precision product and heritage jewelry photographer helping modern direct-to-consumer and luxury brands tell tactile, desire-inducing visual stories.',
    specialties: ['Product & Brand Photography'],
    portfolio_images: [
      { id: 'img-7-1', image_url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed', caption: 'Royal Polki & gold jewelry series', sort_order: 0 },
      { id: 'img-7-2', image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', caption: 'Craft horology and luxury leather', sort_order: 1 },
      { id: 'img-7-3', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', caption: 'Minimalist artisanal product set', sort_order: 2 },
      { id: 'img-7-4', image_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61', caption: 'Reflective crystal and bottle studio setup', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[12], DEMO_PACKAGES[13]],
  },
  'photo-8': {
    id: 'photo-8',
    full_name: 'Diya Sengupta',
    email: 'diya@studio.com',
    bio: 'Travel and heritage documentarian capturing cultural tapestries, colonial architecture, Himalayan expeditions, and living crafts across South Asia.',
    specialties: ['Travel & Lifestyle'],
    portfolio_images: [
      { id: 'img-8-1', image_url: 'https://images.unsplash.com/photo-1524492417038-a47738b556f4', caption: 'Agra sunrise heritage architectural series', sort_order: 0 },
      { id: 'img-8-2', image_url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1', caption: 'Backwater boatman documentary portrait', sort_order: 1 },
      { id: 'img-8-3', image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9', caption: 'Textile weaver workshop in Varanasi', sort_order: 2 },
      { id: 'img-8-4', image_url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2', caption: 'Desert caravan twilight journey', sort_order: 3 },
    ],
    packages: [DEMO_PACKAGES[14], DEMO_PACKAGES[15]],
  },
}

export const DEMO_USERS: User[] = [
  {
    id: 'user-admin',
    email: 'admin@studio.com',
    full_name: 'Studio Admin',
    role: 'admin',
  },
  {
    id: 'user-customer',
    email: 'customer@example.com',
    full_name: 'Demo Client',
    role: 'customer',
  },
  {
    id: 'user-photo-1',
    email: 'aarav@studio.com',
    full_name: 'Aarav Sharma',
    role: 'photographer',
  },
]

export function generateMockSlots(dateStr: string): AvailabilitySlot[] {
  const times = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
  ]

  return times.map((t) => {
    const isPm = t.includes('PM') && !t.startsWith('12')
    const [hStr, mStr] = t.replace(' AM', '').replace(' PM', '').split(':')
    const h = (parseInt(hStr, 10) + (isPm ? 12 : 0)).toString().padStart(2, '0')
    const localIso = `${dateStr}T${h}:${mStr}:00+05:30`
    const dateObj = new Date(localIso)

    return {
      start_datetime: dateObj.toISOString(),
      start_datetime_utc: dateObj.toISOString(),
      start_datetime_local: localIso,
      display_time: t,
    }
  })
}

export function getLocalBookings(): Booking[] {
  const data = localStorage.getItem('studio_local_bookings')
  if (!data) {
    const initial: Booking[] = [
      {
        id: 'book-demo-1',
        customer_id: 'user-customer',
        photographer_id: 'photo-1',
        package_id: 'pkg-1',
        start_datetime: new Date(Date.now() + 86400000 * 3).toISOString(),
        end_datetime: new Date(Date.now() + 86400000 * 3 + 3600000 * 4).toISOString(),
        status: 'confirmed',
        created_at: new Date().toISOString(),
        customer_name: 'Demo Client',
        photographer_name: 'Aarav Sharma',
        package_name: 'The Grand Royal Wedding',
      },
    ]
    localStorage.setItem('studio_local_bookings', JSON.stringify(initial))
    return initial
  }
  try {
    return JSON.parse(data) as Booking[]
  } catch {
    return []
  }
}

export function saveLocalBooking(booking: Booking): void {
  const current = getLocalBookings()
  const updated = [booking, ...current]
  localStorage.setItem('studio_local_bookings', JSON.stringify(updated))
}
