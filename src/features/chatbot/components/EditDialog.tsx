import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, X } from "lucide-react"
import { ChatbotPoint } from "@/types/chatbot"
import { useEffect, useState } from "react"

interface EditDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record: ChatbotPoint | null
    onSave: (data: Partial<ChatbotPoint>) => Promise<boolean>
    loading: boolean
}

export function EditDialog({ open, onOpenChange, record, onSave, loading }: EditDialogProps) {
    const [formData, setFormData] = useState<Partial<ChatbotPoint>>({})

    useEffect(() => {
        if (open) {
            setFormData(record || { status: "Chưa xử lý" })
        }
    }, [open, record])

    const handleSave = async () => {
        const success = await onSave(formData)
        if (success) {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {record ? "Chỉnh sửa Record" : "Tạo Record Mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {record ? "Cập nhật thông tin record" : "Thêm record mới vào hệ thống"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={formData.title || ""}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select
                            value={formData.status || ""}
                            onValueChange={(val) => setFormData({ ...formData, status: val })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Đã chuẩn hóa">Đã chuẩn hóa</SelectItem>
                                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                                <SelectItem value="Chưa xử lý">Chưa xử lý</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                        <Label htmlFor="raw_text">Raw Text</Label>
                        <Textarea
                            id="raw_text"
                            value={formData.raw_text || ""}
                            onChange={(e) => setFormData({ ...formData, raw_text: e.target.value })}
                            rows={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="major_section">Major Section</Label>
                        <Input
                            id="major_section"
                            value={formData.major_section || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, major_section: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="source_table">Source Table</Label>
                        <Input
                            id="source_table"
                            value={formData.source_table || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, source_table: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="container_type">Container Type</Label>
                        <Input
                            id="container_type"
                            value={formData.container_type || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, container_type: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="container_size">Container Size</Label>
                        <Input
                            id="container_size"
                            value={formData.container_size || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, container_size: e.target.value })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.price || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, price: Number(e.target.value) })
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Input
                            id="unit"
                            value={formData.unit || ""}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
