import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ChevronUp,
    Download,
    Eye,
    EyeOff,
    Filter,
    Plus,
    RefreshCw,
    Search,
    Settings2,
} from "lucide-react"
import { GlassBadge, GlassButton } from "@/components/ui/glass"
import { cn } from "@/lib/utils"
import { allColumns, ColumnKey, defaultVisibleColumns, statusOptions } from "../constants"

interface ChatbotToolbarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    statusFilter: string
    onStatusFilterChange: (value: string) => void
    visibleColumns: Set<ColumnKey>
    onToggleColumn: (column: ColumnKey) => void
    onSetVisibleColumns: (columns: Set<ColumnKey>) => void
    onExport: () => void
    onRefresh: () => void
    onAdd: () => void
    loading: boolean
    currentPage: number
    totalPages: number
    totalRecords: number
    pageSize: number
    onPageSizeChange: (size: number) => void
    onPageChange: (page: number) => void
    sortColumn: ColumnKey | null
    sortDirection: "asc" | "desc" | null
}

export function ChatbotToolbar({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    visibleColumns,
    onToggleColumn,
    onSetVisibleColumns,
    onExport,
    onRefresh,
    onAdd,
    loading,
    currentPage,
    totalPages,
    totalRecords,
    pageSize,
    onPageSizeChange,
    onPageChange,
    sortColumn,
    sortDirection,
}: ChatbotToolbarProps) {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                    <div className="relative group">
                        <Search
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors duration-200",
                                "text-muted-foreground group-hover:text-sky-500"
                            )}
                        />
                        <Input
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className={cn(
                                "pl-11 h-12 rounded-xl",
                                "bg-white/80 dark:bg-slate-900/80",
                                "border-slate-200/60 dark:border-slate-800/60",
                                "focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/20"
                            )}
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                    <SelectTrigger
                        className={cn(
                            "w-[180px] h-12 rounded-xl",
                            "bg-white/80 dark:bg-slate-900/80"
                        )}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Lọc theo trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Column Visibility */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <GlassButton variant="outline" size="lg" className="gap-2">
                            <Settings2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Cột hiển thị</span>
                            <GlassBadge variant="info" className="ml-1">
                                {visibleColumns.size}/{allColumns.length}
                            </GlassBadge>
                        </GlassButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[240px] max-h-[400px] overflow-y-auto">
                        <DropdownMenuLabel>Chọn cột hiển thị</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => onSetVisibleColumns(new Set(allColumns.map((c) => c.key)))}
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Hiện tất cả
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => onSetVisibleColumns(new Set(defaultVisibleColumns))}
                        >
                            <EyeOff className="h-4 w-4 mr-2" />
                            Mặc định
                        </Button>
                        <DropdownMenuSeparator />
                        {allColumns.map((col) => (
                            <DropdownMenuCheckboxItem
                                key={col.key}
                                checked={visibleColumns.has(col.key)}
                                onCheckedChange={() => onToggleColumn(col.key)}
                            >
                                {col.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <GlassButton
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={onExport}
                >
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                </GlassButton>

                <GlassButton
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={onRefresh}
                    disabled={loading}
                >
                    <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
                    <span className="hidden sm:inline">Làm mới</span>
                </GlassButton>

                <GlassButton
                    variant="primary"
                    size="lg"
                    className="gap-2 shadow-lg shadow-sky-500/25"
                    onClick={onAdd}
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Thêm mới</span>
                </GlassButton>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center gap-3 pb-2">
                <GlassBadge variant="info" className="gap-1.5">
                    <span className="text-xs">Trang:</span>
                    <span className="font-semibold">
                        {currentPage}/{totalPages}
                    </span>
                </GlassBadge>
                <GlassBadge variant="info" className="gap-1.5">
                    <span className="text-xs">Tổng:</span>
                    <span className="font-semibold">{totalRecords}</span>
                </GlassBadge>
                {sortColumn && (
                    <GlassBadge variant="primary" className="gap-1.5">
                        <ChevronUp
                            className={cn(
                                "h-3 w-3 transition-transform duration-200",
                                sortDirection === "desc" && "rotate-180"
                            )}
                        />
                        <span className="text-xs">Sắp xếp:</span>
                        <span className="font-semibold">
                            {allColumns.find((c) => c.key === sortColumn)?.label}
                        </span>
                    </GlassBadge>
                )}
                {searchTerm && (
                    <GlassBadge variant="success" className="gap-1.5">
                        <Search className="h-3 w-3" />
                        <span className="text-xs">Tìm:</span>
                        <span className="font-semibold max-w-[120px] truncate">{searchTerm}</span>
                    </GlassBadge>
                )}
                {statusFilter && statusFilter !== "all" && (
                    <GlassBadge variant="warning" className="gap-1.5">
                        <Filter className="h-3 w-3" />
                        <span className="text-xs">Lọc:</span>
                        <span className="font-semibold">{statusFilter}</span>
                    </GlassBadge>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Hiển thị</span>
                    <Select
                        value={String(pageSize)}
                        onValueChange={(val) => {
                            onPageSizeChange(Number(val))
                        }}
                    >
                        <SelectTrigger
                            className={cn(
                                "w-[80px] h-10 rounded-lg",
                                "bg-white/80 dark:bg-slate-900/80"
                            )}
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm font-medium text-muted-foreground">/ trang</span>
                </div>

                <div className="flex items-center gap-2">
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1 || loading}
                    >
                        Đầu
                    </GlassButton>
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1 || loading}
                    >
                        Trước
                    </GlassButton>
                    <GlassBadge variant="primary" className="px-5 py-2 font-semibold">
                        {currentPage} / {totalPages}
                    </GlassBadge>
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages || loading}
                    >
                        Sau
                    </GlassButton>
                    <GlassButton
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages || loading}
                    >
                        Cuối
                    </GlassButton>
                </div>
            </div>
        </div>
    )
}
