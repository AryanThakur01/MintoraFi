import express from 'express'
import { NftService } from '../services/hedera/nft'
import { sendResponse } from '../utils/send-response'
import { ResponseStatus } from '../data/enumerators'
import { prisma } from '../utils/prisma'

const router = express.Router()

router.post('/create', async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(res, ResponseStatus.UNAUTHORIZED, 'User not authenticated')
      return
    }
    const hederaAccount = await prisma.hederaAccount.findUnique({ where: { userId: req.user.id } })
    if (!hederaAccount) {
      sendResponse(res, ResponseStatus.NOT_FOUND, 'Hedera account not found for user')
      return
    }
    const nftService = new NftService(hederaAccount)
    const nft = await nftService.createNft()
    sendResponse(res, ResponseStatus.SUCCESS, 'NFT created successfully', { nftId: nft })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create NFT' })
  }
})

router.post('/mint/:tokenId', async (req, res) => {
  try {
    const tokenId = req.params.tokenId
    if (!req.user) {
      sendResponse(res, ResponseStatus.UNAUTHORIZED, 'User not authenticated')
      return
    }
    const hederaAccount = await prisma.hederaAccount.findUnique({ where: { userId: req.user.id } })
    if (!hederaAccount) {
      sendResponse(res, ResponseStatus.NOT_FOUND, 'Hedera account not found for user')
      return
    }
    const nftService = new NftService(hederaAccount)
    const nft = await nftService.mintNft(tokenId)
    sendResponse(res, ResponseStatus.SUCCESS, 'NFT minted successfully', { nft })
  } catch (error) {
    res.status(500).json({ error: 'Failed to mint NFT' })
  }
})

export default router
