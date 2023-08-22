import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Models
import { BookmarkTweetRequestBody } from '~/models/requests/Bookmark.requests'
import { TokenPayload } from '~/models/requests/User.requests'

// Services
import likesService from '~/services/likes.services'

export const likeTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likesService.likeTweet(user_id, req.body.tweet_id)
  return res.json(result)
}

export const unlikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likesService.unlikeTweet(user_id, req.params.tweet_id)
  return res.json(result)
}
