import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'

import User from '~/models/schemas/User.schemas'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.4jvu4dl.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log('Error', error)
      throw error
    }
  }

  indexUsers() {
    this.users.createIndex({
      email: 1,
      password: 1
    })
    this.users.createIndex(
      {
        email: 1
      },
      { unique: true }
    )
    this.users.createIndex(
      {
        username: 1
      },
      { unique: true }
    )
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWES_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
