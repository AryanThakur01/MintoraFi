import { Request, Response, NextFunction } from 'express'
import { normalizePath } from '../utils/normalize-path'
import { sendResponse } from '../utils/send-response'
import { ResponseStatus } from '../data/enumerators'
const PUBLIC_ROUTES = ['/api/auth/request-otp', '/api/auth/verify-otp']

export const routeProtector = (req: Request, res: Response, next: NextFunction) => {
  const normalized = normalizePath(req.path)
  if (PUBLIC_ROUTES.includes(normalized) || req.user) {
    next()
    return
  }

  if (!req.user) {
    sendResponse(res, ResponseStatus.UNAUTHORIZED, 'Unauthorized access. Please log in to continue.')
    return
  }

  return
}
