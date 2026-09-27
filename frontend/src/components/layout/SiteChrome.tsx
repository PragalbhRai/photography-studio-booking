import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

const NAV = [
  { to: '/', hash: 'work', label: 'Work' },
  { to: '/packages', label: 'Packages' },
  { to: '/photographers', label: 'Photographers' },
  { to: '/studio-lighting', label: '💡 3D Light Lab' },
  { to: '/book', label: 'Book' },
] as const

export function SiteHeader() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const dashboard =
    user?.role === 'admin' ? '/admin' : user?.role === 'photographer' ? '/photographer' : '/dashboard'

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-ink focus:px-3 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-site items-center justify-between px-5 py-4 md:px-8">
        <Link to="/" className="flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="text-[10px] uppercase tracking-brand text-brass">Est. studio</span>
          <span className="font-display text-2xl tracking-tight">Northlight</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={'hash' in item ? item.hash : undefined}
              className={cn(
                'text-xs uppercase tracking-[0.18em] text-mute transition hover:text-ink',
                pathname === item.to && 'text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <>
              <Link to={dashboard} className="text-xs uppercase tracking-[0.18em] text-mute hover:text-ink">
                Dashboard
              </Link>
              <Button size="sm" variant="secondary" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" search={{ redirect: undefined }} className="text-xs uppercase tracking-[0.18em] text-mute hover:text-ink">
                Login
              </Link>
              <Link to="/register" search={{ redirect: undefined }}>
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center border border-line lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span className={cn('h-px w-5 bg-ink transition', open && 'translate-y-[4px] rotate-45')} />
            <span className={cn('h-px w-5 bg-ink transition', open && '-translate-y-[4px] -rotate-45')} />
          </span>
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper px-5 py-6 lg:hidden">
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                hash={'hash' in item ? item.hash : undefined}
                className="text-sm uppercase tracking-[0.18em]"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-line pt-4">
              {user ? (
                <>
                  <Link to={dashboard} onClick={() => setOpen(false)} className="text-sm uppercase tracking-[0.18em]">
                    Dashboard
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" search={{ redirect: undefined }} onClick={() => setOpen(false)} className="text-sm uppercase tracking-[0.18em]">
                    Login
                  </Link>
                  <Link to="/register" search={{ redirect: undefined }} onClick={() => setOpen(false)}>
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-cream">
      <div className="mx-auto grid max-w-site gap-10 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <p className="text-[10px] uppercase tracking-brand text-brass">Northlight Studio</p>
          <p className="mt-4 max-w-md font-display text-4xl leading-tight">Moments, held with care.</p>
          <p className="mt-4 max-w-sm text-sm text-cream/70">
            By appointment in Mumbai. Sessions across India, with travel by arrangement.
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50">Studio</p>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>
              <Link to="/" hash="work" className="hover:text-cream">
                Work
              </Link>
            </li>
            <li>
              <Link to="/packages" className="hover:text-cream">
                Packages
              </Link>
            </li>
            <li>
              <Link to="/photographers" className="hover:text-cream">
                Photographers
              </Link>
            </li>
            <li>
              <Link to="/studio-lighting" className="hover:text-cream text-brass">
                💡 3D Virtual Light Lab
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-cream">
                Booking
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50">Visit</p>
          <p className="mt-4 text-sm leading-relaxed text-cream/80">
            14, Ballard Estate
            <br />
            Mumbai 400001
            <br />
            studio@northlight.example
            <br />
            +91 22 4000 1200
          </p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-cream/40">Instagram · Pinterest</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-[11px] uppercase tracking-[0.16em] text-cream/40 md:px-8">
        © {new Date().getFullYear()} Northlight Studio
      </div>
    </footer>
  )
}
