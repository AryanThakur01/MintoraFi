import { AccountCreateTransaction, AccountInfo, AccountInfoQuery, PrivateKey } from '@hashgraph/sdk'
import { hederaClient } from '../../utils/hedera'
import { IHederaNewAccount, INftTemplateInfo, ITokenInfo } from '../../interfaces/hedera'
import TokenRelationship from '@hashgraph/sdk/lib/account/TokenRelationship'
import axios, { AxiosInstance } from 'axios'
import { settings } from '../../settings'
import { Network } from '../../data/enumerators'

export class HederaAccountService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: settings.network === Network.Testnet ? 'https://testnet.mirrornode.hedera.com' : 'https://mainnet.mirrornode.hedera.com',
    })
  }

  async createAccount(): Promise<IHederaNewAccount> {
    const ecdsaKey = PrivateKey.generateECDSA()
    const ecdsaPublicKey = ecdsaKey.publicKey
    const transaction = new AccountCreateTransaction().setKeyWithoutAlias(ecdsaPublicKey).setInitialBalance(1)
    const txResponse = await transaction.execute(hederaClient)
    const receipt = await txResponse.getReceipt(hederaClient)
    const accountId = receipt.accountId

    if (!accountId) {
      throw new Error(`Failed to create a new Hedera account`)
    }
    return {
      accountId: accountId.toString(),
      privateKey: ecdsaKey._key.toStringDer(),
      publicKey: ecdsaPublicKey.toStringDer(),
    }
  }

  async getAccountInfo(accountId: string): Promise<AccountInfo> {
    const accountInfoQuery = new AccountInfoQuery().setAccountId(accountId)
    const accountInfo = await accountInfoQuery.execute(hederaClient)
    return accountInfo
  }

  async getNftInfo(tokenId: string): Promise<{ details: INftTemplateInfo; nfts: INftTemplateInfo[] }> {
    const { data: details } = await this.axios.get<INftTemplateInfo>(`/api/v1/tokens/${tokenId}`)
    const {
      data: { nfts },
    } = await this.axios.get<{ nfts: INftTemplateInfo[] }>(`/api/v1/tokens/${tokenId}/nfts`)
    return { details, nfts }
  }

  parseTokenInfoFromRelationsMap(tokenRelationships: Map<string, TokenRelationship>): ITokenInfo[] {
    const tokenInfo: ITokenInfo[] = []
    for (const [tokenId, relationship] of tokenRelationships) {
      tokenInfo.push({
        tokenId: tokenId,
        balance: relationship.balance.toNumber(),
        symbol: relationship.symbol,
      })
    }
    return tokenInfo
  }
}
