import { useMe } from '@/api/hooks'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { CoreText } from './core-text'
import { ExternalLinkIcon, Link, Loader2, WalletIcon } from 'lucide-react'
import { useAccount } from '@/modules/invoices/api/hooks'
import { Button } from '../ui/button'

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
                href={`https://hashscan.io/testnet/account/${data.hederaAccount.accountId}`}
                target="_blank"
                className="hover:text-primary"
              >
                <Link size={16} />
              </a>
            </CoreText>
          )
        )}
        <UserAvatar />
      </div>
    </header>
  )
}

const UserAvatar = () => {
  const { data: account, isLoading: isLoadingAccount } = useAccount()
  const { data: me, isLoading: isLoadingMe } = useMe()
  const { data, isLoading } = useMe()
  if (isLoading || isLoadingAccount || isLoadingMe)
    return (
      <Button variant="outline" size="sm" disabled className="ml-auto">
        <Loader2 className="animate-spin" />
      </Button>
    )
  return (
    <Popover>
      <PopoverTrigger className="ml-auto cursor-pointer" asChild>
        <Button variant="outline" size="sm">
          <WalletIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-card border-border/50 translate-y-3 -translate-x-4">
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="text-base font-medium">{data?.email}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mt-4 flex gap-1 items-center">
            <p>Wallet Address</p>
            <a
              href={`https://hashscan.io/testnet/account/${me?.hederaAccount.accountId}`}
              className="ml-2 text-primary"
              target="_blank"
            >
              <ExternalLinkIcon size={12} />
            </a>
          </div>
          <div className="text-base font-mono break-all">{data?.hederaAccount.accountId}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mt-4">Balance</div>
          <div className="text-base font-mono break-all">{account?.hbars}</div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
