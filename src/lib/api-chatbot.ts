/**
 * Chatbot Data API Client
 * Handles all API calls for chatbot data CRUD operations
 */

import type { ChatbotDataDTO, ChatbotDataPage } from "@/types/chatbot"

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""
const API_KEY = "123456" // TODO: Move to env when ready

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
} as const

// Helper to build full API URL
function buildApiUrl(path: string): string {
  if (path.startsWith("http")) return path
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return base ? `${base}${cleanPath}` : cleanPath
}

// Helper for fetch with API key
function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers)
  if (!headers.has("x-api-key")) {
    headers.set("x-api-key", API_KEY)
  }

  return fetch(buildApiUrl(url), {
    ...options,
    headers,
  })
}

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

/**
 * Convert API response (camelCase) to frontend DTO (snake_case)
 */
function convertApiResponseToDTO(data: Record<string, unknown>): ChatbotDataDTO {
  return {
    id: String(data.id ?? ""),
    raw_text: data.rawText ? String(data.rawText) : undefined,
    major_section: data.majorSection ? String(data.majorSection) : undefined,
    full_section_id: data.fullSectionId ? String(data.fullSectionId) : undefined,
    source_table: data.sourceTable ? String(data.sourceTable) : undefined,
    another_price: data.anotherPrice ? String(data.anotherPrice) : undefined,
    title: data.title ? String(data.title) : undefined,
    site: data.site ? String(data.site) : undefined,
    shipment_direction: data.shipmentDirection ? String(data.shipmentDirection) : undefined,
    container_status: data.containerStatus ? String(data.containerStatus) : undefined,
    container_type: data.containerType ? String(data.containerType) : undefined,
    container_size: data.containerSize ? String(data.containerSize) : undefined,
    service_type: data.serviceType ? String(data.serviceType) : undefined,
    operation_type: data.operationType ? String(data.operationType) : undefined,
    location: data.location ? String(data.location) : undefined,
    from_location: data.from ? String(data.from) : undefined,
    to_location: data.to ? String(data.to) : undefined,
    unit: data.unit ? String(data.unit) : undefined,
    price: typeof data.price === "number" ? data.price : undefined,
    price_type: data.price_type ? String(data.price_type) : undefined,
    base_price_ref: data.base_price_ref ? String(data.base_price_ref) : undefined,
    calculation_formula: data.calculation_formula ? String(data.calculation_formula) : undefined,
    context: data.context ? String(data.context) : undefined,
    scope_and_conditions: data.scope_and_conditions ? String(data.scope_and_conditions) : undefined,
    point_note: data.point_note ? String(data.point_note) : undefined,
    keywords: data.keywords ? String(data.keywords) : undefined,
    embedding_text: data.embeddingText ? String(data.embeddingText) : undefined,
    year: typeof data.year === "number" ? data.year : undefined,
    status: data.status ? String(data.status) : undefined,
    process: data.process ? String(data.process) : undefined,
    intent: data.intent ? String(data.intent) : undefined,
    cauhoi: data.cauhoi ? String(data.cauhoi) : undefined,
    maily: data.MAILY ? String(data.MAILY) : undefined,
  }
}

/**
 * Convert frontend DTO (snake_case) to API request (camelCase)
 */
function convertDTOToApiRequest(dto: Partial<ChatbotDataDTO>): Record<string, unknown> {
  const payload: Record<string, unknown> = {}

  if (dto.raw_text !== undefined) payload.rawText = dto.raw_text
  if (dto.major_section !== undefined) payload.majorSection = dto.major_section
  if (dto.full_section_id !== undefined) payload.fullSectionId = dto.full_section_id
  if (dto.source_table !== undefined) payload.sourceTable = dto.source_table
  if (dto.another_price !== undefined) payload.anotherPrice = dto.another_price
  if (dto.title !== undefined) payload.title = dto.title
  if (dto.site !== undefined) payload.site = dto.site
  if (dto.shipment_direction !== undefined) payload.shipmentDirection = dto.shipment_direction
  if (dto.container_status !== undefined) payload.containerStatus = dto.container_status
  if (dto.container_type !== undefined) payload.containerType = dto.container_type
  if (dto.container_size !== undefined) payload.containerSize = dto.container_size
  if (dto.service_type !== undefined) payload.serviceType = dto.service_type
  if (dto.operation_type !== undefined) payload.operationType = dto.operation_type
  if (dto.location !== undefined) payload.location = dto.location
  if (dto.from_location !== undefined) payload.from = dto.from_location
  if (dto.to_location !== undefined) payload.to = dto.to_location
  if (dto.unit !== undefined) payload.unit = dto.unit
  if (dto.price !== undefined) payload.price = dto.price
  if (dto.price_type !== undefined) payload.price_type = dto.price_type
  if (dto.base_price_ref !== undefined) payload.base_price_ref = dto.base_price_ref
  if (dto.calculation_formula !== undefined) payload.calculation_formula = dto.calculation_formula
  if (dto.context !== undefined) payload.context = dto.context
  if (dto.scope_and_conditions !== undefined) payload.scope_and_conditions = dto.scope_and_conditions
  if (dto.point_note !== undefined) payload.point_note = dto.point_note
  if (dto.keywords !== undefined) payload.keywords = dto.keywords
  if (dto.embedding_text !== undefined) payload.embeddingText = dto.embedding_text
  if (dto.year !== undefined) payload.year = dto.year
  if (dto.status !== undefined) payload.status = dto.status
  if (dto.process !== undefined) payload.process = dto.process
  if (dto.intent !== undefined) payload.intent = dto.intent
  if (dto.cauhoi !== undefined) payload.cauhoi = dto.cauhoi
  if (dto.maily !== undefined) payload.MAILY = dto.maily

  return payload
}

/**
 * List chatbot data records with pagination
 */
export async function listChatbotData(
  page: number = 1,
  page_size: number = 20,
): Promise<ChatbotDataPage> {
  if (page < 1) throw new Error("page must be >= 1")
  if (page_size < 1 || page_size > 200) throw new Error("page_size must be between 1 and 200")

  const response = await parseJsonResponse<{
    items: Record<string, unknown>[]
    page: number
    page_size: number
    total: number
  }>(await apiFetch(`/api/chatbot-data?page=${page}&page_size=${page_size}`))

  return {
    items: response.items.map(convertApiResponseToDTO),
    page: response.page,
    page_size: response.page_size,
    total: response.total,
  }
}

/**
 * Get single chatbot data record by ID
 */
export async function getChatbotDataRecord(record_id: string): Promise<ChatbotDataDTO> {
  const response = await parseJsonResponse<Record<string, unknown>>(
    await apiFetch(`/api/chatbot-data/${record_id}`),
  )

  return convertApiResponseToDTO(response)
}

/**
 * Create new chatbot data record
 */
export async function createChatbotDataRecord(
  payload: Partial<ChatbotDataDTO>,
): Promise<ChatbotDataDTO> {
  const apiPayload = convertDTOToApiRequest(payload)

  const response = await parseJsonResponse<Record<string, unknown>>(
    await apiFetch(`/api/chatbot-data`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(apiPayload),
    }),
  )

  return convertApiResponseToDTO(response)
}

/**
 * Update chatbot data record
 */
export async function updateChatbotDataRecord(
  record_id: string,
  payload: Partial<ChatbotDataDTO>,
): Promise<ChatbotDataDTO> {
  const apiPayload = convertDTOToApiRequest(payload)

  const response = await parseJsonResponse<Record<string, unknown>>(
    await apiFetch(`/api/chatbot-data/${record_id}`, {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify(apiPayload),
    }),
  )

  return convertApiResponseToDTO(response)
}

/**
 * Delete chatbot data record
 */
export async function deleteChatbotDataRecord(record_id: string): Promise<void> {
  const response = await apiFetch(`/api/chatbot-data/${record_id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(extractErrorMessage(text, response.statusText))
  }
}

export {
  convertApiResponseToDTO,
  convertDTOToApiRequest,
}
