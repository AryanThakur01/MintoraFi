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
