import { Router } from 'express'

// Middlewares
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'

// Controllers
import { likeTweetController, unlikeTweetController } from '~/controllers/likes.controllers'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

const likeRouter = Router()

/**
 * Path: /
 * Method: POST
 * Description: Like a tweet
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Body: {
 *  tweet_id: string
 * }
 */
likeRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(likeTweetController)
)

/**
 * Path: /tweets/:tweet_id
 * Method: DELETE
 * Description: Unlike a tweet
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 */
likeRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unlikeTweetController)
)

export default likeRouter
