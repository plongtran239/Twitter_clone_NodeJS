import express from 'express'
import { config } from 'dotenv'
import cors, { CorsOptions } from 'cors'

// Routes
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import tweetsRouter from './routes/tweets.routes'
import likeRouter from './routes/likes.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import staticRouter from './routes/static.routes'

// Databases
import databaseService from './services/database.services'

// Middlewares
import { defaultErrorHandler } from './middlewares/error.middlewares'

// Utils
import { initFolder } from './utils/file'
// import './utils/fake'

// Constants
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import searchRouter from './routes/search.routes'
import { isProduction } from './constants/config'

config()

databaseService.connect().then(async () => {
  await Promise.all([
    databaseService.indexUsers(),
    databaseService.indexRefreshTokens(),
    databaseService.indexFollowers(),
    databaseService.indexTweets(),
    databaseService.indexHashtags()
  ])
})

const PORT = process.env.PORT || 4000

const app = express()

const corsOptions: CorsOptions = {
  origin: isProduction ? process.env.CLIENT_URL : '*'
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

app.use('/static', staticRouter)

app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
