import { useMutation, useQueryClient } from '@tanstack/react-query'
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

export const useVerifyOtp = () => {
  return useMutation({
    mutationKey: ['verify-otp'],
    mutationFn: authServices.verifyOtp,
    onSuccess: (data) => toast.success(data.message),
  })
}

export const useResendOtp = () => {
  return useMutation({
    mutationKey: ['resend-otp'],
    mutationFn: authServices.requestOtp,
    onSuccess: (data) => toast.success(data.message),
    onError: (error: AxiosError) => {
      const err = error.response?.data
      if (isDefaultError(err)) toast.error(err.message)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['logout'],
    mutationFn: authServices.logout,
    onSuccess: (data) => {
      queryClient.clear()
      toast.success(data.message)
    },
    onError: (error: AxiosError) => {
      const err = error.response?.data
      if (isDefaultError(err)) toast.error(err.message)
    },
  })
}
