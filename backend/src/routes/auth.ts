import express from 'express'
import { AuthService } from '../services/auth'
import { SAuth, SVerifyOtp, TAuth, TVerifyOtp } from '../serializers/auth'
import { ResponseMessage, ResponseStatus } from '../data/enumerators'
import { settings } from '../settings'
import { sendResponse } from '../utils/send-response'
import { validateBody } from '../utils/validators'

const router = express.Router()

const authService = new AuthService()

router.post('/request-otp', validateBody(SAuth), async (req, res) => {
  try {
    const { email } = req.body as TAuth

    if (!email) {
      sendResponse(res, ResponseStatus.BAD_REQUEST, 'Please provide a valid email address')
      return
    }

    await authService.sendOtp(email)
    sendResponse(res, ResponseStatus.SUCCESS, 'OTP sent successfully')
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    } else {
      sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
    }
  }
})

router.post('/verify-otp', validateBody(SVerifyOtp), async (req, res) => {
  try {
    const { email, otp } = req.body as TVerifyOtp

    if (!email || !otp) {
      sendResponse(res, ResponseStatus.BAD_REQUEST, 'Please provide both email and OTP')
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

    sendResponse(res, ResponseStatus.SUCCESS, 'OTP verified successfully', user)
  } catch (error) {
    if (error instanceof Error) {
      sendResponse(res, ResponseStatus.BAD_REQUEST, error.message)
    } else {
      sendResponse(res, ResponseStatus.INTERNAL_SERVER_ERROR, ResponseMessage.INTERNAL_SERVER_ERROR)
    }
  }
})

export default router
