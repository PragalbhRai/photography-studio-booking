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
  if (!user) {
    try {
      const raw = localStorage.getItem('photography_studio_user')
      if (raw) {
        user = JSON.parse(raw) as User
      }
    } catch {
      // ignore
    }
  }

  if (!user) {
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
