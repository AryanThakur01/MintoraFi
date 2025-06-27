import express from 'express'
import { ResponseMessage, ResponseStatus } from '../data/enumerators.ts'
import { sendResponse } from '../utils/send-response.ts'
import { prisma } from '../utils/prisma.ts'
import { AuthenticityService } from '../services/authenticity.ts'
const router = express.Router()
router.get('/me', async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(res, ResponseStatus.UNAUTHORIZED, 'Session expired or user not authenticated')
      return
    }
    const [userHederaAccount, authenticity] = await Promise.all([
      prisma.hederaAccount.findUnique({
        where: { userId: req.user.id },
        select: { accountId: true, publicKey: true },
      }),
      prisma.authenticity.findFirst({
        where: { userId: req.user.id },
      }),
    ])
    sendResponse(res, ResponseStatus.SUCCESS, 'User details retrieved successfully', {
      ...req.user,
      hederaAccount: userHederaAccount,
      authenticity,
    })
  } catch (error) {
    if (error instanceof Error) sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    else sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
  }
})

router.get('/verify/domain/:domain', async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(res, ResponseStatus.UNAUTHORIZED, 'Session expired or user not authenticated')
      return
    }
    const { domain } = req.params
    const authenticityService = new AuthenticityService(req.user.id)
    const authenticity = await authenticityService.generateVerificationCode(domain)
    sendResponse(res, ResponseStatus.SUCCESS, 'Domain verification code generated successfully', authenticity)
  } catch (error) {
    if (error instanceof Error) sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    else sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
  }
})

router.post('/verify/domain', async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(res, ResponseStatus.UNAUTHORIZED, 'Session expired or user not authenticated')
      return
    }
    const authenticityService = new AuthenticityService(req.user.id)
    const authenticity = await authenticityService.verifyDomain()
    sendResponse(res, ResponseStatus.SUCCESS, 'Domain verification code generated successfully', authenticity)
  } catch (error) {
    if (error instanceof Error) sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    else sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
  }
})

export default router
