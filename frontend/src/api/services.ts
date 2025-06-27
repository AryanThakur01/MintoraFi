import type { IResponse } from '@/interfaces/api'
import { axios } from '@/lib/axios'

interface IUser {
  id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
  hederaAccount: {
    accountId: string
    publicKey: string
  }
}
export const globalServices = {
  getUser: async () => {
    return (await axios.get<IResponse<IUser>>('/api/user/me')).data.data
  },
}
