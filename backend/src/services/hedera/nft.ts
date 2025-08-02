import { AccountId, Client, PrivateKey, TokenCreateTransaction, TokenId, TokenMintTransaction, TokenSupplyType, TokenType, TransactionReceipt } from '@hashgraph/sdk'
import { HederaAccount, InvoiceNftMarketplace } from '@prisma/client'
import { generateHederaClient } from '../../utils/hedera'
import { settings } from '../../settings'
import { TokenName, TokenSymbol } from '../../data/enumerators'
import { HederaAccountService } from './account'
import { prisma } from '../../utils/prisma'
import { TMarketplaceFilters } from '../../serializers/nft'
import { NftTransactionContract } from './nft-transaction-contract'
import { NftMetadataService } from '../nft-metadata'

export class NftService extends HederaAccountService {
  private hederaAccount: HederaAccount
  private supplyKey: PrivateKey
  private nftTransactionContract: NftTransactionContract
  private accountClient: Client

  constructor(hederaAccount: HederaAccount) {
    super()
    this.supplyKey = PrivateKey.fromStringDer(hederaAccount.privateKey)
    this.hederaAccount = hederaAccount

    const accountClient = generateHederaClient(hederaAccount.accountId, hederaAccount.privateKey)
    this.accountClient = accountClient
    this.nftTransactionContract = new NftTransactionContract(accountClient, settings.hederaNftTransactionContractAddress)
  }

  private async _setNftPriceInContract(tokenId: string, serialNumber: number, costInHbars: number): Promise<void> {
    const tokenAddress = TokenId.fromString(tokenId).toSolidityAddress()
    const account = {accountId: AccountId.fromString(this.hederaAccount.accountId), accountKey: PrivateKey.fromStringDer(this.hederaAccount.privateKey)}
    const token = {address: tokenAddress, serialNumber: serialNumber}
    await this.nftTransactionContract.setPriceForNft(account, token, costInHbars)
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
      .freezeWith(this.accountClient)

    const nftCreateTxSign = await nftCreate.sign(userAccountKey)
    const nftCreateTxSubmit = await nftCreateTxSign.execute(this.accountClient)
    const nftCreateTxReceipt = await nftCreateTxSubmit.getReceipt(this.accountClient)
    return nftCreateTxReceipt
  }

  async mintNft(tokenId: string, ipfsUrl: string, realPriceInHbars: number): Promise<TransactionReceipt> {
    const nftMetadataService = new NftMetadataService()
    const supplyKey = this.supplyKey

    const CID: Uint8Array[] = [Buffer.from(nftMetadataService.encodeFilesCid(ipfsUrl, realPriceInHbars))]

    const mintTx = new TokenMintTransaction().setTokenId(tokenId).setMetadata(CID).freezeWith(this.accountClient)

    const mintNftTxSign = await mintTx.sign(supplyKey)
    const mintNftTxSubmit = await mintNftTxSign.execute(this.accountClient)
    const mintNftTxReceipt = await mintNftTxSubmit.getReceipt(this.accountClient)

    return mintNftTxReceipt
  }
  
  async toggleMarketplace(tokenId: string, serial_number: number, userId: string, costInHbars: number): Promise<InvoiceNftMarketplace> {
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
      },
      select: { forSale: true }
    })
    if (!previousInvoice || !previousInvoice.forSale) await this._setNftPriceInContract(tokenId, currentNft.serial_number, costInHbars)
    const invoice = await prisma.invoiceNftMarketplace.upsert({
      create: {
        userId,
        tokenId,
        serialNumber: currentNft.serial_number,
        metadata: currentNft.metadata,
        forSale: !previousInvoice?.forSale,
        costInHbars: costInHbars
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

  async purchaseNft(tokenId: string, serialNumber: number): Promise<TransactionReceipt> {
    const tokenAddress = TokenId.fromString(tokenId).toSolidityAddress()
    const account = {accountId: AccountId.fromString(this.hederaAccount.accountId), accountKey: PrivateKey.fromStringDer(this.hederaAccount.privateKey)}
    const token = {address: tokenAddress, serialNumber: serialNumber}
    const nft = await prisma.invoiceNftMarketplace.findFirst({
      where: { tokenId, serialNumber }
    })
    if (!nft || !nft.forSale) throw new Error('NFT not found or not for sale anymore')
    const tx = await this.nftTransactionContract.purchaseNft(
      account,
      token,
      nft?.costInHbars
    )
    await prisma.invoiceNftMarketplace.deleteMany({
      where: { tokenId, serialNumber }
    })
    return tx
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
