import { useQuery } from '@tanstack/react-query'
import { globalServices } from './services'

export const useMe = () => {
  return useQuery({
    queryKey: ['user-me'],
    queryFn: globalServices.getUser,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
