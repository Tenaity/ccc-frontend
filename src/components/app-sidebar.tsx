import * as React from "react"
import { ArrowUpCircleIcon, HelpCircleIcon, SettingsIcon } from "lucide-react"
import { NavLink, useMatch } from "react-router-dom"

import { appRoutes, type AppRoute } from "@/app/routes"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const secondaryNav = [
  {
    title: "Settings",
    url: "#settings",
    icon: SettingsIcon,
  },
  {
    title: "Support",
    url: "#support",
    icon: HelpCircleIcon,
  },
]

const currentUser = {
  name: "Customer Care Ops",
  email: "ops@ccc.local",
  avatar: "/avatars/shadcn.jpg",
}

function SidebarNavItem({ route }: { route: AppRoute }) {
  const match = useMatch({
    path: route.path === "/" ? "/" : `${route.path}/*`,
    end: route.path === "/",
  })

  return (
    <SidebarMenuItem key={route.path}>
      <SidebarMenuButton asChild tooltip={route.label} isActive={!!match}>
        <NavLink
          to={route.path}
          end={route.path === "/"}
          className="flex w-full min-w-0 items-center gap-2"
        >
          <route.icon className="size-4 shrink-0" />
          <span className="truncate">{route.label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#brand">
                <ArrowUpCircleIcon className="size-5" />
                <span className="text-base font-semibold">
                  Customer Care
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-160px)] pr-1">
              <SidebarMenu>
                {appRoutes.map((route) => (
                  <SidebarNavItem key={route.path} route={route} />
                ))}
              </SidebarMenu>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
        <NavSecondary items={secondaryNav} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
