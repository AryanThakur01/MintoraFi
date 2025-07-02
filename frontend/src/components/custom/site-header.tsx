import { useMe } from '@/api/hooks'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { CoreText } from './core-text'
import { Link } from 'lucide-react'

export function SiteHeader() {
  const { data, isLoading } = useMe()
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        {isLoading ? (
          <h1 className="text-base font-medium animate-pulse bg-gray-200 dark:bg-gray-700 w-32 h-6 rounded" />
        ) : (
          data?.hederaAccount.accountId && (
            <CoreText variant="bold" className="flex items-center gap-2">
              <span>{data.hederaAccount.accountId}</span>
              <a
                href={`https://explorer.arkhia.io/testnet/account/${data.hederaAccount.accountId}`}
                target="_blank"
                className="hover:text-primary"
              >
                <Link size={16} />
              </a>
            </CoreText>
          )
        )}
      </div>
    </header>
  )
}
