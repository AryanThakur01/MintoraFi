import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { assets } from './assets'
import { useState, type FormEvent } from 'react'
import { useRequestOtp } from './api/hooks'
import { Button } from '@/components/custom/button'
import { useRouter, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'

export const LoginForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const { callbackUrl } = useSearch({ from: '/auth/' })
  const router = useRouter()
  const [email, setEmail] = useState('')
  const { mutateAsync, isPending } = useRequestOtp()
  const authenticate = async (e: FormEvent) => {
    try {
      e.preventDefault()
      await mutateAsync(email)
      router.navigate({ to: '/auth/otp', search: { email, callbackUrl } })
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card className="overflow-hidden p-0 border-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={authenticate}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Welcome</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your {import.meta.env.VITE_APP_NAME} account
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!email || isPending}
                    isLoading={isPending}
                  >
                    Login
                  </Button>
                </div>
              </form>
              <div className="bg-muted relative hidden md:block">
                <DotLottieReact src={assets.lockAnimation} autoplay loop />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
