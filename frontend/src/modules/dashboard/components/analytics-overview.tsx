import { CoreText } from '@/components/custom/core-text'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Layers } from 'lucide-react'

interface IOverviewCard {
  icon: React.ElementType
  title: string
  value: string
}
const overviewCards: IOverviewCard[] = [
  {
    icon: Layers,
    title: 'Total NFTs',
    value: '1,234',
  },
]

export const AnalyticsOverview = () => {
  return (
    <div className="grid md:grid-cols-4">
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
