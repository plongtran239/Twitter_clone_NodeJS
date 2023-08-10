import { Router } from 'express'

// Middlewares
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

// Controllers
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'

// Utils
import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Path: /upload-image
 * Method: POST
 * Description: Upload image(s)
 * Body: {
 *  form-data: image
 * }
 */
mediasRouter.post(
  '/upload-image',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadImageController)
)

/**
 * Path: /upload-video
 * Method: POST
 * Description: Upload an video
 * Body: {
 *  form-data: video
 * }
 */
mediasRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifiedUserValidator,
  wrapRequestHandler(uploadVideoController)
)

export default mediasRouter
