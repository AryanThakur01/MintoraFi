import { Button } from '@/components/custom/button'
import { useAddToMarketplace, useMarketplaceNfts } from '../api/hooks'
import { isDefaultError } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

interface IAddToMarketplaceButton extends React.ComponentProps<typeof Button> {
  tokenId: string
  serialNumber: number
}
export const AddToMarketplaceButton: React.FC<IAddToMarketplaceButton> = ({
  tokenId,
  serialNumber,
  ...props
}) => {
  const [amount, setAmount] = useState<number>()
  const { mutateAsync: addToMarketplace, isPending: isAddingToMarketplace } = useAddToMarketplace()
  const { data, isLoading, isRefetching } = useMarketplaceNfts()

  const handleAddToMarketplace = async () => {
    try {
      if (!amount || isNaN(amount)) {
        toast.error('Please enter a valid amount')
        return
      }
      await addToMarketplace({ tokenId, serialNumber, priceInHbars: amount })
    } catch (error) {
      if (isDefaultError(error)) toast.error(error.message)
    }
  }
  const isAddedToMarketplace = data?.some(
    (nft) => nft.serialNumber === serialNumber && nft.tokenId === tokenId,
  )

  return !isAddedToMarketplace ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">
          {isAddedToMarketplace
            ? isAddingToMarketplace
              ? 'Removing...'
              : 'Remove from Marketplace'
            : isAddingToMarketplace
              ? 'Adding...'
              : 'Add to Marketplace'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAddedToMarketplace ? 'Remove from Marketplace' : 'Add to Marketplace'}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {isAddedToMarketplace
              ? 'Are you sure you want to remove this NFT from the marketplace?'
              : 'Add this NFT to the marketplace for others to purchase.'}
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="amount">Offered price (in ħ)</Label>
        <Input
          id="amount"
          name="amount"
          placeholder="e.g 10"
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />
        <Button
          onClick={handleAddToMarketplace}
          disabled={isAddingToMarketplace || isLoading || isRefetching || !amount || isNaN(amount)}
          variant={isAddedToMarketplace ? 'destructive' : 'default'}
          {...props}
        >
          {isAddedToMarketplace
            ? isAddingToMarketplace
              ? 'Removing...'
              : 'Remove from Marketplace'
            : isAddingToMarketplace
              ? 'Adding...'
              : 'Add to Marketplace'}
        </Button>
      </DialogContent>
    </Dialog>
  ) : (
    <Button
      variant="destructive"
      className="w-full mt-4"
      onClick={handleAddToMarketplace}
      disabled={isAddingToMarketplace || isLoading || isRefetching}
      {...props}
    >
      {isAddingToMarketplace ? 'Removing...' : 'Remove from Marketplace'}
    </Button>
  )
}
