import { useAvailableFiles } from '@/api/hooks'
import { CoreText } from '@/components/custom/core-text'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAccount } from '@/modules/invoices/api/hooks'
import { ImageIcon, Layers } from 'lucide-react'

interface IOverviewCard {
  icon: React.ElementType
  title: string
  value: string
}

export const AnalyticsOverview = () => {
  const { data: availableFiles, isLoading: isFilesLoading } = useAvailableFiles()
  const { data, isLoading } = useAccount()
  const overviewCards: IOverviewCard[] = [
    {
      icon: Layers,
      title: 'NFTs Created',
      value: data?.tokens.length.toLocaleString() ?? '0',
    },
    {
      icon: ImageIcon,
      title: 'Uploaded Images',
      value: availableFiles?.data.data.items.length.toLocaleString() ?? '0',
    },
  ]

  if (isLoading || isFilesLoading) {
    return (
      <div className="grid md:grid-cols-4 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="p-4">
            <CardHeader className="flex items-center space-x-2 pl-0">
              <Layers className="text-gray-500" />
              <CardTitle>
                <CoreText variant="subheading">Loading...</CoreText>
              </CardTitle>
            </CardHeader>
            <CardDescription>
              <CoreText variant="heading">...</CoreText>
            </CardDescription>
          </Card>
        ))}
      </div>
    )
  }
  return (
    <div className="grid md:grid-cols-4 gap-4">
      {overviewCards.map((card, index) => (
        <Card key={index} className="p-4">
          <CardHeader className="flex items-center space-x-2 pl-0">
            <card.icon className=" text-gray-500" />
            <CardTitle>
              <CoreText variant="subheading">{card.title}</CoreText>
            </CardTitle>
          </CardHeader>
          <CardDescription>
            <CoreText variant="heading">{card.value}</CoreText>
          </CardDescription>
        </Card>
      ))}
    </div>
  )
}
