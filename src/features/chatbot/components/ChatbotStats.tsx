import { Bot, RefreshCw, Filter, Sparkles } from "lucide-react"
import { GlassPanel } from "@/components/ui/glass"

interface ChatbotStatsProps {
    totalRecords: number
    statusCounts: {
        normalized: number
        processing: number
        unprocessed: number
    }
}

export function ChatbotStats({ totalRecords, statusCounts }: ChatbotStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <GlassPanel variant="strong" className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Tổng Records</p>
                        <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                            {totalRecords}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
                        <Bot className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                </div>
            </GlassPanel>

            <GlassPanel variant="strong" className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Đã chuẩn hóa</p>
                        <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {statusCounts.normalized}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                        <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>
            </GlassPanel>

            <GlassPanel variant="strong" className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Đang xử lý</p>
                        <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            {statusCounts.processing}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                        <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                </div>
            </GlassPanel>

            <GlassPanel variant="strong" className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Chưa xử lý</p>
                        <p className="text-2xl font-bold mt-1 bg-gradient-to-br from-slate-600 to-gray-600 bg-clip-text text-transparent">
                            {statusCounts.unprocessed}
                        </p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/30 dark:to-gray-800/30">
                        <Filter className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                </div>
            </GlassPanel>
        </div>
    )
}
