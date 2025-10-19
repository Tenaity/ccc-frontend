/**
 * Validation utilities for Chatbot Data
 */

import type { ChatbotDataFormInput } from "@/types/chatbot"

export interface ValidationError {
  field: keyof ChatbotDataFormInput
  message: string
}

/**
 * Validate chatbot data form input
 */
export function validateChatbotDataForm(data: Partial<ChatbotDataFormInput>): ValidationError[] {
  const errors: ValidationError[] = []

  // Title is required
  if (!data.title || typeof data.title !== "string" || data.title.trim() === "") {
    errors.push({
      field: "title",
      message: "Tiêu đề không được để trống",
    })
  }

  // Title max length 255
  if (data.title && data.title.length > 255) {
    errors.push({
      field: "title",
      message: "Tiêu đề không được vượt quá 255 ký tự",
    })
  }

  // Price must be a positive number
  if (data.price !== undefined && data.price !== null) {
    if (typeof data.price !== "number") {
      errors.push({
        field: "price",
        message: "Giá phải là một số",
      })
    } else if (data.price < 0) {
      errors.push({
        field: "price",
        message: "Giá không được âm",
      })
    }
  }

  // Year must be between 1900 and 2100
  if (data.year !== undefined && data.year !== null) {
    if (typeof data.year !== "number") {
      errors.push({
        field: "year",
        message: "Năm phải là một số",
      })
    } else if (data.year < 1900 || data.year > 2100) {
      errors.push({
        field: "year",
        message: "Năm phải trong khoảng 1900 - 2100",
      })
    }
  }

  // Raw text max length 5000
  if (data.raw_text && data.raw_text.length > 5000) {
    errors.push({
      field: "raw_text",
      message: "Raw text không được vượt quá 5000 ký tự",
    })
  }

  // Keywords should be separated by commas if present
  if (data.keywords && typeof data.keywords === "string") {
    // Check if it's a reasonable length
    if (data.keywords.length > 500) {
      errors.push({
        field: "keywords",
        message: "Từ khóa không được vượt quá 500 ký tự",
      })
    }
  }

  // Container type validation
  const validContainerTypes = ["Khô", "Lạnh"]
  if (data.container_type && !validContainerTypes.includes(data.container_type)) {
    errors.push({
      field: "container_type",
      message: "Loại container không hợp lệ",
    })
  }

  // Container size validation
  const validContainerSizes = ["20ft", "40ft", "45ft"]
  if (data.container_size && !validContainerSizes.includes(data.container_size)) {
    errors.push({
      field: "container_size",
      message: "Kích thước container không hợp lệ",
    })
  }

  // Status validation
  const validStatuses = ["Đã chuẩn hóa", "Đang xử lý", "Chưa xử lý"]
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push({
      field: "status",
      message: "Trạng thái không hợp lệ",
    })
  }

  return errors
}

/**
 * Get error message for a specific field
 */
export function getFieldError(
  errors: ValidationError[],
  field: keyof ChatbotDataFormInput
): string | null {
  const error = errors.find(e => e.field === field)
  return error?.message ?? null
}

/**
 * Check if form has any errors
 */
export function hasErrors(errors: ValidationError[]): boolean {
  return errors.length > 0
}

/**
 * Format errors for display
 */
export function formatErrors(errors: ValidationError[]): string {
  return errors.map(e => `${e.message}`).join("\n")
}
