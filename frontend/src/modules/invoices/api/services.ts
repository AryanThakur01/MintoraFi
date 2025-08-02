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
export interface IMintedNftInfo {
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

export interface INftTemplateInfo {
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
  realPriceInHbars: number
  tokenId: string
  metadataCID: string
}

interface IAddToMarketplaceRequest {
  tokenId: string
  serialNumber: number
  priceInHbars: number
}

export interface IMarketplaceNftFilters {
  limit?: number
  offset?: number
  tokenId?: string | undefined
  serialNumber?: number | undefined
  userId?: string | undefined
}

export interface IMarketplaceNft {
  tokenId: string
  serialNumber: number
  userId: string
  id: string
  createdAt: string
  updatedAt: string
  metadata: string
  forSale: boolean
  verified: boolean
  verificationEmail: string
  costInHbars: number
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
  getInvoiceNftInfo: async (tokenId: string, filters?: { mineOnly?: boolean }) => {
    const params = new URLSearchParams()
    if (filters?.mineOnly) params.append('mineOnly', String(filters.mineOnly))
    return (await axios.get<IResponse<IInvoiceInfo>>(`/api/nft/${tokenId}?${params.toString()}`))
      .data
  },
  addToMarketplace: async (data: IAddToMarketplaceRequest) => {
    return (await axios.post<IResponse<unknown>>(`/api/nft/marketplace`, { ...data })).data
  },
  getMarketplaceNfts: async (filters?: IMarketplaceNftFilters) => {
    const params = new URLSearchParams()
    if (filters) {
      let key: keyof IMarketplaceNftFilters
      for (key in filters) {
        if (filters[key] !== undefined) params.append(key, String(filters[key]))
      }
    }
    return (
      await axios.get<IResponse<IMarketplaceNft[]>>(`/api/nft/marketplace?${params.toString()}`)
    ).data.data
  },
  purchaseMarketplaceNft: async (data: { tokenId: string; serialNumber: number }) => {
    return (await axios.post<IResponse<unknown>>(`/api/nft/marketplace/purchase`, data)).data
  },
}
