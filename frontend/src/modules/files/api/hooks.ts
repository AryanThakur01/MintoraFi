import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fileServices } from './services'
import { toast } from 'sonner'
import type { AxiosError } from 'axios'

export const useFileUploader = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['file-uploader'],
    mutationFn: fileServices.uploadFile,
    onSuccess: () => {
      toast.success('File uploaded successfully')
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['files'] })
      }, 3000)
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message ?? 'An error occurred while uploading the file')
    },
  })
}
