import axios from 'axios'
import type {
  AvailabilityResponse,
  BlockedPeriod,
  Booking,
  Package,
  PhotographerCreatePayload,
  PhotographerDetail,
  PhotographerListItem,
  User,
  WorkingHour,
} from './types'
import {
  DEMO_PACKAGES,
  DEMO_PHOTOGRAPHERS,
  DEMO_PHOTOGRAPHER_DETAILS,
  generateMockSlots,
  getLocalBookings,
  saveLocalBooking,
} from './mock-data'

const TOKEN_KEY = 'photography_studio_token'

const hasCustomBackend = Boolean(import.meta.env.VITE_API_URL)

function isValidArray<T>(data: unknown): data is T[] {
  return Array.isArray(data)
}

function isValidObject<T>(data: unknown): data is T {
  return typeof data === 'object' && data !== null && !Array.isArray(data) && typeof (data as any) !== 'string'
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const queryKeys = {
  packages: ['packages'] as const,
  package: (id: string) => ['packages', id] as const,
  photographers: ['photographers'] as const,
  photographer: (id: string) => ['photographers', id] as const,
  availability: (params: { photographer_id: string; package_id: string; date: string }) =>
    ['availability', params] as const,
  myBookings: ['bookings', 'me'] as const,
  photographerBookings: ['bookings', 'photographer'] as const,
  workingHours: ['working-hours'] as const,
  blockedPeriods: ['blocked-periods'] as const,
}

// In-memory / localStorage storage for newly created packages
function getCustomPackages(): Package[] {
  try {
    const raw = localStorage.getItem('studio_custom_packages')
    return raw ? (JSON.parse(raw) as Package[]) : []
  } catch {
    return []
  }
}

function saveCustomPackage(pkg: Package) {
  const current = getCustomPackages()
  localStorage.setItem('studio_custom_packages', JSON.stringify([pkg, ...current]))
}

export const packagesApi = {
  list: async (): Promise<Package[]> => {
    if (hasCustomBackend || !import.meta.env.PROD) {
      try {
        const response = await apiClient.get<Package[]>('/packages')
        if (isValidArray<Package>(response.data) && response.data.length > 0) return response.data
      } catch {
        // Backend unavailable; use fallback
      }
    }
    const custom = getCustomPackages()
    return [...custom, ...DEMO_PACKAGES]
  },
  get: async (id: string): Promise<Package> => {
    if (hasCustomBackend || !import.meta.env.PROD) {
      try {
        const response = await apiClient.get<Package>(`/packages/${id}`)
        if (isValidObject<Package>(response.data)) return response.data
      } catch {
        // Backend unavailable; use fallback
      }
    }
    const custom = getCustomPackages()
    const all = [...custom, ...DEMO_PACKAGES]
    return all.find((p) => p.id === id) || all[0]
  },
  create: async (data: Partial<Package> & { photographer_ids?: string[] }): Promise<Package> => {
    if (hasCustomBackend || !import.meta.env.PROD) {
      try {
        const response = await apiClient.post<Package>('/packages', data)
        if (isValidObject<Package>(response.data)) return response.data
      } catch {
        // Backend unavailable; use fallback
      }
    }
    const newPkg: Package = {
      id: 'pkg-custom-' + Date.now(),
      name: data.name || 'Custom Package',
      description: data.description || 'Special photography session',
      price: data.price || 25000,
      duration_minutes: data.duration_minutes || 120,
      category: data.category || 'Weddings & Celebrations',
      image_url: data.image_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
      is_active: true,
    }
    saveCustomPackage(newPkg)
    return newPkg
  },
  assignPhotographer: async (packageId: string, photographerId: string): Promise<void> => {
    if (hasCustomBackend || !import.meta.env.PROD) {
      try {
        await apiClient.post(`/packages/${packageId}/photographers`, { photographer_id: photographerId })
      } catch {
        // Mock assignment acknowledged
      }
    }
  },
}

export const photographersApi = {
  list: async (): Promise<PhotographerListItem[]> => {
    if (hasCustomBackend || !import.meta.env.PROD) {
      try {
        const response = await apiClient.get<PhotographerListItem[]>('/photographers')
        if (isValidArray<PhotographerListItem>(response.data) && response.data.length > 0) return response.data
      } catch {
        // Backend unavailable; use fallback
      }
    }
    return DEMO_PHOTOGRAPHERS
  },
  get: async (id: string): Promise<PhotographerDetail> => {
    if (hasCustomBackend || !import.meta.env.PROD) {
      try {
        const response = await apiClient.get<PhotographerDetail>(`/photographers/${id}`)
        if (isValidObject<PhotographerDetail>(response.data)) return response.data
      } catch {
        // Backend unavailable; use fallback
      }
    }
    const detail = DEMO_PHOTOGRAPHER_DETAILS[id]
    if (detail) return detail
    const p = DEMO_PHOTOGRAPHERS.find((item) => item.id === id) || DEMO_PHOTOGRAPHERS[0]
    return {
      id: p.id,
      full_name: p.full_name,
      email: `${p.full_name.toLowerCase().replace(/\s+/g, '')}@studio.com`,
      bio: p.bio,
      specialties: p.specialties,
      portfolio_images: [
        { id: '1', image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a', caption: 'Palace wedding', sort_order: 0 },
        { id: '2', image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', caption: 'Traditional silks', sort_order: 1 },
      ],
      packages: DEMO_PACKAGES.slice(0, 3),
    }
  },
  create: async (
    data: PhotographerCreatePayload,
  ): Promise<{ user: User; photographer_profile_id: string }> => {
    try {
      const response = await apiClient.post<{ user: User; photographer_profile_id: string }>(
        '/photographers',
        data,
      )
      if (response.data) return response.data
    } catch {
      // Backend unavailable; use fallback
    }
    const newId = 'photo-' + Date.now()
    const user: User = {
      id: 'user-' + newId,
      email: data.email,
      full_name: data.full_name,
      role: 'photographer',
    }
    DEMO_PHOTOGRAPHERS.push({
      id: newId,
      full_name: data.full_name,
      bio: data.bio || '',
      specialties: data.specialties,
    })
    return { user, photographer_profile_id: newId }
  },
}

export const availabilityApi = {
  get: async (params: {
    photographer_id: string
    package_id: string
    date: string
  }): Promise<AvailabilityResponse> => {
    try {
      const response = await apiClient.get<AvailabilityResponse>('/availability', {
        params,
      })
      if (response.data?.available_slots) return response.data
    } catch {
      // Backend unavailable; use fallback
    }
    const slots = generateMockSlots(params.date)
    return {
      date: params.date,
      photographer_id: params.photographer_id,
      package_id: params.package_id,
      package_duration_minutes: 120,
      timezone: 'Asia/Kolkata',
      available_slots: slots,
    }
  },
}

function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem('photography_studio_user')
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function getCurrentPhotographerId(): string {
  const user = getCurrentUser()
  if (!user) return 'photo-1'
  const photog = DEMO_PHOTOGRAPHERS.find(
    (p) =>
      p.id === user.id ||
      p.full_name.toLowerCase() === user.full_name.toLowerCase() ||
      user.email.toLowerCase().includes(p.full_name.split(' ')[0].toLowerCase()),
  )
  return photog ? photog.id : 'photo-1'
}

function getPhotographerWorkingHours(photogId: string): WorkingHour[] {
  const key = `studio_working_hours_${photogId}`
  const raw = localStorage.getItem(key)
  if (raw) {
    try {
      return JSON.parse(raw) as WorkingHour[]
    } catch {
      // fallback
    }
  }
  const defaultHours: WorkingHour[] = [0, 1, 2, 3, 4].map((d) => ({
    id: `wh-${photogId}-${d}`,
    photographer_id: photogId,
    day_of_week: d,
    start_time: '09:00:00',
    end_time: '17:00:00',
  }))
  localStorage.setItem(key, JSON.stringify(defaultHours))
  return defaultHours
}

function savePhotographerWorkingHours(photogId: string, hours: WorkingHour[]): void {
  const key = `studio_working_hours_${photogId}`
  localStorage.setItem(key, JSON.stringify(hours))
}

function getPhotographerBlockedPeriods(photogId: string): BlockedPeriod[] {
  const key = `studio_blocked_periods_${photogId}`
  const raw = localStorage.getItem(key)
  if (raw) {
    try {
      return JSON.parse(raw) as BlockedPeriod[]
    } catch {
      // fallback
    }
  }
  return []
}

function savePhotographerBlockedPeriods(photogId: string, list: BlockedPeriod[]): void {
  const key = `studio_blocked_periods_${photogId}`
  localStorage.setItem(key, JSON.stringify(list))
}

export const bookingsApi = {
  mine: async (): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>('/bookings/me')
      if (response.data && response.data.length > 0) return response.data
    } catch {
      // Backend unavailable; use fallback
    }
    const user = getCurrentUser()
    const all = getLocalBookings()
    if (!user) return all
    // Return only bookings that belong to this customer
    return all.filter((b) => {
      if (b.customer_id === user.id) return true
      if (user.full_name && b.customer_name?.toLowerCase() === user.full_name.toLowerCase()) return true
      if (user.email && (b as any).customer_email?.toLowerCase() === user.email.toLowerCase()) return true
      return false
    })
  },
  photographer: async (): Promise<Booking[]> => {
    try {
      const response = await apiClient.get<Booking[]>('/bookings/photographer/me')
      if (response.data && response.data.length > 0) return response.data
    } catch {
      // Backend unavailable; use fallback
    }
    const user = getCurrentUser()
    const photogId = getCurrentPhotographerId()
    const all = getLocalBookings()
    // Return only bookings assigned to this photographer
    return all.filter((b) => {
      if (b.photographer_id === photogId) return true
      if (user && b.photographer_name?.toLowerCase() === user.full_name.toLowerCase()) return true
      return false
    })
  },
  create: async (data: {
    photographer_id: string
    package_id: string
    start_datetime: string
  }): Promise<Booking> => {
    try {
      const response = await apiClient.post<Booking>('/bookings', data)
      if (response.data) return response.data
    } catch {
      // Backend unavailable; use fallback
    }
    const allPkgs = [...getCustomPackages(), ...DEMO_PACKAGES]
    const pkg = allPkgs.find((p) => p.id === data.package_id) || allPkgs[0]
    const photog = DEMO_PHOTOGRAPHERS.find((p) => p.id === data.photographer_id) || DEMO_PHOTOGRAPHERS[0]
    const startDate = new Date(data.start_datetime)
    const endDate = new Date(startDate.getTime() + (pkg.duration_minutes || 120) * 60000)

    const user = getCurrentUser()
    const customerId = user?.id || 'usr-cust-' + Date.now()
    const customerName = user?.full_name || 'Client'
    const customerEmail = user?.email || 'client@example.com'

    const newBooking: Booking = {
      id: 'book-' + Date.now(),
      customer_id: customerId,
      photographer_id: photog.id,
      package_id: pkg.id,
      start_datetime: startDate.toISOString(),
      end_datetime: endDate.toISOString(),
      status: 'confirmed',
      created_at: new Date().toISOString(),
      customer_name: customerName,
      customer_email: customerEmail,
      photographer_name: photog.full_name,
      package_name: pkg.name,
    }
    saveLocalBooking(newBooking)
    return newBooking
  },
  cancel: async (
    id: string,
  ): Promise<{ booking_id: string; status: string; cancelled_at: string }> => {
    try {
      const response = await apiClient.post<{ booking_id: string; status: string; cancelled_at: string }>(
        `/bookings/${id}/cancel`,
      )
      if (response.data) return response.data
    } catch {
      // Backend unavailable; use fallback
    }
    const current = getLocalBookings()
    const updated = current.map((b) => (b.id === id ? { ...b, status: 'cancelled_by_customer' } : b))
    localStorage.setItem('studio_local_bookings', JSON.stringify(updated))
    return { booking_id: id, status: 'cancelled_by_customer', cancelled_at: new Date().toISOString() }
  },
}

export const workingHoursApi = {
  list: async (): Promise<WorkingHour[]> => {
    try {
      const response = await apiClient.get<WorkingHour[]>('/working-hours')
      if (response.data && response.data.length > 0) return response.data
    } catch {
      // fallback
    }
    const photogId = getCurrentPhotographerId()
    return getPhotographerWorkingHours(photogId)
  },
  upsert: async (data: {
    day_of_week: number
    start_time: string
    end_time: string
  }): Promise<WorkingHour> => {
    try {
      const response = await apiClient.post<WorkingHour>('/working-hours', data)
      if (response.data) return response.data
    } catch {
      // fallback
    }
    const photogId = getCurrentPhotographerId()
    const current = getPhotographerWorkingHours(photogId)
    const existingIndex = current.findIndex((w) => w.day_of_week === data.day_of_week)
    const item: WorkingHour = {
      id: `wh-${photogId}-${data.day_of_week}-${Date.now()}`,
      photographer_id: photogId,
      day_of_week: data.day_of_week,
      start_time: data.start_time,
      end_time: data.end_time,
    }
    if (existingIndex >= 0) {
      current[existingIndex] = item
    } else {
      current.push(item)
    }
    current.sort((a, b) => a.day_of_week - b.day_of_week)
    savePhotographerWorkingHours(photogId, current)
    return item
  },
  remove: async (dayOfWeek: number): Promise<void> => {
    try {
      await apiClient.delete(`/working-hours/${dayOfWeek}`)
    } catch {
      // fallback
    }
    const photogId = getCurrentPhotographerId()
    const current = getPhotographerWorkingHours(photogId)
    const updated = current.filter((w) => w.day_of_week !== dayOfWeek)
    savePhotographerWorkingHours(photogId, updated)
  },
}

export const blockedPeriodsApi = {
  list: async (): Promise<BlockedPeriod[]> => {
    try {
      const response = await apiClient.get<BlockedPeriod[]>('/blocked-periods')
      if (response.data) return response.data
    } catch {
      // fallback
    }
    const photogId = getCurrentPhotographerId()
    return getPhotographerBlockedPeriods(photogId)
  },
  create: async (data: {
    start_datetime: string
    end_datetime: string
    reason?: string
  }): Promise<BlockedPeriod> => {
    try {
      const response = await apiClient.post<BlockedPeriod>('/blocked-periods', data)
      if (response.data) return response.data
    } catch {
      // fallback
    }
    const photogId = getCurrentPhotographerId()
    const current = getPhotographerBlockedPeriods(photogId)
    const newPeriod: BlockedPeriod = {
      id: `bp-${photogId}-${Date.now()}`,
      photographer_id: photogId,
      start_datetime: data.start_datetime,
      end_datetime: data.end_datetime,
      reason: data.reason || null,
    }
    const updated = [newPeriod, ...current]
    savePhotographerBlockedPeriods(photogId, updated)
    return newPeriod
  },
  remove: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/blocked-periods/${id}`)
    } catch {
      // fallback
    }
    const photogId = getCurrentPhotographerId()
    const current = getPhotographerBlockedPeriods(photogId)
    const updated = current.filter((bp) => bp.id !== id)
    savePhotographerBlockedPeriods(photogId, updated)
  },
}
