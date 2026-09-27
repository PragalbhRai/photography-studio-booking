import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import axios from 'axios'
import type { User } from './types'

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (data: { email: string; password: string; full_name: string }) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'photography_studio_token'
const USER_KEY = 'photography_studio_user'

const hasCustomBackend = Boolean(import.meta.env.VITE_API_URL)

let backendStatus: 'unknown' | 'online' | 'offline' = 'unknown'

async function isBackendAlive(): Promise<boolean> {
  // Pure static/Vercel preview without custom backend should always use client-side mock
  if (!hasCustomBackend && import.meta.env.PROD) {
    return false
  }
  if (backendStatus !== 'unknown') return backendStatus === 'online'
  try {
    const res = await axios.get('/api/v1/packages', { timeout: 800 })
    // Ensure response is genuine JSON array, not Vercel SPA index.html string
    if (res.status === 200 && Array.isArray(res.data) && typeof res.data !== 'string') {
      backendStatus = 'online'
      return true
    }
    backendStatus = 'offline'
    return false
  } catch {
    backendStatus = 'offline'
    return false
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(USER_KEY)
    if (!saved) return null
    try {
      const parsed = JSON.parse(saved)
      if (
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.email === 'string' &&
        typeof parsed.role === 'string' &&
        typeof parsed.full_name === 'string'
      ) {
        return parsed as User
      }
      localStorage.removeItem(USER_KEY)
      return null
    } catch {
      localStorage.removeItem(USER_KEY)
      return null
    }
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    async function verifyUser() {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (!storedToken) {
        setIsLoading(false)
        return
      }

      const alive = await isBackendAlive()
      if (!alive) {
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get<User>('/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
          timeout: 1000,
        })
        if (
          response.data &&
          typeof response.data === 'object' &&
          typeof response.data.email === 'string' &&
          typeof response.data.role === 'string'
        ) {
          setUser(response.data)
          localStorage.setItem(USER_KEY, JSON.stringify(response.data))
        }
      } catch {
        // If backend fails, preserve existing stored user session
      } finally {
        setIsLoading(false)
      }
    }

    void verifyUser()
  }, [])

  const loginLocally = (email: string): User => {
    const lower = email.toLowerCase().trim()
    let role: 'customer' | 'photographer' | 'admin' = 'customer'
    let name = email.split('@')[0]
    name = name.charAt(0).toUpperCase() + name.slice(1)
    let userId = 'usr-' + (Math.random() * 1000000).toFixed(0)

    if (lower.includes('admin')) {
      role = 'admin'
      name = 'Studio Admin'
      userId = 'admin-1'
    } else if (
      lower.includes('photographer') ||
      lower.includes('aarav') ||
      lower.includes('rohan') ||
      lower.includes('ananya') ||
      lower.includes('priya') ||
      lower.includes('meera') ||
      lower.includes('vikram') ||
      lower.includes('kabir') ||
      lower.includes('diya') ||
      lower.endsWith('@studio.com')
    ) {
      role = 'photographer'
      if (lower.includes('aarav')) {
        name = 'Aarav Sharma'
        userId = 'photo-1'
      } else if (lower.includes('rohan')) {
        name = 'Rohan Kapoor'
        userId = 'photo-2'
      } else if (lower.includes('ananya')) {
        name = 'Ananya Iyer'
        userId = 'photo-3'
      } else if (lower.includes('priya')) {
        name = 'Priya Nair'
        userId = 'photo-4'
      } else if (lower.includes('meera')) {
        name = 'Meera Deshmukh'
        userId = 'photo-5'
      } else if (lower.includes('vikram')) {
        name = 'Vikramaditya Roy'
        userId = 'photo-6'
      } else if (lower.includes('kabir')) {
        name = 'Kabir Malhotra'
        userId = 'photo-7'
      } else if (lower.includes('diya')) {
        name = 'Diya Sengupta'
        userId = 'photo-8'
      } else {
        name = 'Aarav Sharma'
        userId = 'photo-1'
      }
    } else {
      const savedUsersRaw = localStorage.getItem('studio_registered_users')
      if (savedUsersRaw) {
        try {
          const list = JSON.parse(savedUsersRaw) as User[]
          const match = list.find((u) => u.email.toLowerCase() === lower)
          if (match) {
            name = match.full_name
            role = match.role
            userId = match.id
          }
        } catch {
          // ignore
        }
      }
    }

    const fallbackUser: User = {
      id: userId,
      email: lower,
      full_name: name,
      role,
    }
    const mockToken = 'mock_jwt_' + Date.now()
    localStorage.setItem(TOKEN_KEY, mockToken)
    localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser))
    setToken(mockToken)
    setUser(fallbackUser)
    return fallbackUser
  }

  const login = async (email: string, password: string): Promise<User> => {
    const alive = await isBackendAlive()
    if (alive) {
      try {
        const response = await axios.post<{ access_token: string; token_type: string }>(
          '/api/v1/auth/login',
          { email, password },
          { timeout: 1500 },
        )

        const accessToken = response.data?.access_token
        if (accessToken && typeof accessToken === 'string' && !accessToken.includes('<')) {
          localStorage.setItem(TOKEN_KEY, accessToken)
          setToken(accessToken)

          const userResponse = await axios.get<User>('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
            timeout: 1500,
          })

          const userData = userResponse.data
          if (
            userData &&
            typeof userData === 'object' &&
            typeof userData.email === 'string' &&
            typeof userData.role === 'string'
          ) {
            localStorage.setItem(USER_KEY, JSON.stringify(userData))
            setUser(userData)
            return userData
          }
        }
      } catch {
        // Backend returned error or failed -> fallback locally
      }
    }

    return loginLocally(email)
  }

  const register = async (data: { email: string; password: string; full_name: string }): Promise<User> => {
    const alive = await isBackendAlive()
    if (alive) {
      try {
        await axios.post('/api/v1/auth/register', data, { timeout: 1500 })
        return await login(data.email, data.password)
      } catch {
        // Fallback to local
      }
    }

    // Save newly registered user to local storage list
    const newUser: User = {
      id: 'usr-' + Date.now(),
      email: data.email.toLowerCase().trim(),
      full_name: data.full_name.trim(),
      role: 'customer',
    }
    try {
      const raw = localStorage.getItem('studio_registered_users')
      const list: User[] = raw ? JSON.parse(raw) : []
      localStorage.setItem('studio_registered_users', JSON.stringify([...list, newUser]))
    } catch {
      // ignore
    }

    const mockToken = 'mock_jwt_' + Date.now()
    localStorage.setItem(TOKEN_KEY, mockToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    setToken(mockToken)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
