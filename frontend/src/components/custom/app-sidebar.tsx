import * as React from 'react'
// import { NavDocuments } from '@/components/nav-documents'
// import { NavMain } from '@/components/nav-main'
// import { NavSecondary } from '@/components/nav-secondary'
// import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import {
  Axis3DIcon,
  CameraIcon,
  ChartBarIcon,
  CoinsIcon,
  DatabaseIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  PaperclipIcon,
  ProportionsIcon,
  SearchIcon,
  SettingsIcon,
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
      title: 'Lifecycle',
      url: '/lifecycle',
      icon: ListIcon,
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: ChartBarIcon,
    },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: CameraIcon,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: ProportionsIcon,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: Axis3DIcon,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: HelpCircleIcon,
    },
    {
      title: 'Search',
      url: '#',
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: DatabaseIcon,
    },
    {
      name: 'Reports',
      url: '#',
      icon: PaperclipIcon,
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
