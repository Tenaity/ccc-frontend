export interface ChatbotPoint {
  id: string // uuid
  raw_text: string
  major_section: string
  full_section_id: string
  source_table: string
  title: string
  site: string
  anotherPrice: string
  shipmentDirection: string
  containerStatus: string
  containerType: string
  containerSize: string
  serviceType: string
  operationType: string
  location: string
  from: string[]
  to: string[]
  unit: string
  price: number
  price_type: string
  base_price_ref: string
  calculation_formula: string
  context: string
  scope_and_conditions: string
  point_note: string
  keywords: string[]
  embedding_text: string
  Year: number
  status: string
  checklist_missing: string
  error_warning: string
  section: string
  process: string
  intent: string
  cauhoi: string
  MAILY: string
}

export interface ChatbotPointFormData extends Omit<ChatbotPoint, 'id'> {
  id?: string
}