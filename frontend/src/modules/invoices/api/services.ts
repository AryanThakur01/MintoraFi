import type { IResponse } from '@/interfaces/api'
import { axios } from '@/lib/axios'

export interface ITokenInfo {
  tokenId: string
  balance: number
  symbol: string
}
interface IAccount {
  hbars: string
  tokens: ITokenInfo[]
}
interface IMintedNftInfo {
  account_id: string
  created_timestamp: string
  delegating_spender: string | null
  deleted: boolean
  metadata: string
  modified_timestamp: string
  serial_number: number
  spender: string | null
  token_id: string
}

interface INftTemplateInfo {
  admin_key: string | null
  auto_renew_account: string
  auto_renew_period: number
  created_timestamp: string
  decimals: string
  deleted: boolean
  expiry_timestamp: string
  fee_schedule_key: string | null
  freeze_default: boolean
  freeze_key: string | null
  initial_supply: string
  kyc_key: string | null
  max_supply: string
  memo: string
  metadata: string
  metadata_key: string | null
  modified_timestamp: string
  name: string
  pause_key: string | null
  pause_status: string
  supply_key: {
    _type: string
    key: string
  }
  supply_type: string
  symbol: string
  token_id: string
  total_supply: string
  treasury_account_id: string
  type: string
  wipe_key: string | null
}
interface IInvoiceInfo {
  details: INftTemplateInfo
  nfts: IMintedNftInfo[]
}
interface IMintInvoiceNftRequest {
  tokenId: string
  metadataCID: string
}
export const globalServices = {
  getAccount: async () => {
    return (await axios.get<IResponse<IAccount>>('/api/user/account')).data.data
  },
  createInvoice: async () => {
    return (await axios.post<IResponse<unknown>>('/api/nft/create')).data
  },
  mintInvoiceNft: async (data: IMintInvoiceNftRequest) => {
    return (await axios.post<IResponse<unknown>>(`/api/nft/mint`, data)).data
  },
  getInvoiceNftInfo: async (tokenId: string) => {
    return (await axios.get<IResponse<IInvoiceInfo>>(`/api/nft/${tokenId}`)).data
  },
}
