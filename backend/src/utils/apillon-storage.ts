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
    const isMatch = (start: number, bytes: number[], offset = 0) => {
      return Buffer.compare(buffer.subarray(start, start + bytes.length), Buffer.from(bytes)) === 0
    }
    // PDF: Starts with 25 50 44 46 => %PDF
    if (isMatch(0, [0x25, 0x50, 0x44, 0x46])) return 'application/pdf'

    // PNG: Starts with 89 50 4E 47 0D 0A 1A 0A
    if (isMatch(0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'image/png'

    // GIF: Starts with 47 49 46 => GIF
    if (isMatch(0, [0x47, 0x49, 0x46])) return 'image/gif'

    // JPEG: Starts with FF D8 and ends with FF D9
    if (isMatch(0, [0xff, 0xd8]) && Buffer.compare(buffer.subarray(buffer.length - 2), Buffer.from([0xff, 0xd9])) === 0) return 'image/jpeg'

    // WebP: Starts with RIFF....WEBP
    if (isMatch(0, [0x52, 0x49, 0x46, 0x46]) && isMatch(8, [0x57, 0x45, 0x42, 0x50])) return 'image/webp'

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
