import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body

  if (email === 'plongtran@gmail.com' && password === '123123') {
    return res.json({
      message: 'Login successfully'
    })
  }

  return res.status(400).json({
    error: 'Login failed'
  })
}
