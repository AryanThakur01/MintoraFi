import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { globalServices, type IMarketplaceNftFilters } from './services'
import { toast } from 'sonner'

export const useAccount = () => {
  return useQuery({
    queryKey: ['user-account'],
    queryFn: globalServices.getAccount,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useCreateInvoice = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['create-invoice'],
    mutationFn: globalServices.createInvoice,
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['user-account'] })
    },
  })
}

export const useMintInvoiceNft = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['mint-invoice-nft'],
    mutationFn: globalServices.mintInvoiceNft,
    onSuccess: (data) => {
      toast.success(data.message)
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['nft-info'] }), 2000)
    },
  })
}

export const useNftInfo = (tokenId: string) => {
  return useQuery({
    queryKey: ['nft-info', tokenId],
    queryFn: () => globalServices.getInvoiceNftInfo(tokenId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!tokenId,
  })
}

export const useAddToMarketplace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['add-to-marketplace'],
    mutationFn: globalServices.addToMarketplace,
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['marketplace-nfts'] })
    },
  })
}

export const useMarketplaceNfts = (filters?: IMarketplaceNftFilters) => {
  return useQuery({
    queryKey: ['marketplace-nfts', filters],
    queryFn: () => globalServices.getMarketplaceNfts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })
}
