import { Toaster as SonnerToaster, type ToasterProps } from "sonner"

import { useTheme } from "@/components/ui/theme-provider"

const toasterClassNames: ToasterProps["toastOptions"] = {
  classNames: {
    toast:
      "rounded-xl border border-border/60 bg-background text-foreground shadow-lg", // align with shadcn styles
    title: "text-sm font-semibold",
    description: "text-sm text-muted-foreground",
    actionButton:
      "inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    cancelButton:
      "inline-flex h-8 items-center justify-center rounded-md border border-border/60 bg-muted px-3 text-xs font-medium text-muted-foreground transition hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    closeButton:
      "rounded-md p-1 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  },
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <SonnerToaster
      theme={resolvedTheme}
      className="toaster group"
      toastOptions={toasterClassNames}
      {...props}
    />
  )
}

export { Toaster }
