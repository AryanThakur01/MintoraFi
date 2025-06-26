import { ResponseMessage, ResponseStatus } from '../data/enumerators.ts'
import { type Request, type Response, type NextFunction } from 'express'
import { ZodError, type ZodObject } from 'zod'
import { sendResponse } from './send-response.ts'

export function responseValidationError(res: Response, errors: ZodError): Response {
  const parsedErrors = errors.issues.map((issue) => {
    return {
      ...issue,
      path: issue.path.join('.'),
    }
  })
  return sendResponse(res, ResponseStatus.VALIDATION_ERROR, ResponseMessage.VALIDATION_ERROR, parsedErrors)
}

export function validateQuery(schema: ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        responseValidationError(res, error)
      } else {
        sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
      }
    }
  }
}

export function validateBody(schema: ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        responseValidationError(res, error)
      } else {
        sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
      }
    }
  }
}

export function validateParams(schema: ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        responseValidationError(res, error)
      } else {
        sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
