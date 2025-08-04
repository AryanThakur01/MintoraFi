import { useMe } from '@/api/hooks'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export const RouteProtectorHOC = (Component: React.ComponentType) => {
  return function WrappedComponent(props: React.ComponentProps<typeof Component>) {
    const [isRouteSettled, setIsRouteSettled] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { data: me, isLoading, isError } = useMe()

    useEffect(() => {
      const isAuthPage = location.pathname.startsWith('/auth')
      if (isLoading) return
      if (isError && !isAuthPage) {
        navigate({ to: '/auth', search: { callbackUrl: location.pathname }, replace: true })
        return
      } else if (me && isAuthPage) {
        navigate({ to: '/', replace: true })
        return
      } else if (!isLoading) setTimeout(() => setIsRouteSettled(true), 100)
    }, [isError, navigate, location.pathname, me, isLoading])

    useEffect(() => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add('dark')
    }, [])

    if (isLoading || !isRouteSettled) {
      return (
        <div className="bg-background w-screen h-screen flex items-center justify-center">
          <Loader2 className="animate-spin size-10" />
        </div>
      )
    }

    return <Component {...props} />
  }
}
