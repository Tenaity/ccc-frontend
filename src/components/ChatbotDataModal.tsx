import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GlassButton } from "@/components/ui/glass"
import { Loader, AlertCircle, CheckCircle } from "lucide-react"
import type { ChatbotDataDTO } from "@/types/chatbot"
import { ChatbotDataStatus, ContainerType, ContainerSize } from "@/types/chatbot"
import { createChatbotDataRecord, updateChatbotDataRecord } from "@/lib/api-chatbot"
import { validateChatbotDataForm, getFieldError, hasErrors, formatErrors } from "@/lib/validation-chatbot"
import type { ValidationError as ValidationErrorType } from "@/lib/validation-chatbot"

interface ChatbotDataModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingData?: ChatbotDataDTO | null
}

const FORM_FIELDS: Array<{
  key: keyof Omit<ChatbotDataDTO, "id">
  label: string
  type: "text" | "textarea" | "number" | "select"
  options?: Array<{ value: string; label: string }>
  required?: boolean
}> = [
  { key: "title", label: "Tiêu đề*", type: "text", required: true },
  { key: "raw_text", label: "Raw Text", type: "textarea" },
  { key: "major_section", label: "Major Section", type: "text" },
  { key: "full_section_id", label: "Full Section ID", type: "text" },
  { key: "source_table", label: "Source Table", type: "text" },
  {
    key: "container_type",
    label: "Container Type",
    type: "select",
    options: Object.entries(ContainerType).map(([_, value]) => ({
      value,
      label: value,
    })),
  },
  {
    key: "container_size",
    label: "Container Size",
    type: "select",
    options: Object.entries(ContainerSize).map(([_, value]) => ({
      value,
      label: value,
    })),
  },
  { key: "price", label: "Giá (VND)", type: "number" },
  {
    key: "status",
    label: "Trạng thái",
    type: "select",
    options: Object.entries(ChatbotDataStatus).map(([_, value]) => ({
      value,
      label: value,
    })),
  },
  { key: "location", label: "Địa điểm", type: "text" },
  { key: "from_location", label: "Từ", type: "text" },
  { key: "to_location", label: "Đến", type: "text" },
  { key: "unit", label: "Đơn vị", type: "text" },
  { key: "keywords", label: "Từ khóa", type: "text" },
  { key: "context", label: "Ngữ cảnh", type: "textarea" },
  { key: "scope_and_conditions", label: "Phạm vi & Điều kiện", type: "textarea" },
  { key: "point_note", label: "Ghi chú điểm", type: "textarea" },
  { key: "embedding_text", label: "Embedding Text", type: "textarea" },
  { key: "year", label: "Năm", type: "number" },
  { key: "process", label: "Quy trình", type: "text" },
  { key: "intent", label: "Ý định", type: "text" },
  { key: "cauhoi", label: "Câu hỏi", type: "text" },
  { key: "another_price", label: "Giá khác", type: "text" },
  { key: "site", label: "Trang web", type: "text" },
  { key: "service_type", label: "Loại dịch vụ", type: "text" },
  { key: "operation_type", label: "Loại hoạt động", type: "text" },
  { key: "shipment_direction", label: "Hướng vận chuyển", type: "text" },
  { key: "container_status", label: "Trạng thái Container", type: "text" },
  { key: "base_price_ref", label: "Tham chiếu giá gốc", type: "text" },
  { key: "price_type", label: "Loại giá", type: "text" },
  { key: "calculation_formula", label: "Công thức tính", type: "textarea" },
  { key: "maily", label: "Maily", type: "text" },
]

export default function ChatbotDataModal({
  isOpen,
  onClose,
  onSuccess,
  editingData,
}: ChatbotDataModalProps) {
  const [formData, setFormData] = useState<Partial<ChatbotDataDTO>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrorType[]>([])

  useEffect(() => {
    if (isOpen) {
      if (editingData) {
        setFormData(editingData)
      } else {
        setFormData({})
      }
      setError(null)
      setSuccess(false)
    }
  }, [isOpen, editingData])

  const handleFieldChange = (key: keyof ChatbotDataDTO, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validate form
    const errors = validateChatbotDataForm(formData)
    setValidationErrors(errors)

    if (hasErrors(errors)) {
      setError("Vui lòng kiểm tra các lỗi trong biểu mẫu")
      return
    }

    setLoading(true)

    try {
      if (editingData) {
        // Update
        await updateChatbotDataRecord(editingData.id, formData)
      } else {
        // Create
        await createChatbotDataRecord(formData)
      }

      setSuccess(true)
      setValidationErrors([])
      setTimeout(() => {
        onSuccess()
        onClose()
        setFormData({})
      }, 1500)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lỗi khi lưu bản ghi"
      setError(message)
      console.error("Error saving record:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingData ? "Chỉnh sửa bản ghi" : "Tạo bản ghi mới"}
          </DialogTitle>
          <DialogDescription>
            {editingData
              ? "Cập nhật thông tin chatbot data"
              : "Thêm bản ghi chatbot data mới"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-200 text-sm">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/30">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-200 text-sm">
                  {editingData ? "Cập nhật thành công!" : "Tạo bản ghi thành công!"}
                </p>
              </div>
            </div>
          )}

          {/* Form Fields - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORM_FIELDS.map((field) => {
              const fieldError = getFieldError(validationErrors, field.key as any)
              return (
                <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-medium mb-2">
                    {field.label}
                  </label>

                  {field.type === "text" && (
                    <>
                      <Input
                        type="text"
                        placeholder={field.label}
                        value={String(formData[field.key] ?? "")}
                        onChange={(e) => handleFieldChange(field.key, e.target.value || undefined)}
                        disabled={loading}
                        className={`rounded-lg ${
                          fieldError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {fieldError && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {fieldError}
                        </p>
                      )}
                    </>
                  )}

                  {field.type === "number" && (
                    <>
                      <Input
                        type="number"
                        placeholder={field.label}
                        value={formData[field.key] ?? ""}
                        onChange={(e) =>
                          handleFieldChange(field.key, e.target.value ? Number(e.target.value) : undefined)
                        }
                        disabled={loading}
                        className={`rounded-lg ${
                          fieldError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {fieldError && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {fieldError}
                        </p>
                      )}
                    </>
                  )}

                  {field.type === "textarea" && (
                    <>
                      <Textarea
                        placeholder={field.label}
                        value={String(formData[field.key] ?? "")}
                        onChange={(e) => handleFieldChange(field.key, e.target.value || undefined)}
                        disabled={loading}
                        className={`rounded-lg min-h-24 resize-none ${
                          fieldError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}
                      />
                      {fieldError && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {fieldError}
                        </p>
                      )}
                    </>
                  )}

                  {field.type === "select" && field.options && (
                    <>
                      <Select
                        value={String(formData[field.key] ?? "")}
                        onValueChange={(value) =>
                          handleFieldChange(field.key, value || undefined)
                        }
                        disabled={loading}
                      >
                        <SelectTrigger className={`rounded-lg ${
                          fieldError
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                            : ""
                        }`}>
                          <SelectValue placeholder={`Chọn ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Không chọn</SelectItem>
                          {field.options.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldError && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                          {fieldError}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <GlassButton
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="gap-2"
            >
              {loading && <Loader className="h-4 w-4 animate-spin" />}
              {editingData ? "Cập nhật" : "Tạo mới"}
            </GlassButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
