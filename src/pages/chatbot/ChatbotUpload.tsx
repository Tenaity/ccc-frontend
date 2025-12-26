import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, FileText, CheckCircle2, AlertCircle, Sparkles, Cloud, RefreshCw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel, GlassButton, GlassBadge } from "@/components/ui/glass"
import { cn } from "@/lib/utils"

const API_KEY = "123456"

function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers)
  if (!headers.has("x-api-key")) {
    headers.set("x-api-key", API_KEY)
  }
  return fetch(url, { ...options, headers })
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv'
]

export default function ChatbotUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [webhookResponse, setWebhookResponse] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "File không hợp lệ",
        description: "Chỉ chấp nhận file PDF, DOCX, Excel, hoặc CSV"
      })
      return
    }
    setSelectedFile(file)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('fileName', selectedFile.name)
      formData.append('fileSize', String(selectedFile.size))
      formData.append('fileType', selectedFile.type)

      console.log('Uploading file:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      })

      const response = await apiFetch('/api/chatbot/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      const responseData = await response.json()
      console.log('Response:', responseData)

      if (response.ok) {
        toast({
          title: "Upload thành công",
          description: `File ${selectedFile.name} đã được upload`
        })
        setWebhookResponse(responseData)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        throw new Error(`Upload failed with status ${response.status}: ${JSON.stringify(responseData)}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        variant: "destructive",
        title: "Upload thất bại",
        description: error instanceof Error ? error.message : "Không thể upload file. Vui lòng thử lại."
      })
    } finally {
      setUploading(false)
    }
  }

  const getFileIcon = () => {
    if (!selectedFile) return null
    return (
      <div className={cn(
        "p-4 rounded-2xl",
        "bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30"
      )}>
        <FileText className="h-12 w-12 text-sky-600 dark:text-sky-400" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        icon={Upload}
        tagline="Smart File Processing"
        title="Upload & Process Files"
        description="Upload tài liệu và xử lý tự động qua AI-powered webhook"
      />

      <div className="space-y-6">
        {/* Upload Section with Premium Glass Design */}
        <GlassPanel variant="strong" className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Upload File
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Hỗ trợ: PDF, DOCX, Excel, CSV • Tối đa 10MB
            </p>
          </div>

          {/* Enhanced Drag and Drop Zone */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-12 text-center",
              "transition-all duration-300 ease-out",
              dragActive
                ? "border-sky-400 bg-sky-50/50 dark:bg-sky-900/20 scale-[1.02]"
                : "border-slate-200/60 dark:border-slate-800/60 hover:border-sky-300 dark:hover:border-sky-700",
              "backdrop-blur-sm"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.xlsx,.xls,.csv"
              onChange={handleFileInput}
            />

            {selectedFile ? (
              <div className="flex items-center justify-between gap-6 max-w-2xl mx-auto">
                {getFileIcon()}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-lg text-foreground">{selectedFile.name}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <GlassBadge variant="info" className="gap-1.5">
                      <FileText className="h-3 w-3" />
                      {selectedFile.type.split('/').pop()?.toUpperCase()}
                    </GlassBadge>
                    <GlassBadge variant="success" className="gap-1.5">
                      <CheckCircle2 className="h-3 w-3" />
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </GlassBadge>
                  </div>
                </div>
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="hover:border-red-400/50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </GlassButton>
              </div>
            ) : (
              <div className="space-y-6">
                <div className={cn(
                  "mx-auto w-20 h-20 rounded-3xl flex items-center justify-center",
                  "bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30",
                  "transition-transform duration-300",
                  dragActive && "scale-110"
                )}>
                  <Cloud className={cn(
                    "h-10 w-10 transition-colors duration-300",
                    dragActive ? "text-sky-600" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Kéo thả file vào đây
                  </p>
                  <p className="text-sm text-muted-foreground">
                    hoặc click để chọn file từ máy tính
                  </p>
                </div>
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 shadow-lg shadow-sky-500/25"
                >
                  <Upload className="h-4 w-4" />
                  Chọn file
                </GlassButton>
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="flex justify-end mt-6">
              <GlassButton
                variant="primary"
                size="lg"
                onClick={handleUpload}
                disabled={uploading}
                className={cn(
                  "gap-2 min-w-[160px]",
                  uploading && "opacity-80",
                  !uploading && "shadow-lg shadow-sky-500/25"
                )}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang upload...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Upload & Process
                  </>
                )}
              </GlassButton>
            </div>
          )}
        </GlassPanel>

        {/* Premium Webhook Response Section */}
        <GlassPanel variant="strong" className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Processing Result
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Kết quả xử lý từ AI webhook
                </p>
              </div>
              {webhookResponse && (
                <GlassBadge variant="success" className="gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Thành công
                </GlassBadge>
              )}
            </div>
          </div>

          {webhookResponse ? (
            <div className={cn(
              "rounded-xl border border-slate-200/60 dark:border-slate-800/60",
              "bg-slate-50/50 dark:bg-slate-900/50",
              "overflow-hidden"
            )}>
              <pre className="p-6 overflow-auto max-h-[400px] text-sm font-mono leading-relaxed">
                {JSON.stringify(webhookResponse, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 rounded-xl bg-slate-50/30 dark:bg-slate-900/30 border border-dashed border-slate-200/60 dark:border-slate-800/60">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/30 dark:to-gray-800/30 mb-4">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground mb-1">Chưa có dữ liệu</p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Upload file để xem kết quả xử lý từ webhook
              </p>
            </div>
          )}
        </GlassPanel>
      </div>
    </>
  )
}