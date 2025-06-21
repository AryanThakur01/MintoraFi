import express from 'express'
import { AuthService } from '../services/auth.ts'
import { responseData, responseError, validateBody } from '../helpers/router.ts'
import { SAuth, SVerifyOtp, TAuth, TVerifyOtp } from '../serializers/auth.ts'
import { ResponseMessage } from '../data/enumerators.ts'
import { settings } from '../settings.ts'

const router = express.Router()

const authService = new AuthService()

router.post('/request-otp', validateBody(SAuth), async (req, res) => {
  try {
    const { email } = req.body as TAuth

    if (!email) {
      responseError(res, 'Email is required')
      return
    }

    await authService.sendOtp(email)
    responseData(res, 'OTP sent successfully')
  } catch (error) {
    if (error instanceof Error) {
      responseError(res, error.message)
    } else {
      responseError(res, ResponseMessage.InternalServerError)
    }
  }
})

router.post('/verify-otp', validateBody(SVerifyOtp), async (req, res) => {
  try {
    const { email, otp } = req.body as TVerifyOtp

    if (!email || !otp) {
      responseError(res, 'Email and OTP are required')
      return
    }

    await authService.verifyOtp(email, otp)

    const user = await authService.getOrCreateUser(email)
    const session = await authService.createSession(user.id)

    res.cookie('sessionId', session.id, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: settings.nodeEnv === 'production',
      sameSite: 'lax',
    })

    responseData(res, { user })
  } catch (error) {
    if (error instanceof Error) {
      responseError(res, error.message)
    } else {
      responseError(res, ResponseMessage.InternalServerError)
    }
  }
})

export default router
