import React, { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, X, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

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

      const response = await fetch('/api/chatbot/upload', {
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

  return (
    <div className="space-y-6 p-4">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>
            Upload file PDF, DOCX, Excel, hoặc CSV để xử lý qua webhook
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and drop zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
            }`}
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
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Kéo thả file vào đây hoặc
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn file
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
            >
              {uploading ? "Đang upload..." : "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Response Section */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Response</CardTitle>
          <CardDescription>
            Kết quả trả về từ webhook sau khi upload
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhookResponse ? (
            <pre className="rounded-lg bg-muted p-4 overflow-auto text-sm">
              {JSON.stringify(webhookResponse, null, 2)}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Chưa có dữ liệu response. Upload file để xem kết quả.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}