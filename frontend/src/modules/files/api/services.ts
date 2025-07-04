import { axios } from '@/lib/axios'

export const fileServices = {
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.set('file', file)
    const res = await axios.post('/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },
}
