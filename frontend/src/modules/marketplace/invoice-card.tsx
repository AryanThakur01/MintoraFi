import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { InvoiceCoverImg } from '../invoices/components/invoice-cover-img'
import { ExternalLinkIcon } from 'lucide-react'
import { cn, decodeMetadata, timeAgoFromTimestamp } from '@/lib/utils'
import { useMemo } from 'react'
import type { IMarketplaceNft } from '../invoices/api/services'
import { usePurchaseNft } from '../invoices/api/hooks'
import { Button } from '@/components/ui/button'
import { useMe } from '@/api/hooks'

interface IInvoiceCardProps {
  nft: IMarketplaceNft
}
export const InvoiceCard: React.FC<IInvoiceCardProps> = ({ nft }) => {
  const { data: me } = useMe()
  const { imageMetadata, realPriceInHbars } = useMemo(
    () => decodeMetadata(nft.metadata),
    [nft.metadata],
  )
  const { mutate, isPending } = usePurchaseNft()
  const profit = useMemo(() => {
    if (!realPriceInHbars || !nft.costInHbars) return 0
    return ((realPriceInHbars - nft.costInHbars) / Number(realPriceInHbars)) * 100
  }, [realPriceInHbars, nft.costInHbars])
  return (
    me && (
      <Card className="border shadow-sm rounded-2xl overflow-hidden">
        <div className="h-40 w-full bg-muted relative">
          <InvoiceCoverImg cid={imageMetadata} alt={nft.tokenId} />
        </div>

        <CardHeader>
          <CardTitle className="text-base font-semibold truncate flex items-center justify-between">
            <p className="flex gap-1 items-center">
              <span>{nft.tokenId}</span>
              <a
                href={`https://hashscan.io/testnet/token/${nft.tokenId}/${nft.serialNumber}`}
                className="ml-2 text-primary"
                target="_blank"
              >
                <ExternalLinkIcon size={16} />
              </a>
            </p>
            <div className="flex items-end gap-2">
              <p className="line-through text-muted-foreground text-sm">{realPriceInHbars} ħ</p>
              <p className="text-2xl">{nft.costInHbars} ħ</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Settlement Profit</span>
            <span className={cn(profit > 0 ? 'text-green-600' : 'text-red-600')}>
              {profit.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}{' '}
              %
            </span>
          </div>
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
          <Button
            className="mt-4 w-full"
            onClick={() => mutate({ tokenId: nft.tokenId, serialNumber: nft.serialNumber })}
            disabled={isPending || nft.userId === me.id}
          >
            {nft.userId === me.id ? 'You own this NFT' : isPending ? 'Purchasing...' : 'Purchase'}
          </Button>
        </CardContent>
      </Card>
    )
  )
}
