import os from 'os'
import fs from 'fs'
import path from 'path'
import { ISessionEnd } from '../interfaces/apillon-storage'
import { ApillonStorageService } from '../utils/apillon-storage'

export class NftMetadataStore {
  private readonly apillonStorageService: ApillonStorageService
  constructor() {
    this.apillonStorageService = new ApillonStorageService()
  }
  public async uploadJsonToBucket(json: object, userId: string, fileName = 'metadata.json'): Promise<ISessionEnd> {
    const tempDir = os.tmpdir()
    const tempFilePath = path.join(tempDir, `${Date.now()}-${fileName}`)

    try {
      // Write JSON to temp file
      fs.writeFileSync(tempFilePath, JSON.stringify(json, null, 2), 'utf-8')

      // Use your existing uploadFileToBucket method
      const result = await this.apillonStorageService.uploadFileToBucket(tempFilePath, userId)
      return result
    } finally {
      // Always clean up the temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
      }
    }
  }
}
