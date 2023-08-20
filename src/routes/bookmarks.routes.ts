import { Router } from 'express'

// Middlewares
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { bookmarkTweetValidator } from '~/middlewares/bookmarks.middlewares'

// Controllers
import { bookmarkTweetController } from '~/controllers/bookmarks.controllers'

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
  bookmarkTweetValidator,
  wrapRequestHandler(bookmarkTweetController)
)

export default bookmarksRouter
