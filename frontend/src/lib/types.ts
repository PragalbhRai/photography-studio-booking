export interface User {
  id: string
  email: string
  full_name: string
  role: 'customer' | 'photographer' | 'admin'
}

export interface Package {
  id: string
  name: string
  description?: string | null
  price: number
  duration_minutes: number
  category: string
  image_url: string
  is_active: boolean
}

export interface PortfolioImage {
  id: string
  image_url: string
  caption?: string | null
  sort_order: number
}

export interface PhotographerListItem {
  id: string
  full_name: string
  bio?: string | null
  specialties: string[]
}

export interface PhotographerDetail {
  id: string
  full_name: string
  email: string
  bio?: string | null
  specialties: string[]
  portfolio_images: PortfolioImage[]
  packages: Package[]
}

export interface AvailabilitySlot {
  start_datetime: string
  start_datetime_utc: string
  start_datetime_local: string
  display_time: string
}

export interface AvailabilityResponse {
  date: string
  photographer_id: string
  package_id: string
  package_duration_minutes: number
  timezone: string
  available_slots: AvailabilitySlot[]
}

export interface Booking {
  id: string
  customer_id: string
  photographer_id: string
  package_id: string
  start_datetime: string
  end_datetime: string
  status: 'confirmed' | 'cancelled_by_customer' | 'cancelled_by_photographer' | 'cancelled_by_admin' | 'completed' | string
  created_at: string
  customer_name?: string | null
  customer_email?: string | null
  photographer_name?: string | null
  package_name?: string | null
}

export interface WorkingHour {
  id: string
  photographer_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

export interface BlockedPeriod {
  id: string
  photographer_id: string
  start_datetime: string
  end_datetime: string
  reason?: string | null
}

export interface PhotographerCreatePayload {
  email: string
  password: string
  full_name: string
  bio?: string
  specialties: string[]
}
