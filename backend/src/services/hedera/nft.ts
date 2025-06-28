import { PrivateKey, TokenCreateTransaction, TokenMintTransaction, TokenSupplyType, TokenType, TransactionReceipt } from '@hashgraph/sdk'
import { HederaAccount } from '@prisma/client'
import { hederaClient } from '../../utils/hedera'
import { settings } from '../../settings'
import { TokenName, TokenSymbol } from '../../data/enumerators'

export class NftService {
  private hederaAccount: HederaAccount
  private supplyKey: PrivateKey
  constructor(hederaAccount: HederaAccount) {
    this.supplyKey = PrivateKey.fromStringDer(settings.hederaSupplyKey)
    this.hederaAccount = hederaAccount
  }

  async createNft(): Promise<TransactionReceipt> {
    const supplyKey = this.supplyKey
    const userAccountId = this.hederaAccount.accountId
    const userAccountKey = PrivateKey.fromStringDer(this.hederaAccount.privateKey)

    const nftCreate = new TokenCreateTransaction()
      .setTokenType(TokenType.NonFungibleUnique)
      .setTokenName(TokenName.INVOICE)
      .setTokenSymbol(TokenSymbol.INV)
      .setSupplyType(TokenSupplyType.Infinite)
      .setInitialSupply(0)
      .setDecimals(0)
      .setTreasuryAccountId(userAccountId)
      .setSupplyKey(supplyKey)
      .freezeWith(hederaClient)

    const nftCreateTxSign = await nftCreate.sign(userAccountKey)
    const nftCreateTxSubmit = await nftCreateTxSign.execute(hederaClient)
    const nftCreateTxReceipt = await nftCreateTxSubmit.getReceipt(hederaClient)
    return nftCreateTxReceipt
  }

  async mintNft(tokenId: string, ipfsUrl: string): Promise<TransactionReceipt> {
    const supplyKey = this.supplyKey

    const CID: Uint8Array[] = [Buffer.from(ipfsUrl)]

    const mintTx = new TokenMintTransaction().setTokenId(tokenId).setMetadata(CID).freezeWith(hederaClient)

    const mintNftTxSign = await mintTx.sign(supplyKey)
    const mintNftTxSubmit = await mintNftTxSign.execute(hederaClient)
    const mintNftTxReceipt = await mintNftTxSubmit.getReceipt(hederaClient)

    return mintNftTxReceipt
  }
}
