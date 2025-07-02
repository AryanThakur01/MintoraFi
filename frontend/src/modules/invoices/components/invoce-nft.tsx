import { useAccount, useNftInfo } from '../api/hooks'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/custom/button'
import { useState } from 'react'
import { useAvailableFiles, useMe } from '@/api/hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coins, DollarSign, Hash } from 'lucide-react'

interface IInvoiceNft {
  tokenId: string
}
const decodeBase64 = (input: string): string => {
  try {
    return atob(input)
  } catch (error) {
    console.error('Failed to decode base64 string:', error)
    return ''
  }
}
export const InvoiceNft: React.FC<IInvoiceNft> = ({ tokenId }) => {
  // const { data: account, isLoading: accountLoading } = useAccount()
  // const token = account?.tokens.find((t) => t.tokenId === tokenId)
  const { data: filesData, isLoading: isLoadingFileData } = useAvailableFiles()
  const [selectedCid, setSelectedCid] = useState<string | null>(null)
  const { data: token, isLoading } = useNftInfo(tokenId)
  const { data: me, isLoading: isMeLoading } = useMe()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Dialog>
          {isLoadingFileData ? (
            <Skeleton className="w-32 h-9"></Skeleton>
          ) : (
            <DialogTrigger asChild>
              <Button className="w-32">Mint Invoice</Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a file to mint</DialogTitle>
            </DialogHeader>

            <Select onValueChange={(val) => setSelectedCid(val)} value={selectedCid || ''}>
              <SelectTrigger className="w-full">
                {selectedCid ?? 'Select a file to mint'}
              </SelectTrigger>
              <SelectContent>
                {filesData?.data.data.items.map((file) => (
                  <SelectItem key={file.id} value={file.CID}>
                    {file.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="mt-4"
              disabled={!selectedCid}
              // onClick={() => selectedCid && mintInvoice(selectedCid)}
            >
              Confirm Mint
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid container for all cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {/* Token Info Card */}
        {isLoading || isMeLoading ? (
          <Skeleton className="h-40 w-full rounded-xl" />
        ) : token ? (
          <Card className="border shadow-sm rounded-2xl h-fit">
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
          <p className="text-sm text-muted-foreground my-auto">No NFTs minted for this token.</p>
        ) : null}
        {token?.data.nfts.map((nft) => {
          const meta = decodeBase64(nft.metadata)
          return (
            <Card className="border shadow-sm rounded-2xl overflow-hidden">
              <div className="h-40 w-full bg-muted relative">
                {/* <img src={nft.coverImageUrl} alt={nft.name} className="object-cover w-full h-full" /> */}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold truncate">
                  Name
                  {token.data.details.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">CID:</span>
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
                  <span className="font-medium text-foreground">Minted On:</span>
                  <span>{new Date(nft.created_timestamp).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">Serial Number:</span>
                  <span>{nft.serial_number}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
