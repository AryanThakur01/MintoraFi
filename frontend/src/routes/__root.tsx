import * as React from 'react'
import { z } from 'zod'
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { axios } from '@/lib/axios'
import { isAxiosError } from 'axios'

export const Route = createRootRoute({
  component: RootComponent,
  validateSearch: z.object({
    callbackUrl: z.string().optional(),
  }),
  beforeLoad: async ({ location, search }) => {
    try {
      await axios.get('/api/user/me')
      if (location.pathname.startsWith('/auth')) throw redirect({ to: search.callbackUrl ?? '/' })
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === 401 &&
        !location.pathname.startsWith('/auth')
      ) {
        throw redirect({
          to: search.callbackUrl ?? '/auth',
          search: { callbackUrl: location.pathname },
        })
      } else throw error
    }
  },
})

function RootComponent() {
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add('dark')
  }, [])
  return (
    <div className="bg-background">
      <Outlet />
    </div>
  )
}
