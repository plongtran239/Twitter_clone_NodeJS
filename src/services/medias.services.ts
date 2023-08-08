import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'
import { config } from 'dotenv'

// Models
import { Media } from '~/models/Other'

// Utils
import { getNameFromFullname, handleUploadImage } from '~/utils/file'

// Constants
import { UPLOAD_DIR } from '~/constants/dir'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'

config()

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/images/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/images/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
