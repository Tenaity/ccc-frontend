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

function SidebarSubMenuItem({ child }: { child: AppRoute }) {
  const childMatch = useMatch({
    path: child.path,
    end: true,
  })

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        isActive={!!childMatch}
        className={cn(
          "transition-all duration-300 rounded-lg",
          "hover:bg-gradient-to-r hover:from-slate-100/50 hover:to-slate-50/30",
          "dark:hover:from-slate-800/50 dark:hover:to-slate-900/30",
          childMatch && "bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 font-semibold text-primary shadow-sm ring-1 ring-primary/20"
        )}
      >
        <NavLink to={child.path} className="flex items-center gap-2.5">
          <div className={cn(
            "flex items-center justify-center rounded-md p-1.5 transition-all duration-200",
            childMatch
              ? "bg-primary/15 text-primary shadow-sm ring-1 ring-primary/30"
              : "bg-slate-100/50 text-muted-foreground dark:bg-slate-800/50"
          )}>
            <child.icon className="size-3.5 shrink-0" />
          </div>
          <span className="truncate">{child.label}</span>
        </NavLink>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
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
                "group relative transition-all duration-300 rounded-xl",
                "hover:bg-gradient-to-r hover:from-slate-100/60 hover:to-slate-50/40",
                "dark:hover:from-slate-800/60 dark:hover:to-slate-900/40",
                "hover:shadow-sm",
                match && "bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/25 dark:to-primary/15 font-semibold shadow-md ring-1 ring-primary/20"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-lg p-2 transition-all duration-200",
                match
                  ? "bg-primary/20 text-primary shadow-sm ring-2 ring-primary/30"
                  : "bg-slate-100/60 text-muted-foreground group-hover:bg-slate-200/60 group-hover:text-foreground dark:bg-slate-800/60 dark:group-hover:bg-slate-700/60"
              )}>
                <route.icon className="size-4 shrink-0" />
              </div>
              <span className="truncate">{route.label}</span>
              <ChevronRight className={cn(
                "ml-auto size-4 transition-all duration-300",
                "group-data-[state=open]/collapsible:rotate-90",
                match && "text-primary"
              )} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <SidebarMenuSub className="ml-2 border-l-2 border-slate-200/60 dark:border-slate-700/60 pl-4 py-1">
              {route.children.map((child) => (
                <SidebarSubMenuItem key={child.path} child={child} />
              ))}
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
          "group relative transition-all duration-300 rounded-xl",
          "hover:bg-gradient-to-r hover:from-slate-100/60 hover:to-slate-50/40",
          "dark:hover:from-slate-800/60 dark:hover:to-slate-900/40",
          "hover:shadow-sm",
          match && "bg-gradient-to-r from-primary/15 to-primary/10 dark:from-primary/25 dark:to-primary/15 font-semibold shadow-md ring-1 ring-primary/20"
        )}
      >
        <NavLink
          to={route.path}
          end
          className="flex w-full min-w-0 items-center gap-2.5"
        >
          <div className={cn(
            "flex items-center justify-center rounded-lg p-2 transition-all duration-200",
            match
              ? "bg-primary/20 text-primary shadow-sm ring-2 ring-primary/30"
              : "bg-slate-100/60 text-muted-foreground group-hover:bg-slate-200/60 group-hover:text-foreground dark:bg-slate-800/60 dark:group-hover:bg-slate-700/60"
          )}>
            <route.icon className="size-4 shrink-0" />
          </div>
          <span className="truncate">{route.label}</span>
          {match && route.path === "/" && (
            <Sparkles className="ml-auto size-3.5 text-primary/70 animate-pulse" />
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
        // Enhanced glass-morphism design
        "bg-white/95 dark:bg-slate-950/95",
        "backdrop-blur-3xl backdrop-saturate-150",
        "border-r border-slate-200/60 dark:border-slate-800/60",
        "shadow-[8px_0_32px_rgba(15,23,42,0.12)] dark:shadow-[8px_0_32px_rgba(0,0,0,0.4)]",
        props.className
      )}
    >
      <SidebarHeader className="border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "data-[slot=sidebar-menu-button]:!p-3",
                "hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10",
                "hover:shadow-sm hover:shadow-primary/10",
                "rounded-xl transition-all duration-300"
              )}
            >
              <a href="#brand" className="flex items-center gap-3.5">
                <div className={cn(
                  "flex items-center justify-center rounded-xl p-2.5",
                  "bg-gradient-to-br from-primary via-primary/90 to-primary/70",
                  "shadow-lg shadow-primary/30",
                  "ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                )}>
                  <ArrowUpCircleIcon className="size-5 text-primary-foreground drop-shadow-sm" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold tracking-tight text-foreground">
                    Customer Care
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Operations Center
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground/80">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-180px)] pr-1">
              <SidebarMenu className="gap-1.5">
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
      <SidebarFooter className="border-t border-slate-200/50 dark:border-slate-800/50 p-3">
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
