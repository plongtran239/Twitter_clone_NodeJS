import { Request, Response } from 'express'

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

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const result = await usersService.register({ email, password })
    return res.json({
      error: 'Register successfully',
      result
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}
