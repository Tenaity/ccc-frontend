import { ChatbotPoint } from "@/types/chatbot"

export type ColumnKey = keyof ChatbotPoint

export const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "Đã chuẩn hóa", label: "Đã chuẩn hóa" },
  { value: "Đang xử lý", label: "Đang xử lý" },
  { value: "Chưa xử lý", label: "Chưa xử lý" },
]

export const allColumns: Array<{ key: ColumnKey; label: string; width?: string }> = [
  { key: "id", label: "ID", width: "w-[200px]" },
  { key: "raw_text", label: "Raw Text", width: "w-[300px]" },
  { key: "major_section", label: "Major Section", width: "w-[150px]" },
  { key: "full_section_id", label: "Full Section ID", width: "w-[150px]" },
  { key: "source_table", label: "Source Table", width: "w-[150px]" },
  { key: "title", label: "Title", width: "w-[200px]" },
  { key: "site", label: "Site", width: "w-[120px]" },
  { key: "another_price", label: "Another Price", width: "w-[120px]" },
  { key: "shipment_direction", label: "Shipment Direction", width: "w-[150px]" },
  { key: "container_status", label: "Container Status", width: "w-[150px]" },
  { key: "container_type", label: "Container Type", width: "w-[150px]" },
  { key: "container_size", label: "Container Size", width: "w-[140px]" },
  { key: "service_type", label: "Service Type", width: "w-[140px]" },
  { key: "operation_type", label: "Operation Type", width: "w-[140px]" },
  { key: "location", label: "Location", width: "w-[140px]" },
  { key: "from_location", label: "From", width: "w-[140px]" },
  { key: "to_location", label: "To", width: "w-[140px]" },
  { key: "unit", label: "Unit", width: "w-[100px]" },
  { key: "price", label: "Price", width: "w-[120px]" },
  { key: "price_type", label: "Price Type", width: "w-[120px]" },
  { key: "base_price_ref", label: "Base Price Ref", width: "w-[150px]" },
  { key: "calculation_formula", label: "Calculation Formula", width: "w-[200px]" },
  { key: "context", label: "Context", width: "w-[200px]" },
  { key: "scope_and_conditions", label: "Scope & Conditions", width: "w-[200px]" },
  { key: "keywords", label: "Keywords", width: "w-[200px]" },
  { key: "embedding_text", label: "Embedding Text", width: "w-[200px]" },
  { key: "status", label: "Status", width: "w-[120px]" },
  { key: "process", label: "Process", width: "w-[120px]" },
  { key: "intent", label: "Intent", width: "w-[120px]" },
  { key: "cauhoi", label: "Câu hỏi", width: "w-[200px]" },
  { key: "maily", label: "MAILY", width: "w-[120px]" },
]

export const defaultVisibleColumns: ColumnKey[] = [
  "id",
  "title",
  "raw_text",
  "major_section",
  "source_table",
  "container_type",
  "container_size",
  "price",
  "status",
]
