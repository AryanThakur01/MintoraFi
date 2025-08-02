import { PrismaClient } from '@prisma/client'
import { randomInt, randomUUID } from 'crypto'
import { MailService } from './mail'
import { prisma } from '../utils/prisma'
import { HederaAccountService } from './hedera/account'

export class AuthService {
  private readonly mailService: MailService
  private readonly hederaAccountService: HederaAccountService

  constructor() {
    this.mailService = new MailService()
    this.hederaAccountService = new HederaAccountService()
  }

  // 1. Generate and store OTP
  async sendOtp(email: string) {
    const otp = randomInt(100000, 999999).toString()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000) // 5 minutes

    // Clean expired OTPs
    await prisma.otpRequest.deleteMany({
      where: { expiresAt: { lt: now } },
    })

    // Save new OTP
    await prisma.otpRequest.create({
      data: { email, otp, expiresAt },
    })

    // Send OTP
    await this.mailService.sendOtp(email, otp)
  }

  // 2. Verify OTP
  async verifyOtp(email: string, inputOtp: string) {
    const now = new Date()

    const record = await prisma.otpRequest.findFirst({
      where: { email, otp: inputOtp },
      orderBy: { createdAt: 'desc' },
    })

    if (!record) throw new Error('Incorrect OTP')

    // Delete OTP after successful validation
    await prisma.otpRequest.delete({ where: { id: record.id } })

    if (record.expiresAt < now) throw new Error('Incorrect OTP')

    return true
  }

  // 3. Get or create user
  async getOrCreateUser(email: string) {
    let user = await prisma.user.findUnique({ where: { email }, include: {hederaAccount: true} })

    if (!user) user = await prisma.user.create({ data: { email }, include: { hederaAccount: true } })

    if (!user.hederaAccount) {
      const hederaAccount = await this.hederaAccountService.createAccount()
      user.hederaAccount = await prisma.hederaAccount.create({
        data: {
          userId: user.id,
          accountId: hederaAccount.accountId,
          privateKey: hederaAccount.privateKey,
          publicKey: hederaAccount.publicKey,
        },
      })
    }

    return user
  }

  // 4. Create session
  async createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const session = await prisma.session.create({
      data: { userId, expiresAt },
    })

    return session
  }
}
