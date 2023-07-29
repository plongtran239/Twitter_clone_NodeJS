import { Router } from 'express'

// Controllers
import {
  changePasswordController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyEmailController,
  verifyForgotPasswordController
} from '~/controllers/users.controllers'

// Middlewares
import {
  accessTokenValidator,
  changePasswordValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyEmailTokenValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

// Models
import { UpdateMeRequestBody } from '~/models/requests/User.requests'

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
 * Path: /refresh-token
 * Method: POST
 * Description: Refresh token
 * Body: {
 *  refresh_token: string
 * }
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

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

/**
 * Path: /forgot-password
 * Method: POST
 * Description: Send email with link to user
 * Body: {
 *  email: string
 * }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Path: /verify-forgot-password
 * Method: POST
 * Description: Verify link in email to reset password
 * Body: {
 *  forgot_password_token: string
 * }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Path: /reset-password
 * Method: POST
 * Description: Reset password
 * Body: {
 *  forgot_password_token: string
 *  new_password: string,
 *  confirm_password: string
 * }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Path: /me
 * Method: GET
 * Description: Get my profile
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Path: /me
 * Method: PATCH
 * Description: Update my profile
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeRequestBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Path: /:username
 * Method: GET
 * Description: Get user profile
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Path: /follow
 * Method: POST
 * Description: Follow a user
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Body: {
 *  followed_user_id: string
 * }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Path: /follow/:user_id
 * Method: DELETE
 * Description: Unfollow a user
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

/**
 * Path: /change-password
 * Method: PUT
 * Description: Change password
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Body: {
 *  old_password: string
 *  password: string
 *  confirm_password: string
 * }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)
export default usersRouter
