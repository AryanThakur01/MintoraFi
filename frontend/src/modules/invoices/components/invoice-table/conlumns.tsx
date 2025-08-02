import { type ColumnDef } from '@tanstack/react-table'
import type { ITokenInfo } from '../../api/services'
import { ExternalLinkIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '@/components/ui/button'

export const columns: ColumnDef<ITokenInfo>[] = [
  {
    accessorKey: 'tokenId',
    header: 'Token Id',
    cell: ({ row }) => {
      const tokenId = row.getValue('tokenId')
      return (
        <div className="capitalize flex items-center">
          <span>{String(tokenId)}</span>
          <a
            href={`https://hashscan.io/testnet/token/${tokenId}`}
            className="ml-2 text-primary"
            target="_blank"
          >
            <ExternalLinkIcon size={16} />
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: 'symbol',
    header: 'Symbol',
    cell: ({ row }) => <div>{row.getValue('symbol')}</div>,
  },
  {
    accessorKey: 'balance',
    header: () => <div>Balance</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('balance'))
      const formatted = new Intl.NumberFormat('en-US').format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: 'balance',
    header: () => <div className="text-right sr-only">Action</div>,
    cell: ({ row }) => {
      const toUrl = `/invoices/${row.getValue('tokenId')}`
      return (
        <Link to={toUrl} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          View
        </Link>
      )
    },
  },
]
