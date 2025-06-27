import express from 'express'
import { ResponseMessage, ResponseStatus } from '../data/enumerators.ts'
import { sendResponse } from '../utils/send-response.ts'
import { prisma } from '../utils/prisma.ts'
const router = express.Router()
router.get('/me', async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(res, ResponseStatus.UNAUTHORIZED, 'Session expired or user not authenticated')
      return
    }
    const userHederaAccount = await prisma.hederaAccount.findUnique({
      where: { userId: req.user.id },
      select: { accountId: true, publicKey: true },
    })
    sendResponse(res, ResponseStatus.SUCCESS, 'User details retrieved successfully', { ...req.user, hederaAccount: userHederaAccount })
  } catch (error) {
    if (error instanceof Error) sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    else sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
  }
})

export default router
