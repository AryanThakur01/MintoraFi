import { axios } from '@/lib/axios'
import { type IResponse, type IVerifyOtpIn } from '../interfaces/api'

export const authServices = {
  requestOtp: async (email: string) => {
    return (await axios.post<IResponse<null>>('/api/auth/request-otp', { email })).data
  },
  verifyOtp: async (data: IVerifyOtpIn) => {
    return (await axios.post<IResponse<null>>('/api/auth/verify-otp', data)).data
  },
}
