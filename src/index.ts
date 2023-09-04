import express from 'express'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'

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

const httpServer = createServer(app)

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
