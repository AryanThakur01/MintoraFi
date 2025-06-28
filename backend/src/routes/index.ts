import express from 'express'
import authRouter from './auth.ts'
import userRouter from './user.ts'
import nftRouter from './nft.ts'
import filesRouter from './files.ts'

const routes = express.Router()

routes.use('/api/auth', authRouter)
routes.use('/api/user', userRouter)
routes.use('/api/nft', nftRouter)
routes.use('/api/files', filesRouter)

export { routes }
