import { CoreText } from '@/components/custom/core-text'
import { AnalyticsOverview } from './components/analytics-overview'

export const Dashboard = () => {
  return (
    <div className="space-y-4">
      <CoreText variant="title">Dashboard</CoreText>
      <AnalyticsOverview />
    </div>
  )
}
