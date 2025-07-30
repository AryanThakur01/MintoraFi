import { useMe } from '@/api/hooks'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { CoreText } from './core-text'
import { Link, Loader2 } from 'lucide-react'
import { useAccount } from '@/modules/invoices/api/hooks'

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
        <UserAvatar />
      </div>
    </header>
  )
}

const UserAvatar = () => {
  const { data: account, isLoading: isLoadingAccount } = useAccount()
  const { data, isLoading } = useMe()
  if (isLoading || isLoadingAccount)
    return <Loader2 className="animate-spin h-6 w-6 text-gray-500 ml-auto" />
  return (
    <Popover>
      <PopoverTrigger className="ml-auto">
        <Avatar className="border-2">
          <AvatarImage
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${data?.id}`}
            alt="@evilrabbit"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-muted border-2">
        <div>
          <div className="text-sm text-gray-500">Email</div>
          <div className="text-base font-medium">{data?.email}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mt-4">Wallet Address</div>
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
