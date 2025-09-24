import * as React from "react"
import { toast as notify } from "sonner"

import { cn } from "@/lib/utils"

export type ToastRecord = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
  action?: React.ReactNode
}

interface ToastContextValue {
  toasts: ToastRecord[]
  toast: (toast: Omit<ToastRecord, "id">) => { id: string }
  dismiss: (id?: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

function createId() {
  return Math.random().toString(36).slice(2)
}

function showToast(id: string, toast: Omit<ToastRecord, "id">) {
  if (typeof window === "undefined") {
    return
  }

  const show = toast.variant === "destructive" ? notify.error : notify
  const title = toast.title ?? toast.description ?? ""
  const description = toast.title ? toast.description : undefined

  show(title, {
    id,
    description,
    duration: toast.duration,
    className: cn(
      "rounded-xl border border-border/60 bg-background text-foreground shadow-lg",
      toast.variant === "destructive" &&
        "border-destructive/60 bg-destructive text-destructive-foreground",
    ),
  })
}

type ToastStateProviderProps = React.PropsWithChildren<{
  children: React.ReactNode
}>

export function ToastStateProvider({ children }: ToastStateProviderProps) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([])

  const toast = React.useCallback((input: Omit<ToastRecord, "id">) => {
    const id = createId()
    setToasts((current) => [...current, { id, ...input }])
    showToast(id, input)
    return { id }
  }, [])

  const dismiss = React.useCallback((id?: string) => {
    setToasts((current) => {
      if (!id) {
        return []
      }
      return current.filter((toast) => toast.id !== id)
    })

    if (typeof window === "undefined") {
      return
    }

    if (id) {
      notify.dismiss(id)
    } else {
      notify.dismiss()
    }
  }, [])

  const value = React.useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastStateProvider")
  }
  return context
}
