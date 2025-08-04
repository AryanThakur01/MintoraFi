import { z } from 'zod'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { AppSidebar } from '@/components/custom/app-sidebar'
import { RouteProtectorHOC } from '@/components/custom/route-protector-hoc'

export const Route = createRootRoute({
  component: RouteProtectorHOC(RootComponent),
  validateSearch: z.object({
    callbackUrl: z.string().optional(),
  }),
})

function RootComponent() {
  const location = useLocation()
  const isApp = !location.pathname.startsWith('/auth')
  return (
    <div className="bg-background">
      {isApp ? (
        <AppSidebar variant="inset">
          <Outlet />
        </AppSidebar>
      ) : (
        <Outlet />
      )}
    </div>
  )
}
