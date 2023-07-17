import express from 'express'
import usersRouter from './routes/users.routes'

const PORT = 4000
const app = express()

app.use(express.json())

app.use('/users', usersRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
