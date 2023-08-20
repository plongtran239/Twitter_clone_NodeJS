import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { isEmpty } from 'lodash'
import { ParamSchema, checkSchema } from 'express-validator'

// Constants
import { MediaType, TweetAudience, TweetType } from '~/constants/enums'
import { TWEETS_MESSAGES } from '~/constants/messages'

// Utils
import { validate } from '~/utils/validation'
import { numberEnumToArray } from '~/utils/commons'

const tweetTypes = numberEnumToArray(TweetType)
const tweetAudiences = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)

export const createTweetValidator = validate(
  checkSchema(
    {
      type: {
        isIn: {
          options: [tweetTypes]
        },
        errorMessage: TWEETS_MESSAGES.TWEET_TYPE_IS_INVALID
      },
      audience: {
        isIn: {
          options: [tweetAudiences]
        },
        errorMessage: TWEETS_MESSAGES.TWEET_AUDIENCE_IS_INVALID
      },
      parent_id: {
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            // Nếu 'type' là retweet, comment, quotetweet thì 'parent_id' phải là 'tweet_id' của tweet cha
            if (
              [TweetType.Retweet, TweetType.Comment, TweetType.Quotetweet].includes(type) &&
              !ObjectId.isValid(value)
            ) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_A_VALID_TWEET_ID)
            }
            // Nếu 'type' là tweet thì 'parent_id' phải là 'null'
            if (type === TweetType.Tweet && value !== null) {
              throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
            }
            return true
          }
        }
      },
      content: {
        isString: {
          errorMessage: TWEETS_MESSAGES.CONTENT_MUST_BE_A_STRING
        },
        custom: {
          options: (value, { req }) => {
            const type = req.body.type as TweetType
            const hashtags = req.body.hashtags as string[]
            const mentions = req.body.mentions as string[]
            // Nếu 'type' là tweet, comment, quotetweet và không có 'mentions' và 'hashtags' thì 'content' phải là string và không được rỗng
            if (
              [TweetType.Tweet, TweetType.Comment, TweetType.Quotetweet].includes(type) &&
              isEmpty(hashtags) &&
              isEmpty(mentions) &&
              value === ''
            ) {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
            }
            // Nếu 'type' là retweet thì 'content' phải là string rỗng
            if (type === TweetType.Retweet && value !== '') {
              throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_EMPTY_STRING)
            }
            return true
          }
        }
      },
      hashtags: {
        isArray: {
          errorMessage: TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value, { req }) => {
            if (value.some((item: any) => typeof item !== 'string')) {
              throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING)
            }
            return true
          }
        }
      },
      mentions: {
        isArray: {
          errorMessage: TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value, { req }) => {
            if (value.some((item: any) => !ObjectId.isValid(item))) {
              throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID)
            }
            return true
          }
        }
      },
      medias: {
        isArray: {
          errorMessage: TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY
        },
        custom: {
          options: (value, { req }) => {
            if (
              value.some((item: any) => {
                return typeof item.url !== 'string' || !mediaTypes.includes(item.type)
              })
            ) {
              throw new Error(TWEETS_MESSAGES.MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT)
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
