import { Router } from 'express'

// Controllers
import { loginController, registerController } from '~/controllers/users.controllers'

// Middlewares
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
