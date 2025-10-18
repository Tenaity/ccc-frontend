import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Scissors, Play, CheckCircle2, Clock, Sparkles, Database, Eye } from "lucide-react"
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

const CHUNKING_WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_CHUNKING_URL || 'https://n8n-prod.iconiclogs.com/webhook/chatbot-chunking'

interface ChunkRecord {
  uuid: string
  file_name: string
  content: string
}

// Mock data - 3 records
const mockChunks: ChunkRecord[] = [
  {
    uuid: "550e8400-e29b-41d4-a716-446655440001",
    file_name: "cuc_hang_hai_quy_dinh_2024.pdf",
    content: `ĐIỀU 1. Phạm vi điều chỉnh và đối tượng áp dụng

1. Văn bản này quy định về mức thu phí và lệ phí hàng hải áp dụng tại các cảng biển Việt Nam.

2. Đối tượng áp dụng bao gồm:
- Chủ tàu, người khai thác tàu biển
- Đại lý tàu biển
- Các doanh nghiệp kinh doanh dịch vụ cảng biển
- Chủ hàng, người nhận hàng
- Các tổ chức, cá nhân có liên quan đến hoạt động hàng hải

ĐIỀU 2. Giải thích từ ngữ

Trong Thông tư này, các từ ngữ dưới đây được hiểu như sau:

1. Phí hàng hải là khoản tiền mà chủ tàu, người khai thác tàu biển phải nộp cho việc sử dụng luồng hàng hải, vùng nước, kết cấu hạ tầng hàng hải do Nhà nước đầu tư.

2. Lệ phí hàng hải là khoản tiền mà tổ chức, cá nhân phải nộp khi được cơ quan có thẩm quyền cấp giấy phép, chứng chỉ trong lĩnh vực hàng hải.`
  },
  {
    uuid: "550e8400-e29b-41d4-a716-446655440002",
    file_name: "bang_gia_container_2024.xlsx",
    content: `BẢNG GIÁ DỊCH VỤ CONTAINER NĂM 2024

I. GIÁ DỊCH VỤ XẾP DỠ CONTAINER

1. Container 20 feet:
- Khô (Dry): 450.000 VNĐ/cont
- Lạnh (Reefer): 650.000 VNĐ/cont

2. Container 40 feet:
- Khô (Dry): 750.000 VNĐ/cont
- Lạnh (Reefer): 950.000 VNĐ/cont

3. Container 45 feet:
- Khô (Dry): 850.000 VNĐ/cont
- Lạnh (Reefer): 1.050.000 VNĐ/cont

II. GIÁ DỊCH VỤ LƯU BÃI

1. Miễn phí: 5 ngày đầu tiên
2. Từ ngày thứ 6-10: 50.000 VNĐ/cont/ngày
3. Từ ngày thứ 11-15: 100.000 VNĐ/cont/ngày
4. Từ ngày thứ 16 trở đi: 150.000 VNĐ/cont/ngày

III. PHỤ PHÍ ĐẶC BIỆT

1. Hàng nguy hiểm: +30% phí cơ bản
2. Hàng quá khổ: +50% phí cơ bản
3. Làm việc ngoài giờ (22h-6h): +100% phí cơ bản
4. Làm việc ngày lễ, Tết: +150% phí cơ bản`
  },
  {
    uuid: "550e8400-e29b-41d4-a716-446655440003",
    file_name: "huong_dan_thanh_toan.docx",
    content: `HƯỚNG DẪN THANH TOÁN PHÍ DỊCH VỤ CẢNG BIỂN

A. THÔNG TIN CHUNG

Để đảm bảo việc thanh toán nhanh chóng và chính xác, quý khách hàng vui lòng thực hiện theo hướng dẫn sau:

B. HÌNH THỨC THANH TOÁN

1. Chuyển khoản ngân hàng:
- Tên tài khoản: Công ty Cổ phần Cảng biển ABC
- Số tài khoản: 1234567890
- Ngân hàng: Vietcombank - Chi nhánh Hà Nội
- Nội dung: Mã đơn hàng + Tên công ty

2. Thanh toán bằng tiền mặt:
- Tại quầy thu ngân trong giờ hành chính (8h-17h)
- Địa chỉ: Tầng 1, Tòa nhà Cảng, Số 123 Đường Hải Phòng

3. Thanh toán qua cổng thanh toán điện tử:
- Truy cập website: https://payment.abcport.vn
- Đăng nhập bằng tài khoản đã đăng ký
- Chọn hóa đơn cần thanh toán

C. THỜI HẠN THANH TOÁN

1. Đối với khách hàng mới: Thanh toán trước khi nhận hàng
2. Đối với khách hàng thường xuyên: Thanh toán trong vòng 15 ngày kể từ ngày xuất hóa đơn
3. Quá thời hạn thanh toán: Áp dụng phí chậm thanh toán 0.05%/ngày

D. LIÊN HỆ HỖ TRỢ

- Hotline: 1900-xxxx
- Email: support@abcport.vn
- Thời gian hỗ trợ: 24/7`
  }
]

export default function ChatbotChunking() {
  const [selectedRecord, setSelectedRecord] = useState<ChunkRecord | null>(null)
  const [chunking, setChunking] = useState(false)
  const [chunkResponse, setChunkResponse] = useState<any>(null)
  const { toast } = useToast()

  const handleRowClick = (record: ChunkRecord) => {
    setSelectedRecord(record)
  }

  const handleChunk = async () => {
    if (!selectedRecord) {
      toast({
        variant: "destructive",
        title: "Chưa chọn bản ghi",
        description: "Vui lòng chọn một bản ghi để thực hiện chunk"
      })
      return
    }

    setChunking(true)
    try {
      // Call n8n webhook directly (no backend needed)
      const formData = new FormData()
      formData.append('uuid', selectedRecord.uuid)
      formData.append('file_name', selectedRecord.file_name)
      formData.append('content', selectedRecord.content)

      console.log('Chunking:', {
        uuid: selectedRecord.uuid,
        file_name: selectedRecord.file_name,
        content_length: selectedRecord.content.length
      })

      const response = await fetch(CHUNKING_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response:', data)

      if (response.ok) {
        setChunkResponse(data)
        toast({
          title: "Chunking thành công",
          description: `File ${selectedRecord.file_name} đã được xử lý`
        })
      } else {
        throw new Error(`Chunking failed with status ${response.status}: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      console.error('Chunking error:', error)
      toast({
        variant: "destructive",
        title: "Chunking thất bại",
        description: error instanceof Error ? error.message : "Không thể thực hiện chunking"
      })
    } finally {
      setChunking(false)
    }
  }

  return (
    <>
      <PageHeader
        icon={Scissors}
        tagline="AI Text Processing"
        title="Content Chunking & Analysis"
        description="Quản lý và phân tích nội dung text được trích xuất từ các file đã upload"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tổng Files</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                {mockChunks.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
              <Database className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đã xử lý</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {chunkResponse ? 1 : 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </GlassPanel>

        <GlassPanel variant="strong" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đang chờ</p>
              <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {chunkResponse ? mockChunks.length - 1 : mockChunks.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </GlassPanel>
      </div>

      <div className="space-y-6">
        {/* Enhanced Table Section */}
        <GlassPanel variant="strong" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Text Extraction
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Danh sách file đã được xử lý và trích xuất nội dung
              </p>
            </div>
            <GlassButton
              variant="primary"
              onClick={handleChunk}
              disabled={!selectedRecord || chunking}
              className={cn(
                "gap-2",
                chunking && "opacity-80",
                !chunking && !selectedRecord && "opacity-50",
                !chunking && selectedRecord && "shadow-lg shadow-sky-500/25"
              )}
            >
              {chunking ? (
                <>
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Process Chunk
                </>
              )}
            </GlassButton>
          </div>

          <div className={cn(
            "rounded-xl border border-slate-200/60 dark:border-slate-800/60",
            "overflow-hidden shadow-ios",
            "bg-white/50 dark:bg-slate-900/50"
          )}>
            <Table>
              <TableHeader className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b-2 border-slate-200/60 dark:border-slate-800/60">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-foreground">UUID</TableHead>
                  <TableHead className="font-semibold text-foreground">File Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Content Preview</TableHead>
                  <TableHead className="font-semibold text-foreground text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockChunks.map((record) => (
                  <TableRow
                    key={record.uuid}
                    className={cn(
                      "cursor-pointer transition-all duration-200",
                      "hover:bg-sky-50/50 dark:hover:bg-sky-900/20",
                      "border-b border-slate-200/40 dark:border-slate-800/40",
                      selectedRecord?.uuid === record.uuid && "bg-sky-50/80 dark:bg-sky-900/30"
                    )}
                    onClick={() => handleRowClick(record)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {record.uuid.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
                          <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        {record.file_name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {record.content.substring(0, 80)}...
                    </TableCell>
                    <TableCell className="text-right">
                      <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(record)
                        }}
                        className="gap-1.5 hover:border-sky-400/50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Xem
                      </GlassButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <GlassBadge variant="info" className="gap-1.5">
              <Database className="h-3 w-3" />
              <span className="text-xs">Tổng số:</span>
              <span className="font-semibold">{mockChunks.length}</span>
              <span className="text-xs">bản ghi</span>
            </GlassBadge>
            {selectedRecord && (
              <GlassBadge variant="primary" className="gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                <span className="text-xs">Đã chọn:</span>
                <span className="font-semibold max-w-[150px] truncate">{selectedRecord.file_name}</span>
              </GlassBadge>
            )}
          </div>
        </GlassPanel>

        {/* Enhanced Content Display Section */}
        <GlassPanel variant="strong" className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Content Detail
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Nội dung chi tiết đã được trích xuất từ file
            </p>
          </div>

          {selectedRecord ? (
            <div className="space-y-6">
              {/* File Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn(
                  "p-4 rounded-xl",
                  "bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20",
                  "border border-sky-200/60 dark:border-sky-800/60"
                )}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">UUID</p>
                  <p className="font-mono text-sm text-foreground break-all">{selectedRecord.uuid}</p>
                </div>
                <div className={cn(
                  "p-4 rounded-xl",
                  "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
                  "border border-emerald-200/60 dark:border-emerald-800/60"
                )}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">File Name</p>
                  <p className="text-sm font-medium text-foreground truncate">{selectedRecord.file_name}</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <p className="text-sm font-semibold text-foreground">Extracted Content</p>
                </div>
                <div className={cn(
                  "rounded-xl border border-slate-200/60 dark:border-slate-800/60",
                  "bg-slate-50/50 dark:bg-slate-900/50",
                  "overflow-hidden"
                )}>
                  <ScrollArea className="h-[320px]">
                    <pre className="p-6 whitespace-pre-wrap text-sm font-sans leading-relaxed text-foreground">
                      {selectedRecord.content}
                    </pre>
                  </ScrollArea>
                </div>
              </div>

              {/* Chunk Response */}
              {chunkResponse && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm font-semibold text-foreground">Processing Response</p>
                    <GlassBadge variant="success" className="ml-auto gap-1.5">
                      <CheckCircle2 className="h-3 w-3" />
                      Success
                    </GlassBadge>
                  </div>
                  <div className={cn(
                    "rounded-xl border border-emerald-200/60 dark:border-emerald-800/60",
                    "bg-emerald-50/50 dark:bg-emerald-900/20",
                    "overflow-hidden"
                  )}>
                    <ScrollArea className="h-[240px]">
                      <pre className="p-6 whitespace-pre-wrap text-sm font-mono leading-relaxed text-foreground">
                        {JSON.stringify(chunkResponse, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 rounded-xl bg-slate-50/30 dark:bg-slate-900/30 border border-dashed border-slate-200/60 dark:border-slate-800/60">
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/30 dark:to-gray-800/30 mb-4">
                <FileText className="h-14 w-14 text-muted-foreground/50" />
              </div>
              <p className="font-semibold text-lg text-foreground mb-2">Chưa chọn file nào</p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Chọn một bản ghi từ bảng bên trên để xem nội dung chi tiết
              </p>
            </div>
          )}
        </GlassPanel>
      </div>
    </>
  )
}