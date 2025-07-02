import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { globalServices } from './services'
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

export const useNftInfo = (tokenId: string) => {
  return useQuery({
    queryKey: ['nft-info', tokenId],
    queryFn: () => globalServices.getInvoiceNftInfo(tokenId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!tokenId,
  })
}
