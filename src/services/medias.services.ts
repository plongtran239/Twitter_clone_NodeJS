import path from 'path'
import mime from 'mime'
import sharp from 'sharp'
import fsPromise from 'fs/promises'
import { config } from 'dotenv'
import { Request } from 'express'
import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'

// Models
import { Media } from '~/models/Other'

// Utils
import { getNameFromFullname, handleUploadImage, handleUploadVideo } from '~/utils/file'
import { uploadFileToS3 } from '~/utils/s3'

// Constants
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { MediaType } from '~/constants/enums'

config()

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFilename)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3Result = await uploadFileToS3({
          filename: 'images/' + newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        await Promise.all([fsPromise.unlink(file.filepath), fsPromise.unlink(newPath)])
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Image
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/image/${newName}.jpg`
        //     : `http://localhost:${process.env.PORT}/static/image/${newName}.jpg`,
        //   type: MediaType.Image
        // }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)

    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullname(file.newFilename)
        const newFullFilename = `${newName}.mp4`
        const newPath = path.resolve(UPLOAD_VIDEO_DIR, newFullFilename)
        const s3Result = await uploadFileToS3({
          filename: 'videos/' + newFullFilename,
          filepath: newPath,
          contentType: mime.getType(newPath) as string
        })
        fsPromise.unlink(newPath)
        return {
          url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
          type: MediaType.Video
        }

        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/video/${file.newFilename}`
        //     : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        //   type: MediaType.Video
        // }
      })
    )
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
