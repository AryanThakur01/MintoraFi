import { AccountCreateTransaction, PrivateKey } from '@hashgraph/sdk'
import { hederaClient } from '../../utils/hedera'
import { IHederaNewAccount } from '../../interfaces/hedera'

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
}
