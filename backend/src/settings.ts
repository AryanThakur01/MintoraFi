import { ISettings } from './interfaces/settings.ts'
import dotenv from 'dotenv'

function parseBoolean(variable?: string): boolean {
  return variable === undefined ? false : variable.toLowerCase() === 'true'
}
dotenv.config()

const getSettings = (): ISettings => {
  return {
    nodeEnv: String(process.env.NODE_ENV ?? 'development'),
    allowedOrigins: String(process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001'),
    fileLogging: parseBoolean(process.env.FILE_LOGGING),
    fileErrorLogging: parseBoolean(process.env.FILE_ERROR_LOGGING),
    port: parseInt(process.env.PORT ?? '3001'),
    url: String(process.env.URL ?? 'http://localhost'),

    smtpUser: String(process.env.SMTP_USER ?? ''),
    smtpPass: String(process.env.SMTP_PASS ?? ''),
  }
}

export const settings = getSettings()
