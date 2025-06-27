import * as React from 'react'
import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async ({ location }) => {
    if (location.pathname !== '/auth') throw redirect({ to: '/auth' })
  },
})

function RootComponent() {
  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add('dark')
  }, [])
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}
