import { ObjectId } from 'mongodb'

// Services
import databaseService from './database.services'
import Bookmark from '~/models/schemas/Bookmark.schemas'

// Constants
import { LIKES_MESSAGES } from '~/constants/messages'

// Models

class LikesService {
  async likeTweet(user_id: string, tweet_id: string) {
    const like = await databaseService.likes.findOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })

    if (like === null) {
      await databaseService.likes.insertOne(
        new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      )
      return {
        message: LIKES_MESSAGES.LIKE_SUCCES
      }
    }

    return {
      message: LIKES_MESSAGES.ALREADY_LIKE
    }
  }

  async unlikeTweet(user_id: string, tweet_id: string) {
    const bookmark = await databaseService.likes.findOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })

    if (bookmark !== null) {
      await databaseService.likes.findOneAndDelete({
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      })
      return {
        message: LIKES_MESSAGES.UNLIKE_SUCCESS
      }
    }

    return {
      message: LIKES_MESSAGES.ALREADY_UNLIKE
    }
  }
}

const likesService = new LikesService()
export default likesService
