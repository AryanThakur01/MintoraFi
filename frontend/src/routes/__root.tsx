import * as React from 'react'
import { z } from 'zod'
import { Outlet, createRootRoute, redirect, useLocation } from '@tanstack/react-router'
import { axios } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { AppSidebar } from '@/components/custom/app-sidebar'

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: z.object({
    callbackUrl: z.string().optional(),
  }),
  beforeLoad: async ({ location, search }) => {
    let isAuthenticated = false
    try {
      await axios.get('/api/user/me')
      isAuthenticated = true
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === 401 &&
        !location.pathname.startsWith('/auth')
      )
        throw redirect({
          to: search.callbackUrl ?? '/auth',
          search: { callbackUrl: location.pathname },
        })
    }
    if (isAuthenticated && location.pathname.startsWith('/auth'))
      throw redirect({ to: search.callbackUrl ?? '/' })
  },
})

function RootComponent() {
  const location = useLocation()
  const isApp = !location.pathname.startsWith('/auth')
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add('dark')
  }, [])
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
