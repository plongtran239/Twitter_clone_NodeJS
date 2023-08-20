import { Router } from 'express'

// Middlewares
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { tweetIdValidator } from '~/middlewares/tweets.middlewares'

// Controllers
import { bookmarkTweetController, unbookmarkTweetController } from '~/controllers/bookmarks.controllers'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

const bookmarksRouter = Router()

/**
 * Path: /
 * Method: POST
 * Description: Bookmark a tweet
 * Header: Bearer <access token>
 * Body: {
 *  tweet_id: string
 * }
 */
bookmarksRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(bookmarkTweetController)
)

/**
 * Path: /tweets/:tweet_id
 * Method: DELETE
 * Description: Unbookmark a tweet
 * Header: Bearer <access token>
 */
bookmarksRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifiedUserValidator,
  tweetIdValidator,
  wrapRequestHandler(unbookmarkTweetController)
)

export default bookmarksRouter
