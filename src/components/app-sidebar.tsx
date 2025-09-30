import * as React from "react"
import {
  ArrowUpCircleIcon,
  HelpCircleIcon,
  SettingsIcon,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type SecondaryNavItem = {
  title: string
  url: string
  icon: LucideIcon
}

const secondaryNav: SecondaryNavItem[] = [
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

  const [open, setOpen] = React.useState(!!match)

  if (route.children && route.children.length > 0) {
    return (
      <Collapsible
        key={route.path}
        asChild
        open={open}
        onOpenChange={setOpen}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={route.label} isActive={!!match}>
              <route.icon className="size-4 shrink-0" />
              <span className="truncate">{route.label}</span>
              <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {route.children.map((child) => {
                const childMatch = useMatch({
                  path: child.path,
                  end: true,
                })
                return (
                  <SidebarMenuSubItem key={child.path}>
                    <SidebarMenuSubButton asChild isActive={!!childMatch}>
                      <NavLink to={child.path}>
                        <child.icon className="size-4 shrink-0" />
                        <span className="truncate">{child.label}</span>
                      </NavLink>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                )
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem key={route.path}>
      <SidebarMenuButton asChild tooltip={route.label} isActive={!!match}>
        <NavLink
          to={route.path}
          end
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
