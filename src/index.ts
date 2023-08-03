import express from 'express'

// Routes
import usersRouter from './routes/users.routes'
import mediasRouter from './routes/medias.routes'

// Databases
import databaseService from './services/database.services'

// Middlewares
import { defaultErrorHandler } from './middlewares/error.middlewares'

// Utils
import { initFolder } from './utils/file'

databaseService.connect()
const PORT = 4000
const app = express()

initFolder()

app.use(express.json())

app.use('/users', usersRouter)

app.use('/medias', mediasRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
