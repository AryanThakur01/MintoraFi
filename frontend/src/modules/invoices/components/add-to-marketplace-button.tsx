import { Button } from '@/components/custom/button'
import { useAddToMarketplace, useMarketplaceNfts } from '../api/hooks'

interface IAddToMarketplaceButton extends React.ComponentProps<typeof Button> {
  tokenId: string
  serialNumber: number
}
export const AddToMarketplaceButton: React.FC<IAddToMarketplaceButton> = ({
  tokenId,
  serialNumber,
  ...props
}) => {
  const { mutateAsync: addToMarketplace, isPending: isAddingToMarketplace } = useAddToMarketplace()
  const { data, isLoading, isRefetching } = useMarketplaceNfts()

  const handleAddToMarketplace = async () => {
    try {
      await addToMarketplace({ tokenId, serialNumber })
    } catch (error) {
      console.error('Error adding NFT to marketplace:', error)
    }
  }
  const isAddedToMarketplace = data?.some(
    (nft) => nft.serialNumber === serialNumber && nft.tokenId === tokenId,
  )

  return (
    <Button
      onClick={handleAddToMarketplace}
      disabled={isAddingToMarketplace || isLoading || isRefetching}
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
  )
}
