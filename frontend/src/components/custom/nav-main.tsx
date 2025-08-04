'use client'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useLogout } from '@/modules/auth/api/hooks'
import { useRouter } from '@tanstack/react-router'
import { Loader2, LogOutIcon } from 'lucide-react'

export const NavMain = ({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ElementType
  }[]
}) => {
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout()
  const router = useRouter()
  const pathName = router.state.location.pathname
  const handleLogout = async () => {
    try {
      await logout()
      router.navigate({ to: '/auth' })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <SidebarGroup className="h-full">
      <SidebarGroupContent className="flex flex-col gap-2 h-full">
        {/* <SidebarMenu> */}
        {/*   <SidebarMenuItem className="flex items-center gap-2"> */}
        {/*     <SidebarMenuButton */}
        {/*       tooltip="Quick Create" */}
        {/*       className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear" */}
        {/*     > */}
        {/*       <PlusCircleIcon /> */}
        {/*       <span>Quick Create</span> */}
        {/*     </SidebarMenuButton> */}
        {/*     <Button */}
        {/*       size="icon" */}
        {/*       className="size-8 group-data-[collapsible=icon]:opacity-0" */}
        {/*       variant="outline" */}
        {/*     > */}
        {/*       <MailOpenIcon /> */}
        {/*       <span className="sr-only">Inbox</span> */}
        {/*     </Button> */}
        {/*   </SidebarMenuItem> */}
        {/* </SidebarMenu> */}
        <SidebarMenu className="h-full">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={
                  (item.url === '/' && pathName === '/') ||
                  (pathName !== '/' && item.url.startsWith(pathName))
                }
                tooltip={item.title}
                onClick={() => router.navigate({ to: item.url })}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem className="mt-auto">
            <SidebarMenuButton
              variant="outline"
              className="cursor-pointer hover:bg-destructive bg-destructive/80"
              onClick={handleLogout}
            >
              {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOutIcon />}
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
