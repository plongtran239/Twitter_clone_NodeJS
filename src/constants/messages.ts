export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be 6-50 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601',
  LOGIN_SUCCESS: 'Login successfully',
  REGISTER_SUCCESS: 'Register successfully',
  LOGOUT_SUCCESS: 'Logout successfully',
  VERIFY_EMAIL_SUCCESS: 'Verify email successfully',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  GET_ME_SUCCESS: 'Get my profile successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_USED_OR_NOT_EXIST: 'Refresh token used or not exist',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Verify email token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFIED_BEFORE: 'Email already verified before',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email successfully',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password successfully',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  USER_NOT_VERIFIED: 'User not verified',
  UPDATE_ME_SUCCESS: 'Update me successfully',
  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_FROM_1_TO_200: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  LOCATION_LENGTH_MUST_BE_FROM_1_TO_200: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_A_STRING: 'Website must be a string',
  WEBSITE_LENGTH_MUST_BE_FROM_1_TO_200: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_A_STRING: 'Username must be a string',
  USERNAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Username length must be from 1 to 50',
  IMAGE_MUST_BE_A_STRING: 'Image must be a string',
  IMAGE_LENGTH_MUST_BE_FROM_1_TO_400: 'Image length must be from 1 to 400',
  GET_PROFILE_SUCCESS: 'Get profile successfully',
  FOLLOW_SUCCESS: 'Follow successfully',
  INVALID_USER_ID: 'Invalid user id',
  ALREADY_FOLLOWED: 'Already followed',
  CANNOT_FOLLOW_YOURSELF: 'Can not follow yourself',
  UNFOLLOW_SUCCESS: 'Unfollow successfully',
  ALREADY_UNFOLLOWED: 'Already unfollow',
  CANNOT_UNFOLLOW_YOURSELF: 'Can not unfollow yourself',
  INVALID_USERNAME:
    'Username must be 4 - 15 characters long and contain only letters, numbers, underscores and not only numbers',
  USERNAME_EXISTED: 'Username already exists',
  OLD_PASSWORD_NOT_MATCHED: 'Old password not matched',
  NEW_PASSWORD_CANNOT_BE_THE_SAME: 'New password cannot be the same as old password',
  CHANGE_PASSWORD_SUCCESS: 'Change password successfully',
  REFRESH_TOKEN_SUCCESS: 'Refresh token successfully',
  GMAIL_NOT_VERIFIED: 'Gmail not verified'
} as const

export const MEDIAS_MESSAGES = {
  UPLOAD_IMAGE_SUCCESS: 'Upload image successfully',
  UPLOAD_VIDEO_SUCCESS: 'Upload video successfully'
} as const

export const TWEETS_MESSAGES = {
  CREATE_TWEET_SUCCESS: 'Create tweet successfully',
  TWEET_TYPE_IS_INVALID: 'Tweet type is invalid',
  TWEET_AUDIENCE_IS_INVALID: 'Tweet audience is invalid',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent id must be a valid tweet id',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_A_STRING: 'Content must be a string',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_A_EMPTY_STRING: 'Content must be a empty string',
  HASHTAGS_MUST_BE_AN_ARRAY: 'Hashtags must be an array',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRING: 'Hashtags must be an array of string',
  MENTIONS_MUST_BE_AN_ARRAY: 'Mentions must be an array',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID: 'Mentions must be an array of user id',
  MEDIAS_MUST_BE_AN_ARRAY: 'Medias must be an array',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT: 'Medias must be an array of media object',
  INVALID_TWEET_ID: 'Tweet id is invalid',
  TWEET_NOT_FOUND: 'Tweet not found',
  GET_TWEET_SUCCESS: 'Get tweet successfully',
  TWEET_IS_NOT_PUBLIC: 'Tweet is not public'
} as const

export const BOOKMARKS_MESSAGES = {
  BOOKMARK_SUCCES: 'Bookmark successfully',
  ALREADY_BOOKMARK: 'Already bookmarked',
  UNBOOKMARK_SUCCESS: 'Unbookmark successfully',
  ALREADY_UNBOOKMARK: 'Already unbookmarked'
} as const

export const LIKES_MESSAGES = {
  LIKE_SUCCES: 'like successfully',
  ALREADY_LIKE: 'Already liked',
  UNLIKE_SUCCESS: 'Unlike successfully',
  ALREADY_UNLIKE: 'Already unliked'
} as const
