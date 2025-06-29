import express from 'express'
import { sendResponse } from '../utils/send-response'
import { ResponseMessage, ResponseStatus } from '../data/enumerators'
import { prisma } from '../utils/prisma'
import { FileProcessor } from '../services/file-processor'
import logger from '../utils/logger/logger'
import { ApillonStorageService } from '../utils/apillon-storage'

const router = express.Router()

router.post('/upload', async (req, res) => {
  let uploadedFiles: string[] = []
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
    const apillonStorageService = new ApillonStorageService()
    const fileProcessor = new FileProcessor()

    uploadedFiles = await fileProcessor.saveFile(req, hederaAccount.userId)
    if (uploadedFiles.length !== 1) throw new Error('You can upload only one file at a time')
    const uploadedFile = await apillonStorageService.uploadFileToBucket(uploadedFiles[0], req.user.id)
    sendResponse(res, ResponseStatus.SUCCESS, 'File upload successfull', uploadedFile)
  } catch (error) {
    if (error instanceof Error) sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
  } finally {
    if (uploadedFiles.length > 0) {
      const fileProcessor = new FileProcessor()
      try {
        await fileProcessor.removeFiles(uploadedFiles)
      } catch (err) {
        logger.error(`Error removing uploaded files: ${err}`)
      }
    }
  }
})

router.get('/', async (req, res) => {
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
    const apillonStorageService = new ApillonStorageService()
    const invoices = await apillonStorageService.getInvoiceFiles()
    sendResponse(res, ResponseStatus.SUCCESS, 'Files Retrieved successfully', invoices)
  } catch (error) {
    if (error instanceof Error) sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
  }
})

export default router
