import type { Assignment } from "@/types"

const JSON_HEADERS = { "Content-Type": "application/json" } as const

type JsonValue = Record<string, unknown>

function extractErrorMessage(body: string, fallback: string): string {
  const trimmed = body.trim()
  if (trimmed.length === 0) {
    return fallback
  }

  try {
    const parsed = JSON.parse(trimmed) as JsonValue | undefined
    const message = parsed?.error ?? parsed?.message
    if (typeof message === "string" && message.trim().length > 0) {
      return message
    }
  } catch {
    // body was not JSON; ignore and fallback to raw text
  }

  return trimmed || fallback
}

async function parseJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text()
  if (!res.ok) {
    throw new Error(extractErrorMessage(text, res.statusText))
  }

  if (text.length === 0) {
    return {} as T
  }

  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error("Phản hồi máy chủ không hợp lệ (JSON parse error)")
  }
}

export type ValidationConflict = {
  type?: string
  detail?: unknown
} & JsonValue

export interface ValidationResult {
  ok: boolean
  conflicts: ValidationConflict[]
  hasLeaderDup: boolean
}

function normalizeConflict(
  type: string | undefined,
  value: unknown,
): ValidationConflict {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return { type, ...(value as JsonValue) }
  }

  return {
    type,
    detail: value,
  }
}

export async function validateSchedule(
  year: number,
  month: number,
): Promise<ValidationResult> {
  const data = await parseJsonResponse<{
    ok: boolean
    conflicts?: unknown
  }>(
    await fetch(`/api/schedule/validate?year=${year}&month=${month}`),
  )

  const conflicts: ValidationConflict[] = []
  let hasLeaderDup = false

  if (Array.isArray(data.conflicts)) {
    for (const conflict of data.conflicts) {
      conflicts.push(normalizeConflict(undefined, conflict))
    }
  } else if (data.conflicts && typeof data.conflicts === "object") {
    for (const [type, list] of Object.entries(data.conflicts)) {
      if (
        (type === "leader_day_dup" || type === "leader_night_dup") &&
        Array.isArray(list) &&
        list.length > 0
      ) {
        hasLeaderDup = true
      }

      if (Array.isArray(list)) {
        for (const entry of list) {
          conflicts.push(normalizeConflict(type, entry))
        }
      } else if (list !== null && list !== undefined) {
        conflicts.push(normalizeConflict(type, list))
      }
    }
  }

  return {
    ok: data.ok,
    conflicts,
    hasLeaderDup,
  }
}

export interface GenerateOptions {
  year: number
  month: number
  shuffle?: boolean
  seed?: number | null
  save?: boolean
  fillHC?: boolean
}

export interface GenerateResponse {
  ok?: boolean
  planned?: Assignment[]
  error?: string
  details?: unknown
}

export async function generateSchedule(
  options: GenerateOptions,
): Promise<GenerateResponse> {
  const { year, month, shuffle = false, seed = null, save = false, fillHC = false } =
    options

  const payload = {
    year,
    month,
    shuffle,
    seed,
    save,
    fill_hc: fillHC,
  }

  return parseJsonResponse<GenerateResponse>(
    await fetch("/api/schedule/generate", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(payload),
    }),
  )
}

export interface ExportCsvResult {
  blob: Blob
  rowCount: number
  filename: string
  text: string
}

export async function exportScheduleCsv(
  year: number,
  month: number,
): Promise<ExportCsvResult> {
  const response = await fetch(`/api/export/month.csv?year=${year}&month=${month}`)
  const text = await response.text()

  if (!response.ok) {
    throw new Error(extractErrorMessage(text, response.statusText))
  }

  const blob = new Blob([text], {
    type: response.headers.get("Content-Type") ?? "text/csv",
  })

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const rowCount = lines.length > 0 ? Math.max(lines.length - 1, 0) : 0
  const filename = `schedule-${year}-${String(month).padStart(2, "0")}.csv`

  return {
    blob,
    rowCount,
    filename,
    text,
  }
}
