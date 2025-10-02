import { useEffect, useState } from "react"
import { importHolidaysFromNager, listHolidaysByYear } from "@/lib/api"

const CACHE_KEY_PREFIX = "holidays_fetched_"
const CACHE_DURATION_DAYS = 30

interface CacheEntry {
  year: number
  timestamp: number
  count: number
}

function getCacheKey(year: number): string {
  return `${CACHE_KEY_PREFIX}${year}`
}

function getCachedEntry(year: number): CacheEntry | null {
  try {
    const cached = localStorage.getItem(getCacheKey(year))
    if (!cached) return null

    const entry = JSON.parse(cached) as CacheEntry
    const now = Date.now()
    const ageInDays = (now - entry.timestamp) / (1000 * 60 * 60 * 24)

    if (ageInDays > CACHE_DURATION_DAYS) {
      localStorage.removeItem(getCacheKey(year))
      return null
    }

    return entry
  } catch {
    return null
  }
}

function setCacheEntry(year: number, count: number): void {
  try {
    const entry: CacheEntry = {
      year,
      timestamp: Date.now(),
      count,
    }
    localStorage.setItem(getCacheKey(year), JSON.stringify(entry))
  } catch {
    // Ignore localStorage errors
  }
}

export function useHolidayAutoFetch(year: number) {
  const [loading, setLoading] = useState(false)
  const [imported, setImported] = useState(0)

  useEffect(() => {
    async function autoFetch() {
      // Check cache first
      const cached = getCachedEntry(year)
      if (cached) {
        return
      }

      setLoading(true)
      try {
        // Check if holidays already exist
        const existing = await listHolidaysByYear(year)

        if (existing.length === 0) {
          // Auto-import if none exist
          const result = await importHolidaysFromNager(year)
          setImported(result.imported)
          setCacheEntry(year, result.imported)
        } else {
          // Cache existing count
          setCacheEntry(year, existing.length)
        }
      } catch (error) {
        console.error("Failed to auto-fetch holidays:", error)
      } finally {
        setLoading(false)
      }
    }

    void autoFetch()
  }, [year])

  return { loading, imported }
}
