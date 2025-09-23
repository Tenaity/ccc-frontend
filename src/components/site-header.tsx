import { ReactNode } from "react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-2 px-4 lg:gap-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-5" />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight sm:text-lg">
              {title}
            </h1>
            {description ? (
              <p className="text-xs text-muted-foreground sm:text-sm">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
