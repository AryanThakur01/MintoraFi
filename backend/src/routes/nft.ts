import express from 'express'
import { NftService } from '../services/hedera/nft'
import { sendResponse } from '../utils/send-response'
import { ResponseMessage, ResponseStatus } from '../data/enumerators'
import { prisma } from '../utils/prisma'
import { hederaError } from '../utils/hedera'

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
    const hederaErrorDetails = hederaError(error)
    if (hederaErrorDetails) {
      sendResponse(res, ResponseStatus.BAD_REQUEST, hederaErrorDetails)
      return
    }
    sendResponse(res, ResponseStatus.BAD_REQUEST, ResponseMessage.INTERNAL_SERVER_ERROR)
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
    const hederaErrorDetails = hederaError(error)
    if (hederaErrorDetails) {
      sendResponse(res, ResponseStatus.BAD_REQUEST, hederaErrorDetails)
      return
    }
    sendResponse(res, ResponseStatus.BAD_REQUEST, ResponseMessage.INTERNAL_SERVER_ERROR)
  }
})

export default router
