import dns from 'node:dns/promises'
import { prisma } from '../utils/prisma'
import { Authenticity } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export class AuthenticityService {
  private readonly userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async generateVerificationCode(domain: string): Promise<Authenticity> {
    const existingAuthenticity = await prisma.authenticity.findFirst({ where: { userId: this.userId } })
    if (existingAuthenticity && existingAuthenticity.domain === domain) return existingAuthenticity
    else if (existingAuthenticity) {
      const newAuthenticity = await prisma.authenticity.update({
        where: { id: existingAuthenticity.id },
        data: { domain, verificationToken: randomUUID(), domainVerified: false },
      })
      return newAuthenticity
    }

    const newAuthenticity = await prisma.authenticity.create({
      data: {
        userId: this.userId,
        domain,
      },
    })
    return newAuthenticity
  }

  async verifyDomain(): Promise<Authenticity> {
    const authenticity = await prisma.authenticity.findFirst({
      where: { userId: this.userId },
    })

    if (!authenticity) throw new Error('Invalid verification token or domain')

    const dnsRecords = await dns.resolveTxt(authenticity.domain)
    console.log('DNS Records:', dnsRecords)
    const verificationRecord = dnsRecords.find((record) => record.includes(authenticity.verificationToken))

    if (!verificationRecord) throw new Error('Domain verification failed, TXT record not found')

    return prisma.authenticity.update({
      where: { id: authenticity.id },
      data: { domainVerified: true },
    })
  }
}
