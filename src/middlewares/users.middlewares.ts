import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'

import { validate } from '~/utils/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Invalid email or password'
    })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      trim: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      }
    },
    email: {
      notEmpty: true,
      trim: true,
      isEmail: true
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage:
          'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol'
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage:
          'Password must be at least 6 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol'
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
