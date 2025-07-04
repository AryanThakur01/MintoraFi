import { type ColumnDef } from '@tanstack/react-table'
import { ExternalLinkIcon } from 'lucide-react'
import type { IIpfsFile } from '@/api/services'

export const columns: ColumnDef<IIpfsFile>[] = [
  {
    accessorKey: 'name',
    header: 'File Name',
    cell: ({ row }) => {
      const name = row.getValue('name')
      return (
        <div className="capitalize flex items-center">
          <span>{String(name).slice(0, 15)}...</span>
          <a href={row.original.link} className="ml-2 text-primary" target="_blank">
            <ExternalLinkIcon size={16} />
          </a>
        </div>
      )
    },
  },
  {
    accessorKey: 'CID',
    header: 'CID',
    cell: ({ row }) => {
      const cid = row.getValue('CID') ?? 'UPLOADING'
      return <p>{String(cid).slice(0, 15)}...</p>
    },
  },
  {
    accessorKey: 'contentType',
    header: 'Content Type',
    cell: ({ row }) => {
      const value = row.getValue('contentType')
      return <p>{String(value)}</p>
    },
  },
]
