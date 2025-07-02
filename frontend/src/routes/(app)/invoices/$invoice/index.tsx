import { InvoiceNft } from '@/modules/invoices/components/invoce-nft'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/invoices/$invoice/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { invoice } = Route.useParams()
  return <InvoiceNft tokenId={invoice} />
}
