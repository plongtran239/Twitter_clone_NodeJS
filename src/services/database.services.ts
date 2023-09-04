import { MongoClient, Db, Collection } from 'mongodb'

import User from '~/models/schemas/User.schemas'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'
import Tweet from '~/models/schemas/Tweet.schemas'
import Hashtag from '~/models/schemas/Hashtag.schemas'
import Bookmark from '~/models/schemas/Bookmark.schemas'
import Like from '~/models/schemas/Like.schemas'
import Conversation from '~/models/schemas/Conversation.Schemas'

import { envConfig } from '~/constants/config'

const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@twitter.4jvu4dl.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
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

  async indexUsers() {
    const exists = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])

    if (!exists) {
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
  }

  async indexRefreshTokens() {
    const exists = await this.refreshTokens.indexExists(['exp_1', 'token_1'])

    if (!exists) {
      this.refreshTokens.createIndex({
        token: 1
      })
      this.refreshTokens.createIndex(
        {
          exp: 1
        },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }

  async indexFollowers() {
    const exists = await this.followers.indexExists(['user_id_1_followed_user_id_1'])

    if (!exists) {
      this.followers.createIndex({
        user_id: 1,
        followed_user_id: 1
      })
    }
  }

  async indexTweets() {
    const exists = await this.tweets.indexExists(['content_text'])

    if (!exists) {
      this.tweets.createIndex(
        {
          content: 'text'
        },
        {
          default_language: 'none'
        }
      )
    }
  }

  async indexHashtags() {
    const exists = await this.hashtags.indexExists(['name_text'])

    if (!exists) {
      this.hashtags.createIndex({
        name: 'text'
      })
    }
  }

  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollections)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollections)
  }

  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbHashtagsCollection)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbBookmarksCollection)
  }

  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(envConfig.dbConversationCollection)
  }
}

const databaseService = new DatabaseService()
export default databaseService
