import express from 'express'
import authRouter from './auth.ts'
import userRouter from './user.ts'

const routes = express.Router()

routes.use('/api/auth', authRouter)
routes.use('/api/user', userRouter)

export { routes }
