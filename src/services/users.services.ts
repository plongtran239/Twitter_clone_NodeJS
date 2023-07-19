import User from '~/models/schemas/User.schemas'
import databaseService from './database.services'

class UsersService {
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return result
  }
  async checkExistEmail(email: string) {
    const existUser = await databaseService.users.findOne({ email })
    return Boolean(existUser)
  }
}

const usersService = new UsersService()
export default usersService
