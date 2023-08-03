import { Router } from 'express'

import { uploadSingleImageController } from '~/controllers/medias.controllers'

import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Path: /upload-image
 * Method: POST
 * Description: Upload an image
 * Body: {
 *
 * }
 */
mediasRouter.post('/upload-image', wrapRequestHandler(uploadSingleImageController))

export default mediasRouter
