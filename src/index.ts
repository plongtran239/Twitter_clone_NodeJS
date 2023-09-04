import express from 'express'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

// Routes
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import tweetsRouter from './routes/tweets.routes'
import likeRouter from './routes/likes.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import staticRouter from './routes/static.routes'
import searchRouter from './routes/search.routes'
import conversationsRouter from './routes/conversations.routes'

// Databases
import databaseService from './services/database.services'

// Middlewares
import { defaultErrorHandler } from './middlewares/error.middlewares'

// Utils
// import './utils/fake'
import './utils/s3'
import { initFolder } from './utils/file'
import initSocket from './utils/socket'

// Constants
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import { envConfig, isProduction } from './constants/config'

databaseService.connect().then(async () => {
  await Promise.all([
    databaseService.indexUsers(),
    databaseService.indexRefreshTokens(),
    databaseService.indexFollowers(),
    databaseService.indexTweets(),
    databaseService.indexHashtags()
  ])
})

const PORT = envConfig.port || 4000

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
})
app.use(limiter)

const httpServer = createServer(app)

app.use(helmet())

const corsOptions: CorsOptions = {
  origin: isProduction ? envConfig.clientURL : '*'
}
app.use(cors(corsOptions))

initFolder()

app.use(express.json())

app.use('/users', usersRouter)

app.use('/medias', mediasRouter)

app.use('/tweets', tweetsRouter)

app.use('/likes', likeRouter)

app.use('/bookmarks', bookmarksRouter)

app.use('/search', searchRouter)

app.use('/conversations', conversationsRouter)

app.use('/static', staticRouter)

app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
