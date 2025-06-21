import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { sessionMiddleware } from './session'
import { routeProtector } from './route-protector'
import { settings } from '../settings'

const middlewares = express()

middlewares.use(
  cors({
    origin: settings.allowedOrigins.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)
middlewares.use(express.json())
middlewares.use(cookieParser())
middlewares.use(express.urlencoded({ extended: true }))
middlewares.use(sessionMiddleware)
middlewares.use(routeProtector)

export { middlewares }
