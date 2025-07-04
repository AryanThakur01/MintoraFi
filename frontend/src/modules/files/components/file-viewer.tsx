import { useAvailableFiles } from '@/api/hooks'
import { Loader } from '@/components/custom/loader'
import { DataTable } from './files-table/data-table'
import { columns } from './files-table/conlumns'

export const FileViewer = () => {
  const { data: availableFiles, isLoading: isFilesLoading } = useAvailableFiles()

  if (isFilesLoading) {
    return (
      <div className="h-[calc(100vh-102px)]">
        <Loader />
      </div>
    )
  }
  return (
    <div>
      {availableFiles && (
        <DataTable columns={columns} data={availableFiles.data.data.items || []} />
      )}
    </div>
  )
}
