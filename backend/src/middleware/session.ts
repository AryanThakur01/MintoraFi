import { Request, Response, NextFunction } from 'express'
import { prisma } from '../utils/prisma'
import { User } from '@prisma/client'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

export const sessionMiddleware = async (req: Request, _: Response, next: NextFunction) => {
  const sessionId = req.cookies?.sessionId

  if (sessionId) {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    })

    if (session && new Date(session.expiresAt) > new Date()) {
      req.user = session.user // attach user to request
    }
  }

  next()
}
