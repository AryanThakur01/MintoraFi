import { Request, Response, NextFunction } from 'express'
import { normalizePath } from '../utils/normalize-path'
const PUBLIC_ROUTES = ['/api/auth/request-otp', '/api/auth/verify-otp']

export const routeProtector = (req: Request, res: Response, next: NextFunction) => {
  const normalized = normalizePath(req.path)
  if (PUBLIC_ROUTES.includes(normalized) || req.user) {
    next()
    return
  }

  res.status(401).json({ message: 'Unauthorized' })
  return
}
