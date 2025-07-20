import { Skeleton } from '@/components/ui/skeleton'
import { useMarketplaceNfts } from '../invoices/api/hooks'
import { InvoiceCard } from './invoice-card'

export const Marketplace = () => {
  const { data, isLoading } = useMarketplaceNfts()
  return (
    <div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
      {isLoading ? (
        <>
          <Skeleton className="h-84 w-full rounded-2xl" />
          <Skeleton className="h-84 w-full rounded-2xl" />
          <Skeleton className="h-84 w-full rounded-2xl" />
        </>
      ) : !data || data?.length === 0 ? (
        <p className="text-sm text-muted-foreground my-auto border rounded-lg col-span-full text-center py-20">
          No Invoice NFTs found in the marketplace yet, Please check back later.
        </p>
      ) : (
        data.map((nft) => {
          return <InvoiceCard key={`nft-${nft.serialNumber}`} nft={nft} />
        })
      )}
    </div>
  )
}
