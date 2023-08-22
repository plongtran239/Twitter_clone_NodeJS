import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { checkSchema } from 'express-validator'
import { NextFunction, Request, Response } from 'express'

// Constants
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { TWEETS_MESSAGES, USERS_MESSAGES } from '~/constants/messages'
import { MediaType, TweetAudience, TweetType, UserVerifyStatus } from '~/constants/enums'

// Utils
import { validate } from '~/utils/validation'
import { numberEnumToArray } from '~/utils/commons'

// Services
import databaseService from '~/services/database.services'

// Models
import Tweet from '~/models/schemas/Tweet.schemas'
import { wrapRequestHandler } from '~/utils/handlers'

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

export const tweetIdValidator = validate(
  checkSchema(
    {
      tweet_id: {
        custom: {
          options: async (value, { req }) => {
            if (!ObjectId.isValid(value)) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGES.INVALID_TWEET_ID,
                status: HTTP_STATUS.BAD_REQUEST
              })
            }

            const [tweet] = await databaseService.tweets
              .aggregate<Tweet>([
                {
                  $match: {
                    _id: new ObjectId(value)
                  }
                },
                {
                  $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                  }
                },
                {
                  $addFields: {
                    mentions: {
                      $map: {
                        input: '$mentions',
                        as: 'mention',
                        in: {
                          _id: '$$mention._id',
                          name: '$$mention.name',
                          username: '$$mention.username',
                          email: '$$mention.email'
                        }
                      }
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'bookmarks'
                  }
                },
                {
                  $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'tweet_id',
                    as: 'likes'
                  }
                },
                {
                  $lookup: {
                    from: 'tweets',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'tweet_children'
                  }
                },
                {
                  $addFields: {
                    bookmarks: {
                      $size: '$bookmarks'
                    },
                    likes: {
                      $size: '$likes'
                    },
                    retweet_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', 1]
                          }
                        }
                      }
                    },
                    comment_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', 2]
                          }
                        }
                      }
                    },
                    quote_count: {
                      $size: {
                        $filter: {
                          input: '$tweet_children',
                          as: 'item',
                          cond: {
                            $eq: ['$$item.type', 3]
                          }
                        }
                      }
                    }
                  }
                },
                {
                  $project: {
                    tweet_children: 0
                  }
                }
              ])
              .toArray()

            if (!tweet) {
              throw new ErrorWithStatus({
                message: TWEETS_MESSAGES.TWEET_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            ;(req as Request).tweet = tweet
            return true
          }
        }
      }
    },
    ['body', 'params']
  )
)

export const audienceValidator = wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
  const tweet = req.tweet as Tweet
  if (tweet.audience === TweetAudience.TwitterCircle) {
    // Kiểm tra người dùng xem tweet này đã đăng nhập chưa
    if (!req.decoded_authorization) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    // Kiểm tra tài khoản tác giả có ổn (bị xóa hay bị khóa) không
    const author = await databaseService.users.findOne({
      _id: new ObjectId(tweet.user_id)
    })
    if (!author || author.verify === UserVerifyStatus.Banned) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: USERS_MESSAGES.USER_NOT_FOUND
      })
    }
    // Kiểm tra người xem có là tác giả hoặc có nằm trong Twitter Circle của tác giả không
    const { user_id } = req.decoded_authorization
    const isInTwitterCircle = author.twitter_circle.some((circle_user_id) => circle_user_id.equals(user_id))
    if (!isInTwitterCircle && !author._id.equals(user_id)) {
      console.log(!author._id.equals(user_id))
      throw new ErrorWithStatus({
        message: TWEETS_MESSAGES.TWEET_IS_NOT_PUBLIC,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
  }
  next()
})
