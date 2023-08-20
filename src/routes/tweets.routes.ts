import { Router } from 'express'

// Middlewares
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { createTweetValidator } from '~/middlewares/tweets.middlewares'

// Controllers
import { createTweetController } from '~/controllers/tweets.controllers'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Path: /
 * Method: POST
 * Description: Create a new tweet
 * Header: Bearer <access token>
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

export default tweetsRouter
