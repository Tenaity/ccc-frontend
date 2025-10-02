"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className="rounded-lg hover:bg-gradient-to-r hover:from-slate-100/50 hover:to-slate-50/30 dark:hover:from-slate-800/50 dark:hover:to-slate-900/30 transition-all duration-300"
              >
                <a href={item.url} className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center rounded-md p-1.5 bg-slate-100/60 text-muted-foreground dark:bg-slate-800/60">
                    <item.icon className="size-4 shrink-0" />
                  </div>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
