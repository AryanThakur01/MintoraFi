import busboy from 'busboy'
import fs from 'fs'
import { type Request } from 'express'
import path from 'path'
import { uploadDir } from '../utils/file-processor'

/**
 * FileProcessor class handles file upload and removal.
 * Pleasae make sure you remove the file after you are done with processing file
 **/
export class FileProcessor {
  constructor() {}

  async saveFile(req: Request, userId: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const bb = busboy({ headers: req.headers })
      const filePaths: string[] = []

      let count = 0
      bb.on('file', (_, file, info) => {
        count++
        const filePath = path.join(uploadDir, `${userId}_${info.filename}`)
        const writeStream = fs.createWriteStream(filePath)
        file.pipe(writeStream)

        writeStream.on('finish', () => {
          filePaths.push(filePath)
          if (count === filePaths.length) {
            resolve(filePaths)
          }
        })
        writeStream.on('error', (err) => {
          reject(err)
        })
      })

      req.pipe(bb)
    })
  }

  async removeFiles(filePath: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      filePath.forEach((path) => {
        fs.unlink(path, (err) => {
          if (err) {
            reject(err)
          }
        })
      })
      resolve()
    })
  }
}
