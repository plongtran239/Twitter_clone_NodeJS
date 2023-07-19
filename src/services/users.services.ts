import databaseService from './database.services'
import { config } from 'dotenv'

// Models
import User from '~/models/schemas/User.schemas'
import { RegisterRequestBody } from '~/models/requests/User.requests'

// Utils
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'

// Constants
import { TokenType } from '~/constants/enums'

config()

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  async register(payload: RegisterRequestBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token,
      refresh_token
    }
  }

  async checkExistEmail(email: string) {
    const existUser = await databaseService.users.findOne({ email })
    return Boolean(existUser)
  }
}

const usersService = new UsersService()
export default usersService
