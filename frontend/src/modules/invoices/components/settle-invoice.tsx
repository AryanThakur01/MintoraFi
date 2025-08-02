import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export const SettleInvoice: React.FC = () => {
  const settleInvoice = () => {
    toast.error('This feature is under development and will be available soon.')
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full mt-4" variant="outline">
          Settle Invoice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle Invoice</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Settle the invoice by paying the required amount in HBAR. Ensure you have sufficient
            balance in your account to complete the transaction.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogTrigger>
          <Button onClick={settleInvoice}>Settle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
