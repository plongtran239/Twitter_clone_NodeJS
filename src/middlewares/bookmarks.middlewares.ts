import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'

// Constants
import HTTP_STATUS from '~/constants/httpStatus'
import { BOOKMARKS_MESSAGES } from '~/constants/messages'

// Models
import { ErrorWithStatus } from '~/models/Errors'

// Services
import databaseService from '~/services/database.services'

// Utils
import { validate } from '~/utils/validation'

export const bookmarkTweetValidator = validate(
  checkSchema({
    tweet_id: {
      custom: {
        options: async (value, { req }) => {
          if (!ObjectId.isValid(value)) {
            throw new ErrorWithStatus({
              message: BOOKMARKS_MESSAGES.INVALID_TWEET_ID,
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          const tweet = await databaseService.tweets.findOne({
            _id: new ObjectId(value)
          })

          if (tweet === null) {
            throw new ErrorWithStatus({
              message: BOOKMARKS_MESSAGES.TWEET_NOT_FOUND,
              status: HTTP_STATUS.NOT_FOUND
            })
          }

          return true
        }
      }
    }
  })
)
