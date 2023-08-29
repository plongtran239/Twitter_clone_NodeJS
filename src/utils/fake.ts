import { faker } from '@faker-js/faker'
import { ObjectId, WithId } from 'mongodb'

// Constants
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'

// Models
import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import { RegisterRequestBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/User.schemas'
import Follower from '~/models/schemas/Follower.schemas'
import Hashtag from '~/models/schemas/Hashtag.schemas'
import Tweet from '~/models/schemas/Tweet.schemas'

// Services
import databaseService from '~/services/database.services'
import { hashPassword } from './crypto'

// Mật khẩu cho các fake user
const PASSWORD = 'Long123@'

// ID account của mình để follow các user khác
const MY_ID = new ObjectId('64edb8555b2ecd3d78134abb')

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
    hashtags: ['NodeJS', 'MongoDB', 'ExpressJS', 'Swagger', 'Docker', 'Socket.io'],
    mentions: [],
    medias: [{ type: MediaType.Image, url: faker.image.url() }],
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
          _id: user_id,
          username: `user_${user_id.toString()}`,
          date_of_birth: new Date(user.date_of_birth),
          password: hashPassword(user.password),
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

const insertTweet = async (user_id: ObjectId, body: CreateTweetRequestBody) => {
  const hashtags = await checkAndCreateHashtags(body.hashtags)
  const result = await databaseService.tweets.insertOne(
    new Tweet({
      audience: body.audience,
      content: body.content,
      hashtags,
      mentions: body.mentions,
      medias: body.medias,
      parent_id: body.parent_id,
      type: body.type,
      user_id
    })
  )
  return result
}

const insertMultipleTweets = async (ids: ObjectId[]) => {
  console.log('Creating tweets...')
  console.log(`Counting...`)
  let count = 0
  const result = await Promise.all(
    ids.map(async (id) => {
      await Promise.all([insertTweet(id, createRandomTweet()), insertTweet(id, createRandomTweet())])
      count += 2
      console.log(`Created ${count} tweets`)
    })
  )
  return result
}

const checkAndCreateHashtags = async (hashtags: string[]) => {
  const hashtagDocuemts = await Promise.all(
    hashtags.map((hashtag) => {
      // Tìm hashtag trong database, nếu có thì lấy, không thì tạo mới
      return databaseService.hashtags.findOneAndUpdate(
        { name: hashtag },
        {
          $setOnInsert: new Hashtag({ name: hashtag })
        },
        {
          upsert: true,
          returnDocument: 'after'
        }
      )
    })
  )
  return hashtagDocuemts.map((hashtag) => (hashtag.value as WithId<Hashtag>)._id)
}

insertMultipleUsers(users).then((ids) => {
  followMultipleUsers(new ObjectId(MY_ID), ids).catch((err) => {
    console.error('Error when following users')
    console.log(err)
  })
  insertMultipleTweets(ids).catch((err) => {
    console.error('Error when creating tweets')
    console.log(err)
  })
})
