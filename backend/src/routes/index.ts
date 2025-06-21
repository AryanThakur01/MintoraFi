import express from 'express'
import authRouter from './auth.ts'

const routes = express.Router()

routes.use('/api/auth', authRouter)

export { routes }
