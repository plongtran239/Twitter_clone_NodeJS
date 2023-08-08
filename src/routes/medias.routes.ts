import { Router } from 'express'

import { uploadImageController } from '~/controllers/medias.controllers'

import { wrapRequestHandler } from '~/utils/handlers'

const mediasRouter = Router()

/**
 * Path: /upload-image
 * Method: POST
 * Description: Upload an image
 * Body: {
 *  form-data: image
 * }
 */
mediasRouter.post('/upload-image', wrapRequestHandler(uploadImageController))

export default mediasRouter
