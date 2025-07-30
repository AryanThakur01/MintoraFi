import { useNftInfo } from '../api/hooks'
import { useMe } from '@/api/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, DollarSign, Hash } from 'lucide-react'
import { MintInvoiceDialog } from './mint-invoice-dialog'
import { InvoiceCard } from './invoice-card'

interface IInvoiceNft {
  tokenId: string
}
export const InvoiceNft: React.FC<IInvoiceNft> = ({ tokenId }) => {
  const { data: token, isLoading } = useNftInfo(tokenId, { mineOnly: true })
  const { data: me, isLoading: isMeLoading } = useMe()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <MintInvoiceDialog tokenId={tokenId} />
      </div>

      {/* Grid container for all cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Token Info Card */}
        {isLoading || isMeLoading ? (
          <Skeleton className="h-48 w-full rounded-xl col-span-full" />
        ) : token ? (
          <Card className="border shadow-sm rounded-2xl h-fit col-span-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Token Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted" />
                <span className="font-medium text-foreground">Token ID:</span>
                <span className="truncate">{token.data.details.token_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted" />
                <span className="font-medium text-foreground">Symbol:</span>
                <span>{token.data.details.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-muted" />
                <span className="font-medium text-foreground">Balance:</span>
                <span>
                  {
                    token.data.nfts.filter((nft) => nft.account_id === me?.hederaAccount.accountId)
                      .length
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground">Token not found.</p>
        )}

        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-2xl" />
        ) : token?.data.nfts.length === 0 ? (
          <p className="text-sm text-muted-foreground my-auto border rounded-lg col-span-full text-center py-20">
            No NFT Invoices minted for this token.
          </p>
        ) : (
          token?.data.nfts.map((nft) => {
            return (
              <InvoiceCard
                key={`${nft.serial_number}-${token.data.details.token_id}`}
                nft={nft}
                tokenDetials={token.data.details}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
