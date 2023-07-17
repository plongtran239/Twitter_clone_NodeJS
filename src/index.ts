import express from 'express'

// User Routes
import usersRouter from './routes/users.routes'

// Database
import databaseService from './services/database.services'

const PORT = 4000
const app = express()

app.use(express.json())

app.use('/users', usersRouter)

databaseService.connect().catch(console.dir)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
