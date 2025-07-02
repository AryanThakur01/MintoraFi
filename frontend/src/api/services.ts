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
interface IFiles {
  id: string
  status: number
  data: {
    items: Array<{
      id: number
      createTime: string
      updateTime: string
      fileUuid: string
      CID: string
      CIDv1: string
      name: string
      contentType: string
      path: string
      size: number
      fileStatus: number
      link: string
    }>
  }
}
export const globalServices = {
  getUser: async () => {
    return (await axios.get<IResponse<IUser>>('/api/user/me')).data.data
  },
  getFiles: async () => {
    return (await axios.get<IResponse<IFiles>>('/api/files')).data
  },
}
