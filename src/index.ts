import express from 'express'
import userRouter from './user.routes'

const PORT = 4000
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', userRouter)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
