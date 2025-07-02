export interface IHederaNewAccount {
  accountId: string
  privateKey: string
  publicKey: string
}

export interface ITokenInfo {
  tokenId: string
  balance: number
  symbol: string
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
  custom_fees: {
    created_timestamp: string
    fixed_fees: any[]
    royalty_fees: any[]
  }
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
