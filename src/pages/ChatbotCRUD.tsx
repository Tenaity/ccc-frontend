import React, { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel, GlassButton, GlassBadge } from "@/components/ui/glass"

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
      <GlassPanel variant="strong" className="flex flex-col gap-6 p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-11"
              />
            </div>
          </div>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <GlassButton variant="outline" size="lg">
                <Settings2 className="h-4 w-4" />
                Cột ({visibleColumns.size}/{columns.length})
              </GlassButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns.has(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <GlassButton variant="primary" size="lg">
            <Plus className="h-4 w-4" />
            Thêm thủ công
          </GlassButton>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2">
          <GlassBadge variant="info">
            Hiển thị: {startIndex + 1}-{Math.min(endIndex, filteredData.length)} / {filteredData.length}
          </GlassBadge>
          {sortColumn && (
            <GlassBadge variant="primary">
              Sắp xếp: {sortColumn} ({sortDirection})
            </GlassBadge>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-auto max-h-[calc(100vh-400px)] shadow-ios">
          <Table>
            <TableHeader className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b-2 border-slate-200/60 dark:border-slate-800/60 z-10">
              <TableRow className="hover:bg-transparent">
                {visibleColumnsList.map((col) => (
                  <TableHead
                    key={col.key}
                    className="cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 font-semibold text-foreground transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{col.label}</span>
                      {sortColumn === col.key && (
                        <>
                          {sortDirection === "asc" && <ChevronUp className="h-4 w-4 text-sky-500" />}
                          {sortDirection === "desc" && <ChevronDown className="h-4 w-4 text-sky-500" />}
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
                  <TableCell colSpan={visibleColumnsList.length + 1} className="text-center h-32">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8" />
                      <p>Không tìm thấy dữ liệu</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                    {visibleColumnsList.map((col) => (
                      <TableCell key={col.key} className="max-w-xs truncate">
                        {String(row[col.key])}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-2">
                        <GlassButton variant="outline" size="sm">Edit</GlassButton>
                        <GlassButton variant="destructive" size="sm">Del</GlassButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hiển thị</span>
            <Select
              value={String(pageSize)}
              onValueChange={(val) => {
                setPageSize(Number(val))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-[70px] h-9">
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
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              Đầu
            </GlassButton>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </GlassButton>
            <GlassBadge variant="primary" className="px-4">
              Trang {currentPage} / {totalPages}
            </GlassBadge>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </GlassButton>
            <GlassButton
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Cuối
            </GlassButton>
          </div>
        </div>
      </GlassPanel>
    </>
  )
}