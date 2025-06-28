import axios, { Axios, AxiosError } from 'axios'
import fs from 'fs'
import { settings } from '../settings'
import { IApillonFileDetails, IApillonUploadSession, ISessionEnd } from '../interfaces/apillon-storage'

export class ApillonStorageService {
  private readonly axios: Axios
  private readonly invoiceSizeLimitKb = 100
  private readonly invoiceBucketId = settings.apillonInvoiceBucketUUID

  constructor() {
    this.axios = axios.create({
      baseURL: settings.apillonUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: settings.apillonAuthorization,
      },
    })
  }

  async getInvoiceFiles(): Promise<any[]> {
    const response = await this.axios.get(`/storage/buckets/${this.invoiceBucketId}/files`)
    return response.data
  }

  detectMimeType(buffer: Buffer): string {
    if (buffer.slice(0, 4).toString('hex') === '25504446') {
      return 'application/pdf' // PDF
    }
    if (buffer.slice(0, 8).toString('hex') === '89504e470d0a1a0a') {
      return 'image/png' // PNG
    }
    if (buffer.slice(0, 3).toString('hex') === '474946') {
      return 'image/gif' // GIF
    }
    if (buffer.slice(0, 2).toString('hex') === 'ffd8' && buffer.slice(-2).toString('hex') === 'ffd9') {
      return 'image/jpeg' // JPEG
    }
    if (buffer.slice(0, 4).toString('hex') === '52494646' && buffer.slice(8, 12).toString('hex') === '57454250') {
      return 'image/webp' // WebP
    }
    throw new Error('Unsupported file type')
  }

  async uploadFileToBucket(filePath: string, userId: string): Promise<ISessionEnd> {
    const fileSize = fs.statSync(filePath).size / 1024
    if (fileSize > this.invoiceSizeLimitKb) throw new Error(`File size exceeds limit of ${this.invoiceSizeLimitKb} KB`)
    const fileBuffer = fs.readFileSync(filePath)
    const fileMimeType = this.detectMimeType(fileBuffer)

    const upload = await this.axios.post<IApillonUploadSession>(`/storage/buckets/${this.invoiceBucketId}/upload`, {
      files: [
        {
          fileName: filePath.split('/').pop() || 'file',
          contentType: fileMimeType,
          path: userId, // user's file is uploaded to his unique directory
        },
      ],
    })

    const uploadUrl = upload.data.data.files[0].url
    if (!uploadUrl) throw new Error('Failed to get upload URL from Apillon storage')
    await axios.put(uploadUrl, fileBuffer, { headers: { 'Content-Type': fileMimeType } })
    const res = await this.axios.post<ISessionEnd>(`/storage/buckets/${this.invoiceBucketId}/upload/${upload.data.data.sessionUuid}/end`)
    return res.data
  }

  async getFileDetails(fileId: string): Promise<IApillonFileDetails> {
    const res = await this.axios.get<IApillonFileDetails>(`/storage/buckets/${this.invoiceBucketId}/files/${fileId}`)
    return res.data
  }
}
