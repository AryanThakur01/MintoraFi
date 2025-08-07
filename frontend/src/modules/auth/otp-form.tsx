import { Card, CardContent } from '@/components/ui/card'
import { cn, isDefaultError } from '@/lib/utils'
import { useState, useEffect, type FormEvent } from 'react'
import { useVerifyOtp, useResendOtp } from './api/hooks'
import { Button } from '@/components/custom/button'
import { KeyRound, ArrowLeft, Timer } from 'lucide-react'
import { InputOTP } from './components/input-otp'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

interface OtpFormProps extends React.ComponentProps<'div'> {
  email: string
  callbackUrl?: string
  onBack?: () => void
}

export const OtpForm = ({ className, callbackUrl, email, onBack, ...props }: OtpFormProps) => {
  const queryClient = useQueryClient()
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const { mutateAsync: verifyOtp, isPending: isVerifying } = useVerifyOtp()
  const { mutateAsync: resendOtp, isPending: isResending } = useResendOtp()
  const router = useRouter()

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleVerify = async (e: FormEvent) => {
    try {
      e.preventDefault()
      if (otp.length !== 6) throw new Error('Please enter a valid 6-digit code.')
      await verifyOtp({ email, otp })
      await queryClient.invalidateQueries({ queryKey: ['user-me'] })
      router.navigate({ to: callbackUrl ?? '/' })
    } catch (error) {
      if (error instanceof AxiosError) {
        const err = error.response?.data
        if (isDefaultError(err)) toast.error(err.message)
      }
    }
  }

  const handleResend = async () => {
    try {
      await resendOtp(email)
      setTimeLeft(60)
      setCanResend(false)
      setOtp('')
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className={cn('flex flex-col gap-6', className)} {...props}>
          <Card className="overflow-hidden p-0 shadow-2xl border-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleVerify}>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onBack}
                      className="p-0 h-auto hover:bg-transparent"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Back to login</span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <KeyRound className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <p className="text-muted-foreground text-balance mb-2">
                      We've sent a 6-digit code to
                    </p>
                    <p className="text-sm font-medium">{email}</p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <InputOTP
                      length={6}
                      value={otp}
                      onChange={(value) => typeof value === 'string' && setOtp(value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={otp.length !== 6 || isVerifying}
                    isLoading={isVerifying}
                  >
                    Verify Code
                  </Button>

                  <div className="text-center">
                    {!canResend ? (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Timer className="h-4 w-4" />
                        <span>Resend code in {formatTime(timeLeft)}</span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResend}
                        disabled={isResending}
                        isLoading={isResending}
                        className="text-primary hover:text-primary/90"
                      >
                        Resend verification code
                      </Button>
                    )}
                  </div>
                </div>
              </form>

              <div className="bg-muted relative hidden md:flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mb-6 rounded-full bg-primary/20 p-6 mx-auto w-fit">
                    <KeyRound className="h-16 w-16 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Security First</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter the 6-digit verification code we sent to your email address.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Check your spam folder if you don't see the email</p>
                    <p>• The code expires in 10 minutes</p>
                    <p>• Contact support if you need help</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
