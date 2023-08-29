import { ParamsDictionary, Query } from 'express-serve-static-core'

import { TweetAudience, TweetType } from '~/constants/enums'

import { Media } from '../Other'

export interface CreateTweetRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}

export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}

export interface Pagination extends Query {
  page: string
  limit: string
}

export interface TweetQuery extends Query, Pagination {
  TweetType: string
}
