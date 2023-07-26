import { Router } from 'express'

// Controllers
import {
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  verifyEmailController
} from '~/controllers/users.controllers'

// Middlewares
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyEmailTokenValidator
} from '~/middlewares/users.middlewares'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Path: /login
 * Method: POST
 * Description: Login a user
 * Body: {
 *  email: string,
 *  password: string
 * }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Path: /register
 * Method: POST
 * Description: Register a new user
 * Body: {
 *  name: string,
 *  email: string,
 *  password: string,
 *  confirm_password: string,
 *  date_of_birth: ISO8601
 * }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Path: /logout
 * Method: POST
 * Description: Logout a user
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Body: {
 *  refresh_token: string
 * }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * Path: /verify-email
 * Method: POST
 * Description: Verify email when user click on the link in email
 * Body: {
 *  email-verify-token: string
 * }
 */
usersRouter.post('/verify-email', verifyEmailTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Path: /resend-verify-email
 * Method: POST
 * Description: Resend verify email when user click on the link in email
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

export default usersRouter
