// utils/sendResponse.ts
import { Response } from 'express'

export function sendResponse<T = any>(res: Response, statusCode: number, message: string, responseBody?: T, extras?: Record<string, any>) {
  const isSuccess = statusCode >= 200 && statusCode < 300

  return res.status(statusCode).json({
    message,
    [isSuccess ? 'data' : 'error']: responseBody,
    ...(extras && Object.keys(extras).length > 0 && { meta: extras }),
  })
}
