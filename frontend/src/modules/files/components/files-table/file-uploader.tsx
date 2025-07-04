import { useState } from 'react'
import { Button } from '@/components/custom/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UploadCloudIcon, PlusCircleIcon, FileIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useFileUploader } from '../../api/hooks'

export const FileUploader = () => {
  const { mutateAsync: uploadFile, isPending: uploading } = useFileUploader()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('application/pdf')) {
      toast.error('Only image and PDF files are allowed')
      return
    }

    setSelectedFile(file)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('No file selected')
      return
    }
    try {
      await uploadFile(selectedFile)
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircleIcon className="mr-2" />
          <span>Upload File</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload a File</DialogTitle>
        </DialogHeader>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            setDragging(false)
          }}
          onDrop={handleDrop}
          className={cn(
            'relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-6 py-8 transition-all text-center',
            dragging ? 'border-primary bg-muted/30' : 'border-muted hover:bg-muted/20',
          )}
        >
          <input
            type="file"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            accept="image/*,.pdf"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center z-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-40 rounded border object-contain mb-2"
                />
              ) : (
                <FileIcon className="h-10 w-10 text-muted-foreground mb-2" />
              )}
              <p className="text-sm text-muted-foreground font-medium">
                {selectedFile.name} · {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="z-0 flex flex-col items-center">
              <UploadCloudIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload a file</p>
              <p className="text-xs text-muted-foreground mt-1">
                (Only images or PDFs are allowed)
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleUpload}
          disabled={uploading || !selectedFile}
          className="mt-6 w-full"
        >
          <UploadCloudIcon className="mr-2" />
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
