import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { getErrorMessage } from '@/lib/errors'
import { IMAGES } from '@/lib/images'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Photo } from '@/components/ui/Photo'

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: RegisterPage,
})

function RegisterPage() {
  const { register: registerUser, user, logout } = useAuth()
  const { redirect } = Route.useSearch()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({})
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

  const handleFillDemo = () => {
    setFullName('Rahul Sharma')
    setEmail('rahul@example.com')
    setPassword('password123')
    setErrors({})
    setGeneralError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError(null)

    const nextErrors: { fullName?: string; email?: string; password?: string } = {}
    if (!fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name'
    }
    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address'
    } else if (!email.includes('@') || !email.includes('.')) {
      nextErrors.email = 'Please enter a valid email address (e.g. name@domain.com)'
    }
    if (!password) {
      nextErrors.password = 'Please enter a password'
    } else if (password.length < 4) {
      nextErrors.password = 'Password must be at least 4 characters'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      const next = await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      })
      goAfterAuth(next.role)
    } catch (err) {
      setGeneralError(getErrorMessage(err, 'Could not create account. Please try again.'))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[80vh] md:grid-cols-2">
      <div className="hidden md:block">
        <Photo src={IMAGES.register} alt="Fine art bridal and studio portrait" className="h-full w-full object-cover" />
      </div>
      <div className="flex items-center px-6 py-16 md:px-16">
        <div className="w-full max-w-md">
          <p className="text-[11px] uppercase tracking-[0.22em] text-brass">Client Registration</p>
          <h1 className="mt-3 font-display text-5xl">Join the studio</h1>
          <p className="mt-2 text-sm text-mute">Create a customer account to book sittings, choose photographers, and view your gallery.</p>

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

          {/* 1-Click Demo Fill */}
          <div className="mt-6 rounded-md border border-line/70 bg-cream/50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-brass font-semibold">Quick Test Account</p>
                <p className="text-xs text-mute">Populate sample client details in one click</p>
              </div>
              <Button type="button" size="sm" variant="secondary" onClick={handleFillDemo}>
                ⚡ Autofill Demo
              </Button>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Full name"
              name="full_name"
              autoComplete="name"
              placeholder=""
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }))
              }}
              error={errors.fullName}
            />

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
              autoComplete="new-password"
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
              {isSubmitting ? 'Creating account…' : 'Register'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-mute">
            Already registered?{' '}
            <Link to="/login" search={{ redirect }} className="text-ink underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
