import { Router } from 'express'

// Controllers
import { loginController } from '~/controllers/users.controllers'

// Middlewares
import { loginValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)

export default usersRouter
