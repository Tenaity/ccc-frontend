import * as React from "react"
import {
  ArrowUpCircleIcon,
  HelpCircleIcon,
  SettingsIcon,
  ChevronRight,
  Sparkles,
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
import { cn } from "@/lib/utils"

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

  // Auto-expand when navigating to child routes
  React.useEffect(() => {
    if (match && !open) {
      setOpen(true)
    }
  }, [match, open])

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
            <SidebarMenuButton
              tooltip={route.label}
              isActive={!!match}
              className={cn(
                "group relative transition-all duration-200",
                "hover:bg-white/60 dark:hover:bg-white/10",
                match && "bg-primary/15 dark:bg-primary/20 font-medium shadow-sm"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-md p-1.5 transition-colors",
                match ? "bg-primary/15 text-primary" : "text-muted-foreground group-hover:text-foreground"
              )}>
                <route.icon className="size-4 shrink-0" />
              </div>
              <span className="truncate">{route.label}</span>
              <ChevronRight className={cn(
                "ml-auto size-4 transition-all duration-200",
                "group-data-[state=open]/collapsible:rotate-90",
                match && "text-primary"
              )} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <SidebarMenuSub className="ml-2 border-l-2 border-border/50 pl-4">
              {route.children.map((child) => {
                const childMatch = useMatch({
                  path: child.path,
                  end: true,
                })
                return (
                  <SidebarMenuSubItem key={child.path}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={!!childMatch}
                      className={cn(
                        "transition-all duration-200",
                        "hover:bg-white/50 dark:hover:bg-white/10",
                        childMatch && "bg-primary/15 dark:bg-primary/20 font-medium text-primary shadow-sm"
                      )}
                    >
                      <NavLink to={child.path} className="flex items-center gap-2">
                        <div className={cn(
                          "flex items-center justify-center rounded p-1 transition-colors",
                          childMatch ? "bg-primary/15 text-primary" : "text-muted-foreground"
                        )}>
                          <child.icon className="size-3.5 shrink-0" />
                        </div>
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
      <SidebarMenuButton
        asChild
        tooltip={route.label}
        isActive={!!match}
        className={cn(
          "group relative transition-all duration-200",
          "hover:bg-white/60 dark:hover:bg-white/10",
          match && "bg-primary/15 dark:bg-primary/20 font-medium shadow-sm"
        )}
      >
        <NavLink
          to={route.path}
          end
          className="flex w-full min-w-0 items-center gap-2"
        >
          <div className={cn(
            "flex items-center justify-center rounded-md p-1.5 transition-colors",
            match ? "bg-primary/15 text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}>
            <route.icon className="size-4 shrink-0" />
          </div>
          <span className="truncate">{route.label}</span>
          {match && route.path === "/" && (
            <Sparkles className="ml-auto size-3 text-primary/60 animate-pulse" />
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className={cn(
        // Enhanced glass effect for sidebar with high visibility
        "bg-white/85 dark:bg-slate-950/85",
        "backdrop-blur-2xl backdrop-saturate-150",
        "border-r border-white/30 dark:border-white/15",
        "shadow-[4px_0_24px_rgba(0,0,0,0.08)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.3)]",
        props.className
      )}
    >
      <SidebarHeader className="border-b border-white/20 dark:border-white/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "data-[slot=sidebar-menu-button]:!p-2",
                "hover:bg-white/60 dark:hover:bg-white/10",
                "hover:backdrop-blur-sm",
                "transition-all duration-200"
              )}
            >
              <a href="#brand" className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center justify-center rounded-xl p-2",
                  "bg-gradient-to-br from-primary to-primary/80",
                  "shadow-lg shadow-primary/20",
                  "backdrop-blur-sm"
                )}>
                  <ArrowUpCircleIcon className="size-5 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight">
                    Customer Care
                  </span>
                  <span className="text-xs text-muted-foreground/80">
                    Operations Center
                  </span>
                </div>
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
