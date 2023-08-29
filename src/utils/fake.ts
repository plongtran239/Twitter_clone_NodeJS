import { faker } from '@faker-js/faker'
import { ObjectId } from 'mongodb'

// Constants
import { TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'

// Models
import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import Follower from '~/models/schemas/Follower.schemas'

// Services
import databaseService from '~/services/database.services'
import tweetsService from '~/services/tweets.services'

// Mật khẩu cho các fake user
const PASSWORD = 'Long123@'

// ID account của mình để follow các user khác
const MY_ID = new ObjectId('64e3761b4cc25e9fead2715f')

// Số lượng user được tạo, mỗi user được tweet 2 cái
const USER_COUNT = 100

const createRandomUser = () => {
  const user: RegisterRequestBody = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: PASSWORD,
    confirm_password: PASSWORD,
    date_of_birth: faker.date.past().toISOString()
  }
  return user
}

const createRandomTweet = () => {
  const tweet: CreateTweetRequestBody = {
    type: TweetType.Tweet,
    audience: TweetAudience.Everyone,
    content: faker.lorem.paragraph({
      min: 10,
      max: 160
    }),
    hashtags: [],
    mentions: [],
    medias: [],
    parent_id: null
  }
  return tweet
}

const users: RegisterRequestBody[] = faker.helpers.multiple(createRandomUser, { count: USER_COUNT })

const insertMultipleUsers = async (users: RegisterRequestBody[]) => {
  console.log('Creating users...')
  const result = await Promise.all(
    users.map(async (user) => {
      const user_id = new ObjectId()
      await databaseService.users.insertOne(
        new User({
          ...user,
          username: `user_${user_id.toString()}`,
          date_of_birth: new Date(user.date_of_birth),
          password: user.password,
          verify: UserVerifyStatus.Verified
        })
      )
      return user_id
    })
  )
  console.log(`Created ${result.length} users`)
  return result
}

const followMultipleUsers = async (user_id: ObjectId, followed_user_ids: ObjectId[]) => {
  console.log('Start following...')
  const result = await Promise.all(
    followed_user_ids.map((followed_user_id) =>
      databaseService.followers.insertOne(
        new Follower({
          user_id,
          followed_user_id
        })
      )
    )
  )
  console.log(`Followed ${result.length} users`)
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  let count = 0
  const result = await Promise.all(
    ids.map(async (id) => {
      await Promise.all([
        tweetsService.createTweet(id.toString(), createRandomTweet()),
        tweetsService.createTweet(id.toString(), createRandomTweet())
      ])
      ;(count += 2), console.log(`Created ${count} tweets`)
    })
  )
  return result
}

insertMultipleUsers(users).then((ids) => {
  followMultipleUsers(MY_ID, ids)
  insertMultipleTweets(ids)
})
