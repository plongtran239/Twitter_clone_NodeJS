import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { pick } from 'lodash'
import { ObjectId } from 'mongodb'

// Constants
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

// Models
import {
  LoginRequestBody,
  LogoutRequestBody,
  RegisterRequestBody,
  VerifyEmailRequestBody,
  ForgotPasswordRequestBody,
  VerifyForgotPasswordRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  UpdateMeRequestBody,
  GetProfileRequestParams,
  FollowRequestBody,
  UnfollowRequestParams
} from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import { ErrorWithStatus } from '~/models/Errors'

// Services
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  await usersService.logout(refresh_token)
  return res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  })
}

export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({
    _id: new ObjectId(user_id)
  })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  if ((user as User).email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  const result = await usersService.verifyEmail(user_id)

  return res.json({
    message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
    result
  })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  await usersService.resendVerifyEmail(user_id)

  return res.json({
    message: USERS_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
  })
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response
) => {
  const { _id, verify } = req.user as User
  await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })

  return res.json({
    message: USERS_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
  })
}

export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response
) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  await usersService.resetPassword(user_id, password)
  return res.json({
    message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
  })
}

export const getMeController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await usersService.getMe(user_id)

  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    user
  })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  const result = await usersService.updateMe(user_id, body)

  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}

export const getProfileController = async (req: Request<GetProfileRequestParams>, res: Response) => {
  const { username } = req.params
  const result = await usersService.getProfile(username)

  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result
  })
}

export const followController = async (req: Request<ParamsDictionary, any, FollowRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body

  if (followed_user_id === user_id) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.CANNOT_FOLLOW_YOURSELF,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const result = await usersService.follow(user_id, followed_user_id)

  return res.json(result)
}

export const unfollowController = async (req: Request<UnfollowRequestParams>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { user_id: followed_user_id } = req.params
  const result = await usersService.unfollow(user_id, followed_user_id)

  if (followed_user_id === user_id) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.CANNOT_UNFOLLOW_YOURSELF,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  return res.json(result)
}
