import { Request, Response } from 'express'
import path from 'path'

// Constants
import { UPLOAD_DIR } from '~/constants/dir'
import { MEDIAS_MESSAGES } from '~/constants/messages'

// Services
import mediasService from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response) => {
  const result = await mediasService.uploadImage(req)
  return res.json({
    message: MEDIAS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
    result
  })
}

export const serveImageController = (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOAD_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send('Not Found')
    }
  })
}
