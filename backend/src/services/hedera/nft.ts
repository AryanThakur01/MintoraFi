import { PrivateKey, TokenCreateTransaction, TokenMintTransaction, TokenSupplyType, TokenType, TransactionReceipt } from '@hashgraph/sdk'
import { HederaAccount, InvoiceNftMarketplace } from '@prisma/client'
import { hederaClient } from '../../utils/hedera'
import { settings } from '../../settings'
import { TokenName, TokenSymbol } from '../../data/enumerators'
import { HederaAccountService } from './account'
import { prisma } from '../../utils/prisma'
import { TMarketplaceFilters, TMarketplaceNft } from '../../serializers/nft'

export class NftService extends HederaAccountService {
  private hederaAccount: HederaAccount
  private supplyKey: PrivateKey

  constructor(hederaAccount: HederaAccount) {
    super()
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

  async toggleMarketplace(tokenId: string, serial_number: number, userId: string): Promise<InvoiceNftMarketplace> {
    const nftInfo = await this.getNftInfo(tokenId)
    const currentNft = nftInfo.nfts.find((nft) => nft.serial_number === serial_number)
    if (!currentNft) throw new Error('NFT not found')
    const previousInvoice = await prisma.invoiceNftMarketplace.findUnique({
      where: {
        userId_tokenId_serialNumber: {
          userId,
          tokenId,
          serialNumber: currentNft.serial_number
        }
      }
    })
    const invoice = await prisma.invoiceNftMarketplace.upsert({
      create: {
        userId,
        tokenId,
        serialNumber: currentNft.serial_number,
        metadata: currentNft.metadata,
        forSale: !previousInvoice?.forSale
      },
      update: {
        forSale: !previousInvoice?.forSale,
      },
      where: {
        userId_tokenId_serialNumber: {
          userId,
          tokenId,
          serialNumber: currentNft.serial_number
        }
      }
    })
    return invoice
  }

  async getMarketplace(filter: TMarketplaceFilters): Promise<InvoiceNftMarketplace[]> {
    const { userId, tokenId, serialNumber, limit = 10, offset = 0 } = filter
    const nfts = await prisma.invoiceNftMarketplace.findMany({
      where: {
        forSale: true,
        ...(userId && { userId }),
        ...(tokenId && { tokenId }),
        ...(serialNumber && { serialNumber })
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    })
    return nfts
  }

}
