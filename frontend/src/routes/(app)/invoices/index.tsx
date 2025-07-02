import { MyInvoices } from '@/modules/invoices/components/my-invoices'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/invoices/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MyInvoices />
}
