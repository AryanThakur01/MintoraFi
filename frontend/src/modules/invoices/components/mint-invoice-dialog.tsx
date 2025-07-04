import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/custom/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useMintInvoiceNft } from '../api/hooks'
import { useAvailableFiles } from '@/api/hooks'

interface IMintInvoiceDialog {
  tokenId: string
}

export const MintInvoiceDialog: React.FC<IMintInvoiceDialog> = ({ tokenId }) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: filesData, isLoading: isLoadingFileData } = useAvailableFiles()
  const [selectedCid, setSelectedCid] = useState<string | null>(null)
  const { mutateAsync: mintInvoice, isPending } = useMintInvoiceNft()

  const mintInvoiceHandler = async () => {
    if (selectedCid) {
      await mintInvoice({ tokenId, metadataCID: selectedCid })
      setDialogOpen(false)
    }
  }
  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {isLoadingFileData ? (
          <Skeleton className="w-32 h-9"></Skeleton>
        ) : (
          <DialogTrigger asChild>
            <Button className="w-32">Mint Invoice</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select the image of your invoice to create nft</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2">
            {selectedCid ? (
              <div className="w-full h-48 rounded-lg overflow-hidden border border-muted shadow-sm flex items-center justify-center">
                <img
                  src={`https://ipfs.io/ipfs/${selectedCid}`}
                  alt="Selected file preview"
                  className="object-contain h-full"
                />
              </div>
            ) : (
              <div className="w-full h-48 rounded-lg overflow-hidden border border-muted shadow-sm flex items-center justify-center">
                <p className="text-muted-foreground">No image selected</p>
              </div>
            )}
            <Select onValueChange={(val) => setSelectedCid(val)} value={selectedCid || ''}>
              <SelectTrigger className="w-full">
                <p className="text-ellipsis  overflow-hidden">
                  {filesData?.data.data.items.find((file) => file.CID === selectedCid)?.name ??
                    'Select a cover image to mint'}
                </p>
              </SelectTrigger>
              <SelectContent>
                {filesData?.data.data.items
                  .filter((file) => file.contentType.startsWith('image/'))
                  .map((file) => (
                    <SelectItem key={file.uuid} value={file.CID}>
                      {file.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="mt-4"
            disabled={!selectedCid || isPending}
            onClick={mintInvoiceHandler}
          >
            {isPending ? <Loader2 className="stroke-white animate-spin" /> : null}
            Confirm Mint
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
