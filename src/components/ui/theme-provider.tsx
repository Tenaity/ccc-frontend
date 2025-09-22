import * as React from "react"

type Theme = "light" | "dark"
type ThemeMode = Theme | "system"

interface ThemeProviderState {
  theme: ThemeMode
  resolvedTheme: Theme
  setTheme: (theme: ThemeMode) => void
}

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(
  undefined,
)

function getPreferredScheme(): Theme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light"
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  root.classList.remove("light", "dark")
  root.classList.add(theme)
}

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeMode
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultTheme
    const stored = window.localStorage.getItem(storageKey)
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored
    }
    return defaultTheme
  })

  const [resolvedTheme, setResolvedTheme] = React.useState<Theme>(() =>
    theme === "system" ? getPreferredScheme() : theme,
  )

  React.useEffect(() => {
    const next = theme === "system" ? getPreferredScheme() : theme
    setResolvedTheme(next)
    applyThemeClass(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, theme)
    }
  }, [storageKey, theme])

  React.useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") {
      return undefined
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = () => {
      const next = media.matches ? "dark" : "light"
      setResolvedTheme(next)
      applyThemeClass(next)
    }
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [theme])

  const setTheme = React.useCallback((value: ThemeMode) => {
    if (value !== "light" && value !== "dark" && value !== "system") {
      return
    }
    setThemeState(value)
  }, [])

  const value = React.useMemo<ThemeProviderState>(
    () => ({ theme, resolvedTheme, setTheme }),
    [resolvedTheme, setTheme, theme],
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
