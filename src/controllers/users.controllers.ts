import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { RegisterRequestBody } from '~/models/requests/User.requests'

import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'plongtran@gmail.com' && password === '123123') {
    return res.json({
      message: 'Login successfully'
    })
  }

  return res.status(400).json({
    message: 'Login failed'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterRequestBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register successfully',
    result
  })
}
