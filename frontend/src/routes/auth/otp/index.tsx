import { OtpForm } from '@/modules/auth/otp-form'
import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/otp/')({
  component: RouteComponent,
  validateSearch: z.object({
    email: z.string().email(),
    callbackUrl: z.string().optional(),
  }),
})

function RouteComponent() {
  const { email } = Route.useSearch()
  return <OtpForm email={email} />
}
