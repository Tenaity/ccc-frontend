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
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center justify-between gap-2 px-4 lg:gap-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-5" />
          <div className="flex flex-col gap-1">
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
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
