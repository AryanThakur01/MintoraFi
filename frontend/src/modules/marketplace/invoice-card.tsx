import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { InvoiceCoverImg } from '../invoices/components/invoice-cover-img'
import { ExternalLinkIcon } from 'lucide-react'
import { timeAgoFromTimestamp } from '@/lib/utils'
import { useMemo } from 'react'
import type { IMarketplaceNft } from '../invoices/api/services'

interface IInvoiceCardProps {
  nft: IMarketplaceNft
}
const decodeBase64 = (input: string): string => {
  try {
    return atob(input)
  } catch (error) {
    console.error('Failed to decode base64 string:', error)
    return ''
  }
}
export const InvoiceCard: React.FC<IInvoiceCardProps> = ({ nft }) => {
  const meta = useMemo(() => decodeBase64(nft.metadata), [nft.metadata])
  return (
    <Card className="border shadow-sm rounded-2xl overflow-hidden">
      <div className="h-40 w-full bg-muted relative">
        <InvoiceCoverImg cid={meta} alt={nft.tokenId} />
      </div>

      <CardHeader>
        <CardTitle className="text-base font-semibold truncate flex items-center justify-between">
          <p>Name:</p>
          <p className="flex gap-1 items-center">
            <span>{nft.tokenId}</span>
            <a
              href={`https://explorer.arkhia.io/testnet/token/${nft.tokenId}/${nft.serialNumber}`}
              className="ml-2 text-primary"
              target="_blank"
            >
              <ExternalLinkIcon size={16} />
            </a>
          </p>
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Price</span>
          <span>{nft.costInHbars} ħ</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">CID</span>
          <a
            href={`https://ipfs.io/ipfs/${meta}`}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-blue-600 hover:underline"
          >
            {meta.slice(0, 10)}...
          </a>
        </div>
        {nft.createdAt && (
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Minted</span>
            <span>{timeAgoFromTimestamp(new Date(nft.createdAt).getTime() / 1000)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Serial Number</span>
          <span>{nft.serialNumber}</span>
        </div>
      </CardContent>
    </Card>
  )
}
