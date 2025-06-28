import { AccountCreateTransaction, AccountInfo, AccountInfoQuery, PrivateKey } from '@hashgraph/sdk'
import { hederaClient } from '../../utils/hedera'
import { IHederaNewAccount, ITokenInfo } from '../../interfaces/hedera'
import TokenRelationship from '@hashgraph/sdk/lib/account/TokenRelationship'

export class HederaAccountService {
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
