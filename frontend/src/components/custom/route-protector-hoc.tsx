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
      if (isError && !location.pathname.startsWith('/auth')) {
        navigate({ to: '/auth', search: { callbackUrl: location.pathname }, replace: true })
        setIsRouteSettled(true)
      } else if (me && location.pathname.startsWith('/auth')) {
        navigate({ to: '/', replace: true })
        setIsRouteSettled(true)
      }
    }, [isError, navigate, location.pathname, me])

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
