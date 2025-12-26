import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
    ChevronDown,
    ChevronUp,
    Edit,
    Eye,
    Loader2,
    Search,
    Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatbotPoint } from "@/types/chatbot"
import { allColumns, ColumnKey } from "../constants"

interface ChatbotTableProps {
    data: ChatbotPoint[]
    loading: boolean
    visibleColumns: Set<ColumnKey>
    sortColumn: ColumnKey | null
    sortDirection: "asc" | "desc" | null
    onSort: (column: ColumnKey) => void
    onView: (record: ChatbotPoint) => void
    onEdit: (record: ChatbotPoint) => void
    onDelete: (record: ChatbotPoint) => void
}

export function ChatbotTable({
    data,
    loading,
    visibleColumns,
    sortColumn,
    sortDirection,
    onSort,
    onView,
    onEdit,
    onDelete,
}: ChatbotTableProps) {
    const visibleColumnsList = allColumns.filter((col) => visibleColumns.has(col.key))

    return (
        <div
            className={cn(
                "rounded-xl border border-slate-200/60 dark:border-slate-800/60",
                "overflow-hidden shadow-ios",
                "bg-white/50 dark:bg-slate-900/50"
            )}
        >
            <div className="overflow-auto max-h-[calc(100vh-520px)]">
                <Table>
                    <TableHeader className="sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b-2 border-slate-200/60 dark:border-slate-800/60 z-10">
                        <TableRow className="hover:bg-transparent">
                            {visibleColumnsList.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={cn(
                                        "cursor-pointer group transition-all duration-200",
                                        "hover:bg-sky-50/50 dark:hover:bg-sky-900/20",
                                        "font-semibold text-foreground",
                                        sortColumn === col.key && "bg-sky-50/80 dark:bg-sky-900/30",
                                        col.width
                                    )}
                                    onClick={() => onSort(col.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                                            {col.label}
                                        </span>
                                        {sortColumn === col.key ? (
                                            <>
                                                {sortDirection === "asc" && (
                                                    <ChevronUp className="h-4 w-4 text-sky-500 animate-in fade-in zoom-in duration-200" />
                                                )}
                                                {sortDirection === "desc" && (
                                                    <ChevronDown className="h-4 w-4 text-sky-500 animate-in fade-in zoom-in duration-200" />
                                                )}
                                            </>
                                        ) : (
                                            <ChevronUp className="h-4 w-4 text-transparent group-hover:text-slate-300 dark:group-hover:text-slate-600 transition-colors" />
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="font-semibold text-foreground text-right pr-6 sticky right-0 bg-white/95 dark:bg-slate-900/95">
                                Thao tác
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={visibleColumnsList.length + 1}
                                    className="text-center h-48"
                                >
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
                                        <p className="text-muted-foreground">Đang tải...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={visibleColumnsList.length + 1}
                                    className="text-center h-48"
                                >
                                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                        <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50">
                                            <Search className="h-10 w-10" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-lg">Không tìm thấy dữ liệu</p>
                                            <p className="text-sm mt-1">
                                                Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={cn(
                                        "group transition-all duration-200",
                                        "hover:bg-sky-50/50 dark:hover:bg-sky-900/20",
                                        "border-b border-slate-200/40 dark:border-slate-800/40"
                                    )}
                                >
                                    {visibleColumnsList.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            className={cn(
                                                "max-w-xs truncate transition-colors",
                                                col.key === "status" &&
                                                row[col.key] === "Đã chuẩn hóa" &&
                                                "text-emerald-600 dark:text-emerald-400 font-medium",
                                                col.key === "status" &&
                                                row[col.key] === "Đang xử lý" &&
                                                "text-amber-600 dark:text-amber-400 font-medium",
                                                col.key === "status" &&
                                                row[col.key] === "Chưa xử lý" &&
                                                "text-slate-600 dark:text-slate-400 font-medium"
                                            )}
                                            title={String(row[col.key] || "")}
                                        >
                                            {col.key === "price" && typeof row[col.key] === "number" ? (
                                                <span className="font-mono font-medium">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(row[col.key] as number)}
                                                </span>
                                            ) : (
                                                String(row[col.key] || "")
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell className="text-right sticky right-0 bg-white/95 dark:bg-slate-900/95">
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onView(row)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onEdit(row)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(row)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
