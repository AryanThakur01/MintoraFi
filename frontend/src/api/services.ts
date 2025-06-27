import { axios } from '@/lib/axios'

export const globalServices = {
  getUser: async () => {
    return await axios.get('/api/user/me')
  },
}
