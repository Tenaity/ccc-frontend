/**
 * Chatbot Data DTO - Unified interface matching backend
 * Uses snake_case convention throughout
 * All fields are optional to support partial updates and null values
 */
export interface ChatbotDataDTO {
  id: string
  raw_text?: string | null
  major_section?: string | null
  full_section_id?: string | null
  source_table?: string | null
  another_price?: string | null
  title?: string | null
  site?: string | null
  shipment_direction?: string | null
  container_status?: string | null
  container_type?: string | null
  container_size?: string | null
  service_type?: string | null
  operation_type?: string | null
  location?: string | null
  from_location?: string | null
  to_location?: string | null
  unit?: string | null
  price?: number | null
  price_type?: string | null
  base_price_ref?: string | null
  calculation_formula?: string | null
  context?: string | null
  scope_and_conditions?: string | null
  point_note?: string | null
  keywords?: string | null
  embedding_text?: string | null
  year?: number | null
  status?: string | null
  process?: string | null
  intent?: string | null
  cauhoi?: string | null
  maily?: string | null
}

/**
 * Paginated response for list API
 */
export interface ChatbotDataPage {
  items: ChatbotDataDTO[]
  page: number
  page_size: number
  total: number
}

/**
 * Status enum for chatbot data
 */
export const ChatbotDataStatus = {
  NORMALIZED: "Đã chuẩn hóa",
  PROCESSING: "Đang xử lý",
  PENDING: "Chưa xử lý",
} as const

export type ChatbotDataStatusType = (typeof ChatbotDataStatus)[keyof typeof ChatbotDataStatus]

/**
 * Container type enum
 */
export const ContainerType = {
  DRY: "Khô",
  COLD: "Lạnh",
} as const

export type ContainerTypeValue = (typeof ContainerType)[keyof typeof ContainerType]

/**
 * Container size enum
 */
export const ContainerSize = {
  SIZE_20FT: "20ft",
  SIZE_40FT: "40ft",
  SIZE_45FT: "45ft",
} as const

export type ContainerSizeValue = (typeof ContainerSize)[keyof typeof ContainerSize]

/**
 * Form input for creating/updating chatbot data
 * Subset of ChatbotDataDTO for form submission
 */
export type ChatbotDataFormInput = Omit<ChatbotDataDTO, "id">

/**
 * Backward compatibility alias
 * @deprecated Use ChatbotDataDTO instead
 */
export type ChatbotPoint = ChatbotDataDTO

/**
 * Backward compatibility alias
 * @deprecated Use ChatbotDataFormInput instead
 */
export interface ChatbotPointFormData extends Omit<ChatbotDataDTO, "id"> {
  id?: string
}