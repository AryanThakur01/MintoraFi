import { Button } from '@/components/custom/button'
import { PlusCircleIcon } from 'lucide-react'
import { CoreText } from '@/components/custom/core-text'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreateInvoice } from '../api/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

export const CreateInvoiceDialog = () => {
  const { mutateAsync, isPending } = useCreateInvoice()
  const [open, setOpen] = useState(false)
  const handleSubmit = async () => {
    try {
      await mutateAsync()
      setOpen(false)
    } catch (error) {
      toast.error('Failed to create invoice')
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button isLoading={isPending} DefaultIcon={PlusCircleIcon}>
          <CoreText variant="content" className="flex items-center gap-2">
            Create Invoice
          </CoreText>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogDescription>
          <CoreText variant="heading">Create Invoice</CoreText>
          <CoreText variant="muted" className="mt-2">
            Create invoice is a feature that allows you to create an nft template on hedera
            hashgraph. This won't really mint an nft, but it will create a template that you can use
            to mint nfts later.
          </CoreText>
        </DialogDescription>
        <DialogFooter>
          <Button isLoading={isPending} onClick={handleSubmit}>
            <span>Create</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
