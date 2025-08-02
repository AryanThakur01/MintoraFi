import express from 'express'
import authRouter from './auth'
import userRouter from './user'
import nftRouter from './nft'
import filesRouter from './files'

const routes = express.Router()

routes.use('/api/auth', authRouter)
routes.use('/api/user', userRouter)
routes.use('/api/nft', nftRouter)
routes.use('/api/files', filesRouter)

export { routes }
