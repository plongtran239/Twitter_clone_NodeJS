import { Router } from 'express'

// Middlewares
import { accessTokenValidator, isUserLoginValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import {
  audienceValidator,
  createTweetValidator,
  paginationValidator,
  getTweetChildrenValidator,
  tweetIdValidator
} from '~/middlewares/tweets.middlewares'

// Controllers
import {
  createTweetController,
  getNewsfeedController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controllers'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Path: /
 * Method: POST
 * Description: Create a new tweet
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Body: {
 *  type: TweetType
 *  audience: TweetAudience
 *  content: string
 *  parent_id: null | ObjectId
 *  hashtags: string[]
 *  mentions: ObjectId[]
 *  medias: Media[]
 * }
 */
tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

/**
 * Path: /:tweet_id
 * Method: GET
 * Description: Get tweet detail
 * Header: {
 *  Authorization?: Bearer <access_token>
 * }
 */
tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoginValidator(accessTokenValidator),
  isUserLoginValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)

/**
 * Path: /:tweet_id/children
 * Method: GET
 * Description: Get tweet children
 * Header: {
 *  Authorization?: Bearer <access_token>
 * }
 * Query: {
 *  limit: number,
 *  page: number,
 *  tweet_type: TweetType
 * }
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  isUserLoginValidator(accessTokenValidator),
  isUserLoginValidator(verifiedUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

/**
 * Path: /
 * Method: GET
 * Description: Get Newsfeed
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Query: {
 *  limit: number,
 *  page: number,
 * }
 */
tweetsRouter.get(
  '/',
  paginationValidator,
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(getNewsfeedController)
)
export default tweetsRouter
