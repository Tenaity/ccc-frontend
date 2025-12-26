import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChatbotPoint } from "@/types/chatbot"
import { allColumns } from "../constants"

interface ViewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record: ChatbotPoint | null
}

export function ViewDialog({ open, onOpenChange, record }: ViewDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chi tiết Record</DialogTitle>
                    <DialogDescription>Xem thông tin chi tiết của record</DialogDescription>
                </DialogHeader>
                {record && (
                    <div className="grid grid-cols-2 gap-4">
                        {allColumns.map((col) => (
                            <div key={col.key} className="space-y-1">
                                <Label className="text-xs text-muted-foreground">{col.label}</Label>
                                <p className="text-sm font-medium break-words">
                                    {String(record[col.key] || "-")}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
