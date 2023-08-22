import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Constants
import { TWEETS_MESSAGES } from '~/constants/messages'

// Models
import { CreateTweetRequestBody } from '~/models/requests/Tweet.requests'
import { TokenPayload } from '~/models/requests/User.requests'

// Services
import tweetsService from '~/services/tweets.services'

export const createTweetController = async (
  req: Request<ParamsDictionary, any, CreateTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)

  return res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESS,
    result
  })
}

export const getTweetController = async (req: Request, res: Response) => {
  return res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESS,
    result: req.tweet
  })
}
