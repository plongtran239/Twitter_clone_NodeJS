import express from 'express'
import { config } from 'dotenv'

// Routes
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'
import staticRouter from './routes/static.routes'

// Databases
import databaseService from './services/database.services'

// Middlewares
import { defaultErrorHandler } from './middlewares/error.middlewares'

// Utils
import { initFolder } from './utils/file'

// Constants
import { UPLOAD_VIDEO_DIR } from './constants/dir'

config()

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
})
const PORT = process.env.PORT || 4000
const app = express()

initFolder()

app.use(express.json())

app.use('/users', usersRouter)

app.use('/medias', mediasRouter)

app.use('/static', staticRouter)

app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
