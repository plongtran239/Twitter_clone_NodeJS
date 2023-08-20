import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Constants

// Models
import { BookmarkTweetRequestBody } from '~/models/requests/Bookmark.requests'
import { TokenPayload } from '~/models/requests/User.requests'

// Services
import bookmarksService from '~/services/bookmarks.services'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarksService.bookmarkTweet(user_id, req.body.tweet_id)
  return res.json(result)
}

export const unbookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarksService.unbookmarkTweet(user_id, req.params.tweet_id)
  return res.json(result)
}
