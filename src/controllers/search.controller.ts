import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

// Constants
import { MediaTypeQuery } from '~/constants/enums'
import { SEARCH_MESSAGES } from '~/constants/messages'

// Models
import { SearchQuery } from '~/models/requests/Search.requests'
import searchService from '~/services/search.services'

export const searchContentController = async (req: Request<ParamsDictionary, any, any, SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await searchService.search({
    limit,
    page,
    content: req.query.content,
    media_type: req.query.media_type,
    people_follow: req.query.people_follow,
    user_id: req.decoded_authorization?.user_id as string
  })

  res.json({
    message: SEARCH_MESSAGES.SEARCH_SUCCESS,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
