import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { getErrorMessage } from '@/lib/errors'
import { IMAGES } from '@/lib/images'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Photo } from '@/components/ui/Photo'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
})

function LoginPage() {
  const { login, user, logout } = useAuth()
  const { redirect } = Route.useSearch()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const goAfterAuth = (role: string) => {
    if (redirect) {
      window.location.href = redirect
      return
    }
    const target = role === 'admin' ? '/admin' : role === 'photographer' ? '/photographer' : '/dashboard'
    window.location.href = target
  }

  const handleQuickDemo = async (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
    setErrors({})
    setGeneralError(null)
    setIsSubmitting(true)
    try {
      const next = await login(demoEmail, 'password123')
      goAfterAuth(next.role)
    } catch (err) {
      setGeneralError(getErrorMessage(err, 'Failed to sign in'))
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    const nextErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address'
    } else if (!email.includes('@')) {
      nextErrors.email = 'Please enter a valid email address'
    }
    if (!password) {
      nextErrors.password = 'Please enter your password'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const next = await login(email.trim(), password)
      goAfterAuth(next.role)
    } catch (err) {
      setGeneralError(getErrorMessage(err, 'Incorrect email or password'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[80vh] md:grid-cols-2">
      <div className="hidden md:block">
        <Photo src={IMAGES.login} alt="Studio photography portrait" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center px-6 py-16 md:px-16">
        <div className="w-full max-w-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Account Access</p>
          <h1 className="mt-3 font-display text-5xl">Welcome back</h1>
          <p className="mt-2 text-sm text-mute">Sign in to manage your sittings, schedule, or gallery.</p>

          {user && (
            <div className="mt-6 rounded-md border border-line bg-cream p-4">
              <p className="text-xs uppercase tracking-wider text-brass font-semibold">Active Session</p>
              <p className="mt-1 text-sm text-ink">
                Currently signed in as <span className="font-semibold">{user.full_name}</span> ({user.role})
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => goAfterAuth(user.role)}>
                  Go to {user.role === 'admin' ? 'Admin' : user.role === 'photographer' ? 'Studio' : 'Dashboard'}
                </Button>
                <Button size="sm" variant="secondary" onClick={logout}>
                  Sign Out
                </Button>
              </div>
            </div>
          )}

          {/* Quick 1-Click Demo Buttons */}
          <div className="mt-6 rounded-md border border-line/70 bg-cream/50 p-4">
            <p className="text-[11px] uppercase tracking-wider text-brass font-semibold">1-Click Quick Demo Sign In</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('customer@example.com')}
                className="rounded border border-line bg-paper px-2.5 py-1.5 text-left text-xs hover:border-ink hover:bg-cream transition"
              >
                <span className="block font-medium text-ink">👤 Client Demo</span>
                <span className="text-[10px] text-mute">customer@example.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('aarav@studio.com')}
                className="rounded border border-line bg-paper px-2.5 py-1.5 text-left text-xs hover:border-ink hover:bg-cream transition"
              >
                <span className="block font-medium text-ink">📸 Aarav (Male Photog)</span>
                <span className="text-[10px] text-mute">aarav@studio.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ananya@studio.com')}
                className="rounded border border-line bg-paper px-2.5 py-1.5 text-left text-xs hover:border-ink hover:bg-cream transition"
              >
                <span className="block font-medium text-ink">📸 Ananya (Female Photog)</span>
                <span className="text-[10px] text-mute">ananya@studio.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin@studio.com')}
                className="rounded border border-line bg-paper px-2.5 py-1.5 text-left text-xs hover:border-ink hover:bg-cream transition"
              >
                <span className="block font-medium text-ink">👑 Studio Admin</span>
                <span className="text-[10px] text-mute">admin@studio.com</span>
              </button>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder=""
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              error={errors.email}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder=""
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              error={errors.password}
            />

            {generalError && <p className="text-sm text-red-800">{generalError}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Login'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-mute">
            New to the studio?{' '}
            <Link to="/register" search={{ redirect }} className="text-ink underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
