import { Router } from 'express'

// Controllers
import { searchContentController } from '~/controllers/search.controller'
import { searchContentValidator } from '~/middlewares/search.middlewares'

// Middlewares
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const searchRouter = Router()

/**
 * Path: /
 * Method: GET
 * Description: Search Content
 * Header: {
 *  Authorization: Bearer <access_token>
 * }
 * Query: {
 *  limit: number,
 *  page: number,
 *  content: string
 * }
 */
searchRouter.get('/', accessTokenValidator, verifiedUserValidator, searchContentValidator, searchContentController)

export default searchRouter
