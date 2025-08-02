import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { InvoiceCoverImg } from './invoice-cover-img'
import type { IMintedNftInfo, INftTemplateInfo } from '../api/services'
import { ExternalLinkIcon } from 'lucide-react'
import { AddToMarketplaceButton } from './add-to-marketplace-button'
import { decodeMetadata, timeAgoFromTimestamp } from '@/lib/utils'
import { useMemo } from 'react'
import { useMe } from '@/api/hooks'
import { SettleInvoice } from './settle-invoice'

interface IInvoiceCardProps {
  nft: IMintedNftInfo
  tokenDetials: INftTemplateInfo
}
export const InvoiceCard: React.FC<IInvoiceCardProps> = ({ nft, tokenDetials }) => {
  const { data: me } = useMe()
  const { imageMetadata, realPriceInHbars } = useMemo(
    () => decodeMetadata(nft.metadata),
    [nft.metadata],
  )
  return (
    me && (
      <Card
        className="border shadow-sm rounded-2xl overflow-hidden"
        key={`${nft.serial_number}-${tokenDetials.token_id}`}
      >
        <div className="h-40 w-full bg-muted relative">
          <InvoiceCoverImg cid={imageMetadata} alt={tokenDetials.name} />
        </div>

        <CardHeader>
          <CardTitle className="text-base font-semibold truncate flex items-center justify-between">
            <p className="flex gap-1 items-center">
              <span>{tokenDetials.name}</span>
              <a
                href={`https://hashscan.io/testnet/token/${tokenDetials.token_id}/${nft.serial_number}`}
                className="ml-2 text-primary"
                target="_blank"
              >
                <ExternalLinkIcon size={16} />
              </a>
            </p>
            <div className="flex items-center justify-between">
              <p>{realPriceInHbars} ħ</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">CID</span>
            <a
              href={`https://ipfs.io/ipfs/${imageMetadata}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate text-blue-600 hover:underline"
            >
              {imageMetadata.slice(0, 10)}...
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
          {me.hederaAccount.accountId === nft.account_id ? (
            <AddToMarketplaceButton
              tokenId={tokenDetials.token_id}
              serialNumber={nft.serial_number}
              className="mt-4 w-full"
            />
          ) : (
            <SettleInvoice />
          )}
        </CardContent>
      </Card>
    )
  )
}
