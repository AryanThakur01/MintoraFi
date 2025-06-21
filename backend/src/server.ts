import express from 'express'
import { settings } from './settings.ts'
import logger from './utils/logger/logger.ts'
import { routes } from './routes/index.ts'
import { middlewares } from './middleware/index.ts'

// Creating an Express application
const app = express()

// Setting the trust proxy to true for handling forwarded requests
app.set('trust proxy', true)

// Generating and applying middlewares to the Express application
app.use(middlewares)

// Importing and applying routes to the Express application
app.use(routes)

// Starting the server and listening on the specified port
app.listen(settings.port, () => logger.info(`Server is running on ${settings.url}:${settings.port}`))
