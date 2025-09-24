import { ReactNode } from "react"
import { Link } from "react-router-dom"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export type SiteHeaderBreadcrumb = {
  label: string
  href?: string
}

export function SiteHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: SiteHeaderBreadcrumb[]
}) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 sticky top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear">
      <div className="mx-auto w-full max-w-[1400px] px-3 md:px-6">
        <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-start gap-3 md:items-center">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 hidden data-[orientation=vertical]:h-5 sm:block" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h1 className="text-base font-semibold leading-tight sm:text-lg">
                {title}
              </h1>
              {description ? (
                <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-none">
                  {description}
                </p>
              ) : null}
              {breadcrumbs && breadcrumbs.length > 0 ? (
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((item, index) => {
                      const isLast = index === breadcrumbs.length - 1

                      return (
                        <BreadcrumbItem key={`${item.label}-${index}`}>
                          {isLast ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : item.href ? (
                            <BreadcrumbLink asChild>
                              <Link to={item.href}>{item.label}</Link>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          )}
                          {!isLast ? <BreadcrumbSeparator /> : null}
                        </BreadcrumbItem>
                      )
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              ) : null}
            </div>
          </div>
          {actions ? (
            <div className="flex w-full justify-end gap-2 md:w-auto md:justify-end">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
