import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
  CoinsIcon,
  FilesIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ShoppingBasketIcon,
} from 'lucide-react'
import { SiteHeader } from './site-header'
import { NavMain } from './nav-main'
import { Link } from '@tanstack/react-router'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Marketplace',
      url: '/marketplace',
      icon: ShoppingBasketIcon,
    },
    {
      title: 'Invoices',
      url: '/invoices',
      icon: FileTextIcon,
    },
    {
      title: 'Files',
      url: '/files',
      icon: FilesIcon,
    },
  ],
}

export const AppSidebar = ({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar> & { children?: React.ReactNode }) => {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="p-1.5 hover:bg-transparent hover:text-primary">
              <Link to="/" className="flex gap-4 items-center">
                <CoinsIcon className="!size-5" />
                <span className="text-base font-semibold">{import.meta.env.VITE_APP_NAME}</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          {/* <NavDocuments items={data.documents} /> */}
          {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
        </SidebarContent>
        <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SiteHeader />
        <div className="px-4 lg:px-6 pt-4 lg:pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
