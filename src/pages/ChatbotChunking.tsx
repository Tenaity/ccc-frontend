import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Scissors } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const CHUNKING_WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_CHUNKING_URL || 'https://iconic-host.lapage.vn/webhook/chunking'

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
      const response = await fetch('/api/chatbot/chunking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: selectedRecord.uuid,
          file_name: selectedRecord.file_name,
          content: selectedRecord.content
        })
      })

      const data = await response.json()

      if (response.ok) {
        setChunkResponse(data)
        toast({
          title: "Chunking thành công",
          description: `File ${selectedRecord.file_name} đã được xử lý`
        })
      } else {
        throw new Error(data.error || 'Chunking failed')
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
    <div className="space-y-6 p-4">
      {/* Table Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Chunking - Text Extraction</CardTitle>
              <CardDescription>
                Danh sách file đã được xử lý và trích xuất nội dung text
              </CardDescription>
            </div>
            <Button
              onClick={handleChunk}
              disabled={!selectedRecord || chunking}
              size="sm"
            >
              <Scissors className="mr-2 h-4 w-4" />
              {chunking ? "Đang xử lý..." : "Chunk"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-bold">UUID</TableHead>
                  <TableHead className="font-bold">File Name</TableHead>
                  <TableHead className="font-bold">Content Preview</TableHead>
                  <TableHead className="font-bold w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockChunks.map((record) => (
                  <TableRow
                    key={record.uuid}
                    className={`cursor-pointer ${
                      selectedRecord?.uuid === record.uuid ? "bg-muted/50" : ""
                    }`}
                    onClick={() => handleRowClick(record)}
                  >
                    <TableCell className="font-mono text-xs">{record.uuid}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {record.file_name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate text-muted-foreground">
                      {record.content.substring(0, 100)}...
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(record)
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Tổng số: {mockChunks.length} bản ghi
          </div>
        </CardContent>
      </Card>

      {/* Content Display Section */}
      <Card>
        <CardHeader>
          <CardTitle>Content Detail</CardTitle>
          <CardDescription>
            Nội dung chi tiết đã được trích xuất từ file
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedRecord ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">UUID</p>
                  <p className="font-mono text-sm">{selectedRecord.uuid}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">File Name</p>
                  <p className="text-sm font-medium">{selectedRecord.file_name}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">Content</p>
                <ScrollArea className="h-[300px] rounded-lg border bg-muted/30 p-4">
                  <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                    {selectedRecord.content}
                  </pre>
                </ScrollArea>
              </div>

              {chunkResponse && (
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Chunk Response</p>
                  <ScrollArea className="h-[200px] rounded-lg border bg-muted/30 p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(chunkResponse, null, 2)}
                    </pre>
                  </ScrollArea>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-[400px] items-center justify-center rounded-lg border bg-muted/30">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">
                  Chọn một bản ghi từ bảng bên trên để xem nội dung chi tiết
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}