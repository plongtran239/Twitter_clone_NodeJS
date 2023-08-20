import { ObjectId } from 'mongodb'

// Services
import databaseService from './database.services'
import Bookmark from '~/models/schemas/Bookmark.schemas'

// Constants
import { BOOKMARKS_MESSAGES } from '~/constants/messages'

// Models

class BookmarksService {
  async bookmarkTweet(user_id: string, tweet_id: string) {
    const bookmark = await databaseService.bookmarks.findOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })

    if (bookmark === null) {
      await databaseService.bookmarks.insertOne(
        new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweet_id)
        })
      )
      return {
        message: BOOKMARKS_MESSAGES.BOOKMARK_SUCCES
      }
    }

    return {
      message: BOOKMARKS_MESSAGES.ALREADY_BOOKMARK
    }
  }

  async unbookmarkTweet(user_id: string, tweet_id: string) {
    const bookmark = await databaseService.bookmarks.findOne({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweet_id)
    })

    if (bookmark !== null) {
      await databaseService.bookmarks.findOneAndDelete({
        user_id: new ObjectId(user_id),
        tweet_id: new ObjectId(tweet_id)
      })
      return {
        message: BOOKMARKS_MESSAGES.UNBOOKMARK_SUCCESS
      }
    }

    return {
      message: BOOKMARKS_MESSAGES.ALREADY_UNBOOKMARK
    }
  }
}

const bookmarksService = new BookmarksService()
export default bookmarksService
