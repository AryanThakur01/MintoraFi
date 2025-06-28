import { ISettings } from './interfaces/settings.ts'
import dotenv from 'dotenv'

function parseBoolean(variable?: string): boolean {
  return variable === undefined ? false : variable.toLowerCase() === 'true'
}
dotenv.config()

const getSettings = (): ISettings => {
  return {
    // Environment variables
    nodeEnv: String(process.env.NODE_ENV ?? 'development'),
    network: String(process.env.NETWORK ?? 'testnet'),

    // Email settings
    smtpUser: String(process.env.SMTP_USER ?? ''),
    smtpPass: String(process.env.SMTP_PASS ?? ''),

    // Variables for backend only usage
    allowedOrigins: String(process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001'),
    fileLogging: parseBoolean(process.env.FILE_LOGGING),
    fileErrorLogging: parseBoolean(process.env.FILE_ERROR_LOGGING),
    port: parseInt(process.env.PORT ?? '3001'),
    url: String(process.env.URL ?? 'http://localhost'),

    // Hedera Account Variables
    hederaOperatorId: String(process.env.HEDERA_OPERATOR_ID),
    hederaOperatorPvtKey: String(process.env.HEDERA_OPERATOR_PVT_KEY),
    hederaSupplyKey: String(process.env.HEDERA_SUPPLY_KEY ?? ''),
  }
}

export const settings = getSettings()
