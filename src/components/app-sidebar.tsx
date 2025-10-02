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
import { GlassButton } from "@/components/ui/glass"
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
          "transition-all duration-200 rounded-lg",
          "hover:bg-white/80 hover:text-foreground dark:hover:bg-slate-900/70",
          childMatch && "bg-white/90 text-foreground shadow-ios ring-1 ring-sky-400/40 dark:bg-slate-900/75"
        )}
      >
        <NavLink to={child.path} className="flex items-center gap-2.5">
          <div className={cn(
            "flex items-center justify-center rounded-md p-1.5 transition-all duration-200",
            childMatch
              ? "bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-600 dark:bg-slate-800/80 dark:text-sky-300"
              : "bg-white/60 text-muted-foreground group-hover:bg-white/70 group-hover:text-foreground dark:bg-slate-800/55"
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
                "group relative rounded-xl transition-all duration-200",
                "hover:bg-white/80 hover:text-foreground dark:hover:bg-slate-900/75",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
                match
                  ? "bg-white/90 text-foreground shadow-ios ring-1 ring-sky-400/40 dark:bg-slate-900/80"
                  : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "flex items-center justify-center rounded-lg p-2 transition-all duration-200",
                match
                  ? "bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-600 dark:bg-slate-800/80 dark:text-sky-300"
                  : "bg-white/60 text-muted-foreground group-hover:bg-white/70 group-hover:text-foreground dark:bg-slate-800/60 dark:group-hover:bg-slate-900/60"
              )}>
                <route.icon className="size-4 shrink-0" />
              </div>
              <span className="truncate">{route.label}</span>
              <ChevronRight className={cn(
                "ml-auto size-4 transition-all duration-300",
                "group-data-[state=open]/collapsible:rotate-90",
                match && "text-sky-500"
              )} />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <SidebarMenuSub className="ml-2 border-l-2 border-slate-200/50 pl-4 py-1 dark:border-slate-800/50">
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
          "group relative rounded-xl transition-all duration-200",
          "hover:bg-white/80 hover:text-foreground dark:hover:bg-slate-900/75",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
          match
            ? "bg-white/90 text-foreground shadow-ios ring-1 ring-sky-400/40 dark:bg-slate-900/80"
            : "text-muted-foreground"
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
              ? "bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-600 dark:bg-slate-800/80 dark:text-sky-300"
              : "bg-white/60 text-muted-foreground group-hover:bg-white/70 group-hover:text-foreground dark:bg-slate-800/60 dark:group-hover:bg-slate-900/60"
          )}>
            <route.icon className="size-4 shrink-0" />
          </div>
          <span className="truncate">{route.label}</span>
          {match && route.path === "/" && (
            <Sparkles className="ml-auto size-3.5 text-sky-500/70 animate-pulse" />
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
        "bg-white/95 dark:bg-slate-950/95",
        "backdrop-blur-3xl backdrop-saturate-150",
        "border-r border-slate-200/60 dark:border-slate-800/60",
        "shadow-glass dark:shadow-glass-lg",
        props.className
      )}
    >
      <SidebarHeader className="border-b border-slate-200/60 dark:border-slate-800/60 px-4 py-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] shadow-[0_2px_6px_rgba(255,95,87,0.45)]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] shadow-[0_2px_6px_rgba(254,188,46,0.45)]" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] shadow-[0_2px_6px_rgba(40,200,64,0.45)]" aria-hidden="true" />
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "data-[slot=sidebar-menu-button]:!p-3",
                "rounded-xl transition-all duration-200",
                "hover:bg-white/80 dark:hover:bg-slate-900/75",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              )}
            >
              <a href="#brand" className="flex items-center gap-3.5">
                <div className={cn(
                  "flex items-center justify-center rounded-lg p-2.5",
                  "bg-gradient-to-br from-sky-500 via-indigo-500 to-pink-500",
                  "shadow-[0_10px_40px_rgba(56,189,248,0.4),0_4px_20px_rgba(236,72,153,0.3)]",
                  "ring-1 ring-sky-400/30"
                )}>
                  <ArrowUpCircleIcon className="size-5 text-white drop-shadow-sm" />
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
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground">
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
      <SidebarFooter className="border-t border-slate-200/60 dark:border-slate-800/60 p-3">
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
