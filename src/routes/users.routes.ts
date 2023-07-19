import { Router } from 'express'

// Controllers
import { loginController, registerController } from '~/controllers/users.controllers'

// Middlewares
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

export default usersRouter
