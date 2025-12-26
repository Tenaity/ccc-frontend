import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2 } from "lucide-react"
import { ChatbotPoint } from "@/types/chatbot"

interface DeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record: ChatbotPoint | null
    onDelete: (id: string) => Promise<boolean>
    loading: boolean
}

export function DeleteDialog({ open, onOpenChange, record, onDelete, loading }: DeleteDialogProps) {
    const handleDelete = async () => {
        if (record?.id) {
            const success = await onDelete(record.id)
            if (success) {
                onOpenChange(false)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận xóa</DialogTitle>
                    <DialogDescription>
                        Bạn có chắc chắn muốn xóa record này? Hành động này không thể hoàn tác.
                    </DialogDescription>
                </DialogHeader>
                {record && (
                    <div className="py-4">
                        <p className="text-sm">
                            <span className="font-medium">ID:</span> {record.id}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">Title:</span> {record.title || "-"}
                        </p>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                        )}
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
