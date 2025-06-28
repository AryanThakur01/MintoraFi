import path from 'path'
import fs from 'fs'
import logger from './logger/logger'

const getUploadDir = (): string => {
  // Ensure uploads directory exists
  const uploadDir = path.join(__dirname, 'uploads.local')
  logger.info(`UPLOAD_DIRECTORY: ${uploadDir}`)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
  return uploadDir
}

export const uploadDir = getUploadDir()
