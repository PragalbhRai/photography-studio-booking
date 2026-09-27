import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteChrome'
import type { RouterContext } from '@/lib/router-context'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

function NotFound() {
  return (
    <div className="mx-auto max-w-site px-5 py-24 text-center md:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-brass">404</p>
      <h1 className="mt-4 font-display text-5xl">This page is not in the archive.</h1>
      <p className="mt-4 text-mute">The link may be outdated. Return to the studio home.</p>
    </div>
  )
}
