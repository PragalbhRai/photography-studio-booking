import { redirect } from '@tanstack/react-router'
import type { RouterContext } from './router-context'
import type { User } from './types'

interface RequireRoleOptions {
  context: RouterContext
  location: { href: string }
  roles: string[]
}

export function requireRole({ context, location, roles }: RequireRoleOptions) {
  let user: User | null = context?.auth?.user || null
  if (!user || typeof user !== 'object' || typeof user.role !== 'string') {
    try {
      const raw = localStorage.getItem('photography_studio_user')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && typeof parsed.role === 'string') {
          user = parsed as User
        }
      }
    } catch {
      // ignore
    }
  }

  if (!user || typeof user !== 'object' || typeof user.role !== 'string') {
    throw redirect({
      to: '/login',
      search: { redirect: location.href },
    })
  }

  if (!roles.includes(user.role)) {
    const fallback =
      user.role === 'admin'
        ? '/admin'
        : user.role === 'photographer'
        ? '/photographer'
        : '/dashboard'
    throw redirect({ to: fallback })
  }
}
