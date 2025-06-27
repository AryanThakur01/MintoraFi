import { useMutation } from '@tanstack/react-query'
import { authServices } from './services'
import { isDefaultError } from '@/lib/utils'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

export const useRequestOtp = () => {
  return useMutation({
    mutationKey: ['request-otp'],
    mutationFn: authServices.requestOtp,
    onSuccess: (data) => toast.success(data.message),
    onError: (error: AxiosError) => {
      const err = error.response?.data
      if (isDefaultError(err)) toast.error(err.message)
    },
  })
}
