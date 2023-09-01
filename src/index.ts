import express from 'express'
import { config } from 'dotenv'
import cors, { CorsOptions } from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { ObjectId } from 'mongodb'

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

// Constants
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import { isProduction } from './constants/config'

// Models
import Conversation from './models/schemas/Conversation.Schemas'

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

const httpServer = createServer(app)

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

app.use('/conversations', conversationsRouter)

app.use('/static', staticRouter)

app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  /* options */
  cors: {
    origin: process.env.CLIENT_URL
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }

  socket.on('send_message', async (data) => {
    const { receiver_id, sender_id, content } = data.payload
    const receiver_socket_id = users[receiver_id]?.socket_id
    if (!receiver_socket_id) {
      return
    }
    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id),
      receiver_id: new ObjectId(receiver_id),
      content: content
    })
    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId
    socket.to(receiver_socket_id).emit('receive_message', {
      payload: conversation
    })
  })

  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`User ${socket.id} disconnected`)
  })

  console.log(users)
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
