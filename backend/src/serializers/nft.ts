import { z } from 'zod'

export const SMintNft = z.object({
  tokenId: z.string().min(1, 'Token ID is required'),
  metadataCID: z.string().min(1, 'Metadata CID is required'),
})
export type TMintNft = z.infer<typeof SMintNft>
