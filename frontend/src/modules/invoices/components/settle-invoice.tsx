import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const SettleInvoice: React.FC = () => {
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
      </DialogContent>
    </Dialog>
  )
}
