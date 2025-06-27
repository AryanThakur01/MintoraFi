import { axios } from '@/lib/axios'
import { type IResponse } from '../interfaces/api'

export const authServices = {
  requestOtp: async (email: string) => {
    return (await axios.post<IResponse<null>>('/api/auth/request-otp', { email })).data
  },
}
