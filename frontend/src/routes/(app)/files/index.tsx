import { FileViewer } from '@/modules/files/components/file-viewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/files/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FileViewer />
}
