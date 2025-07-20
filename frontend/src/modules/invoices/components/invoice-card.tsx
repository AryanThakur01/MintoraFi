import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { InvoiceCoverImg } from './invoice-cover-img'
import type { IMintedNftInfo, INftTemplateInfo } from '../api/services'
import { ExternalLinkIcon } from 'lucide-react'
import { AddToMarketplaceButton } from './add-to-marketplace-button'
import { timeAgoFromTimestamp } from '@/lib/utils'
import { useMemo } from 'react'

interface IInvoiceCardProps {
  nft: IMintedNftInfo
  tokenDetials: INftTemplateInfo
}
const decodeBase64 = (input: string): string => {
  try {
    return atob(input)
  } catch (error) {
    console.error('Failed to decode base64 string:', error)
    return ''
  }
}
export const InvoiceCard: React.FC<IInvoiceCardProps> = ({ nft, tokenDetials }) => {
  const meta = useMemo(() => decodeBase64(nft.metadata), [nft.metadata])
  return (
    <Card
      className="border shadow-sm rounded-2xl overflow-hidden"
      key={`${nft.serial_number}-${tokenDetials.token_id}`}
    >
      <div className="h-40 w-full bg-muted relative">
        <InvoiceCoverImg cid={meta} alt={tokenDetials.name} />
      </div>

      <CardHeader>
        <CardTitle className="text-base font-semibold truncate flex items-center justify-between">
          <p>Name:</p>
          <p className="flex gap-1 items-center">
            <span>{tokenDetials.name}</span>
            <a
              href={`https://explorer.arkhia.io/testnet/token/${tokenDetials.token_id}/${nft.serial_number}`}
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
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Minted</span>
          <span>{timeAgoFromTimestamp(nft.created_timestamp)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Serial Number</span>
          <span>{nft.serial_number}</span>
        </div>
        <AddToMarketplaceButton
          tokenId={tokenDetials.token_id}
          serialNumber={nft.serial_number}
          className="mt-4 w-full"
        />
      </CardContent>
    </Card>
  )
}
