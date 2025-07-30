import { z } from 'zod'

export const SMintNft = z.object({
  tokenId: z.string().min(1, 'Token ID is required'),
  metadataCID: z.string().min(1, 'Metadata CID is required'),
})
export type TMintNft = z.infer<typeof SMintNft>

export const SMarketplaceNft = z.object({
  tokenId: z.string().min(1, 'Token ID is required'),
  serialNumber: z.number().int().min(0, 'Serial number must be a non-negative integer'),
  priceInHbars: z.number().gt(0, 'Price must be a positive integer'),
}).strip()
export type TMarketplaceNft = z.infer<typeof SMarketplaceNft>

export const SMarketplaceFilters = z.object({
  userId: z.string().optional(),
  tokenId: z.string().optional(),
  serialNumber: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
}).strip()
export type TMarketplaceFilters = z.infer<typeof SMarketplaceFilters>

export const SValidateNftFilters = z.object({
  mineOnly: z.string().optional(),
}).strip()
export type TValidateNftFilters = z.infer<typeof SValidateNftFilters>
