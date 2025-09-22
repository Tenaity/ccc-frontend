import * as React from "react"

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

export function ToastStateProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([])

  const toast = React.useCallback((toast: Omit<ToastRecord, "id">) => {
    const id = createId()
    setToasts((current) => [...current, { id, ...toast }])
    return { id }
  }, [])

  const dismiss = React.useCallback((id?: string) => {
    if (!id) {
      setToasts([])
      return
    }
    setToasts((current) => current.filter((toast) => toast.id !== id))
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
