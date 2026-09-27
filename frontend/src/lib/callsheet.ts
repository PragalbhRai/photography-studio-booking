export interface ProductionCallSheet {
  id: string
  productionCode: string
  date: string
  callTime: string
  wrapTime: string
  locationName: string
  locationAddress: string
  weatherSummary: string
  sunriseTime: string
  sunsetTime: string
  goldenHourMorning: string
  goldenHourEvening: string
  packageName: string
  clientName: string
  clientContact: string
  hmuaLead: string
  gafferLead: string
  leadPhotographer: string
  leadColorist: string
  wardrobePalette: { name: string; hex: string; role: string }[]
  timelineSchedule: { time: string; activity: string; lensLighting: string; stage: string }[]
  equipmentManifest: { item: string; serial: string; status: 'packed' | 'standby' }[]
  emergencyHospital: string
  notes: string
}

export function generateCallSheetForSitting(params: {
  sittingId: string
  clientName: string
  packageName: string
  photographerName: string
  dateStr?: string
}): ProductionCallSheet {
  const dateFormatted = params.dateStr || 'Saturday, October 24, 2026'

  return {
    id: `callsheet-${Date.now()}`,
    productionCode: `CS-NL-${Math.floor(1000 + Math.random() * 9000)}`,
    date: dateFormatted,
    callTime: '06:00 AM IST (Crew Call: 05:30 AM)',
    wrapTime: '08:30 PM IST (Est. Wrap)',
    locationName: 'Ballard Estate Heritage Studio & South Mumbai Promenade',
    locationAddress: '14, Ballard Estate, Fort, Mumbai 400001 (Studio A & B)',
    weatherSummary: '28°C · Clear Skies · 65% Humidity · Golden Rim Potential High',
    sunriseTime: '06:14 AM',
    sunsetTime: '06:48 PM',
    goldenHourMorning: '06:14 AM – 07:05 AM',
    goldenHourEvening: '05:55 PM – 06:48 PM',
    packageName: params.packageName || 'Royal Palace Wedding Masterwork',
    clientName: params.clientName || 'Pooja & Karan Malhotra',
    clientContact: '+91 98201 44921 · patron@malhotra-estate.example',
    leadPhotographer: params.photographerName || 'Aarav Sharma (Hasselblad Master)',
    gafferLead: 'Vikram Joshi (1st Lighting Technician)',
    hmuaLead: 'Zoya Merchant (Haute Couture Bridal Stylist)',
    leadColorist: 'Kavita Das (16-Bit Capture One Lead)',
    wardrobePalette: [
      { name: 'Imperial Crimson', hex: '#8B1E2D', role: 'Primary Bridal Raw Silk' },
      { name: 'Antique Zari Gold', hex: '#C5A059', role: 'Intricate Gilded Embroidery' },
      { name: 'Sandstone Ivory', hex: '#EDE6DA', role: 'Sherwani & Mandap Architecture' },
      { name: 'Deep Emerald', hex: '#1B3B2B', role: 'Jewelry & Accent Contrast' },
    ],
    timelineSchedule: [
      {
        time: '05:30 AM',
        activity: 'Crew & Gaffer Ingest: Power distribution, Profoto Pro-11 generator pack test',
        lensLighting: 'Staging lights: 5600K clean flood',
        stage: 'Studio Floor',
      },
      {
        time: '06:15 AM – 07:15 AM',
        activity: 'Block 1: Architectural Dawn Romance on Promenade (Low Sun Silhouette)',
        lensLighting: 'Leica M11-P + 50mm Summilux f/1.4 · Natural Sunrise Rim + Silver Bounce',
        stage: 'Exterior Promenade',
      },
      {
        time: '07:30 AM – 09:30 AM',
        activity: 'HMUA & Wardrobe Transition: Silk Draping, Jewelry Pinning, Breakfast',
        lensLighting: 'Ambient styling daylight',
        stage: 'Green Room Suite',
      },
      {
        time: '09:45 AM – 12:30 PM',
        activity: 'Block 2: Master Royal Editorial Sitting & Grand Veil Movement',
        lensLighting: 'Hasselblad H6D-100c + HC 100mm f/2.2 · Broncolor Para 133 Key + White Scrim Fill',
        stage: 'Studio A (Main Cyclorama)',
      },
      {
        time: '01:00 PM – 02:00 PM',
        activity: 'Catered Luncheon & Digital Tethering Backup to LTO-8 Tape',
        lensLighting: 'Standby',
        stage: 'VIP Lounge',
      },
      {
        time: '02:30 PM – 05:00 PM',
        activity: 'Block 3: Intimate Chiaroscuro Portraits & Heritage Veil Detail Loupe',
        lensLighting: 'Fujifilm GFX 100 II + GF 110mm f/2 · Fresnel Spotlight (Rembrandt Pattern)',
        stage: 'Studio B (Darkroom Stage)',
      },
      {
        time: '05:45 PM – 06:45 PM',
        activity: 'Block 4: Golden Hour Sunset Halos & Fire Candlelight Rituals',
        lensLighting: 'Sony FX6 Cinema Stills + Cooke Anamorphic 50mm · Tungsten & Ambient Flame',
        stage: 'Courtyard Pavilion',
      },
      {
        time: '07:30 PM',
        activity: 'Final Sensor Ingest, Dual RAID-10 Archival Verification, Studio Wrap',
        lensLighting: 'Off',
        stage: 'Colorist Vault',
      },
    ],
    equipmentManifest: [
      { item: 'Hasselblad H6D-100c Medium Format Body (#H6D-9810)', serial: 'H6D-9810-EU', status: 'packed' },
      { item: 'Hasselblad HC 100mm f/2.2 Orange Dot Glass', serial: 'HC-2201-94', status: 'packed' },
      { item: 'Leica M11-P 60MP Rangefinder + 50mm Summilux f/1.4', serial: 'M11P-04421', status: 'packed' },
      { item: 'Profoto Pro-11 2400Ws Strobe Generator + ProHead Plus (x2)', serial: 'PF-2400-88', status: 'packed' },
      { item: 'Broncolor Para 133 Parabolic Reflector & Diffuser Grid', serial: 'BR-133P-02', status: 'packed' },
      { item: 'Cooke 10” Optical Glass Fresnel Spotlight Housing', serial: 'CK-FRS-10', status: 'packed' },
      { item: 'SanDisk Professional 4TB PRO-BLADE NVMe Mag (x4)', serial: 'SD-NVME-01-04', status: 'packed' },
      { item: 'X-Rite ColorChecker Digital SG Calibration Chart', serial: 'XR-SG-2026', status: 'packed' },
    ],
    emergencyHospital: 'Bombay Hospital & Medical Research Centre, Marine Lines (Phone: 022 2206 7676)',
    notes: 'Strict confidentiality NDA signed. Client requests zero cell-phone flash behind the primary camera. Offline tethering monitored by lead colorist on calibrated EIZO ColorEdge CG319X.',
  }
}
