import { CoreText } from '@/components/custom/core-text'
import { useAccount } from '../api/hooks'
import { Loader } from '@/components/custom/loader'
import { CreateInvoiceDialog } from './create-invoice-dialog'
import { DataTable } from './invoice-table/data-table'
import { columns } from './invoice-table/conlumns'

export const MyInvoices = () => {
  const { data, isLoading } = useAccount()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader size="large" />
      </div>
    )
  }
  return (
    <div className="gap-8 flex flex-col">
      <div className="flex justify-between items-center">
        <CoreText variant="title">My Invoices</CoreText>
        <CreateInvoiceDialog />
      </div>
      <DataTable columns={columns} data={data?.tokens || []} />
    </div>
  )
}
