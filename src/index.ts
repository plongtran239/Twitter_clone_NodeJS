import express from 'express'

// User Routes
import usersRouter from './routes/users.routes'

// Database
import databaseService from './services/database.services'

import { defaultErrorHandler } from './middlewares/error.middlewares'

databaseService.connect()
const PORT = 4000
const app = express()

app.use(express.json())

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
