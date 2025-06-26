export interface ISettings {
  nodeEnv: string
  network: string
  allowedOrigins: string
  fileLogging: boolean
  fileErrorLogging: boolean
  port: number
  url: string

  smtpUser: string
  smtpPass: string

  hederaOperatorId: string
  hederaOperatorPvtKey: string
}
