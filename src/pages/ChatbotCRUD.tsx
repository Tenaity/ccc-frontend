import React, { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, ChevronUp, Settings2, Search, Plus, Bot } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/PageHeader"

interface ChatbotPoint {
  id: string
  raw_text: string
  major_section: string
  full_section_id: string
  source_table: string
  title: string
  containerType: string
  containerSize: string
  price: number
  status: string
}

// Simplified mock data
const mockData: ChatbotPoint[] = Array.from({ length: 50 }, (_, i) => ({
  id: `id-${i}`,
  raw_text: `Dữ liệu thứ ${i + 1}`,
  major_section: i % 2 === 0 ? "Section II" : "Section III",
  full_section_id: `II.1.${i}`,
  source_table: `Bảng ${(i % 5) + 1}`,
  title: `Title ${i + 1}`,
  containerType: i % 2 === 0 ? "Khô" : "Lạnh",
  containerSize: ["20ft", "40ft", "45ft"][i % 3],
  price: 400000 + i * 10000,
  status: ["Đã chuẩn hóa", "Đang xử lý", "Chưa xử lý"][i % 3],
}))

type ColumnKey = keyof ChatbotPoint

const columns: Array<{ key: ColumnKey; label: string }> = [
  { key: "id", label: "ID" },
  { key: "raw_text", label: "Raw Text" },
  { key: "major_section", label: "Major Section" },
  { key: "source_table", label: "Source Table" },
  { key: "title", label: "Title" },
  { key: "containerType", label: "Container Type" },
  { key: "containerSize", label: "Container Size" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
]

export default function ChatbotCRUD() {
  const [data] = useState<ChatbotPoint[]>(mockData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(
    new Set(columns.map((col) => col.key))
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const handleSort = (column: ColumnKey) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const toggleColumn = (column: ColumnKey) => {
    const newVisible = new Set(visibleColumns)
    if (newVisible.has(column)) {
      newVisible.delete(column)
    } else {
      newVisible.add(column)
    }
    setVisibleColumns(newVisible)
  }

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchTerm) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    if (sortColumn && sortDirection) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        if (aVal === bVal) return 0
        const comparison = aVal > bVal ? 1 : -1
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return filtered
  }, [data, searchTerm, sortColumn, sortDirection])

  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = filteredData.slice(startIndex, endIndex)

  const visibleColumnsList = columns.filter((col) => visibleColumns.has(col.key))

  return (
    <>
      <PageHeader
        icon={Bot}
        tagline="CRUD Chatbot"
        title="CRUD Chatbot"
        description="Quản lý dữ liệu chatbot Point_v3"
      />
      <Card>
        <CardContent className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Column Visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Cột ({visibleColumns.size}/{columns.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-white dark:bg-gray-900">
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns.has(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="pl-8"
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Thêm thủ công
            </Button>
          </div>

          {/* Stats */}
          <div className="text-sm text-muted-foreground">
            Hiển thị: {startIndex + 1}-{Math.min(endIndex, filteredData.length)} / {filteredData.length} bản ghi
            {sortColumn && ` • Sắp xếp: ${sortColumn} (${sortDirection})`}
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-auto max-h-[600px]">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm border-b-2 border-border">
                <TableRow className="hover:bg-transparent">
                  {visibleColumnsList.map((col) => (
                    <TableHead
                      key={col.key}
                      className="cursor-pointer hover:bg-muted/80 font-semibold text-foreground"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {sortColumn === col.key && (
                          <>
                            {sortDirection === "asc" && <ChevronUp className="h-4 w-4" />}
                            {sortDirection === "desc" && <ChevronDown className="h-4 w-4" />}
                          </>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="font-semibold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumnsList.length + 1} className="text-center">
                      Không tìm thấy dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow key={row.id}>
                      {visibleColumnsList.map((col) => (
                        <TableCell key={col.key} className="max-w-xs truncate">
                          {String(row[col.key])}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="destructive" size="sm">Del</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị</span>
              <Select
                value={String(pageSize)}
                onValueChange={(val) => {
                  setPageSize(Number(val))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">/ trang</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                Đầu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Trước
              </Button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Sau
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                Cuối
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}