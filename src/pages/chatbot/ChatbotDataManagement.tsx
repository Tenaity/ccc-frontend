import React, { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel } from "@/components/ui/glass"
import { Bot } from "lucide-react"
import { useChatbotData } from "@/features/chatbot/hooks/useChatbotData"
import { ChatbotStats } from "@/features/chatbot/components/ChatbotStats"
import { ChatbotToolbar } from "@/features/chatbot/components/ChatbotToolbar"
import { ChatbotTable } from "@/features/chatbot/components/ChatbotTable"
import { EditDialog } from "@/features/chatbot/components/EditDialog"
import { DeleteDialog } from "@/features/chatbot/components/DeleteDialog"
import { ViewDialog } from "@/features/chatbot/components/ViewDialog"
import { ChatbotPoint } from "@/types/chatbot"
import { allColumns } from "@/features/chatbot/constants"

export default function ChatbotDataManagement() {
  const {
    data,
    loading,
    totalRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortColumn,
    sortDirection,
    handleSort,
    visibleColumns,
    setVisibleColumns,
    toggleColumn,
    statusCounts,
    fetchData,
    handleSave,
    handleDelete,
  } = useChatbotData()

  // Dialog States
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ChatbotPoint | null>(null)

  const handleOpenEdit = (record?: ChatbotPoint) => {
    setCurrentRecord(record || null)
    setEditDialogOpen(true)
  }

  const handleOpenDelete = (record: ChatbotPoint) => {
    setCurrentRecord(record)
    setDeleteDialogOpen(true)
  }

  const handleOpenView = (record: ChatbotPoint) => {
    setCurrentRecord(record)
    setViewDialogOpen(true)
  }

  const handleExport = () => {
    // Basic export logic from original file
    const visibleCols = allColumns.filter((c) => visibleColumns.has(c.key))
    const csv = [
      visibleCols.map((c) => c.label).join(","),
      ...data.map((row) =>
        visibleCols
          .map((col) => {
            const value = row[col.key]
            if (Array.isArray(value)) return `"${value.join("; ")}"`
            return `"${value || ""}"`
          })
          .join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chatbot-data-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <>
      <PageHeader
        icon={Bot}
        tagline="AI-Powered Data Management"
        title="Chatbot Data Management"
        description="Quản lý và tối ưu hóa dữ liệu chatbot với đầy đủ tính năng CRUD"
      />

      <ChatbotStats
        totalRecords={totalRecords}
        statusCounts={statusCounts}
      />

      <GlassPanel variant="strong" className="flex flex-col">
        <ChatbotToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          visibleColumns={visibleColumns}
          onToggleColumn={toggleColumn}
          onSetVisibleColumns={setVisibleColumns}
          onExport={handleExport}
          onRefresh={fetchData}
          onAdd={() => handleOpenEdit()}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          onPageChange={setCurrentPage}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />

        <div className="px-6 pb-6">
          <ChatbotTable
            data={data}
            loading={loading}
            visibleColumns={visibleColumns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={handleOpenView}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        </div>
      </GlassPanel>

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        record={currentRecord}
        onSave={handleSave}
        loading={loading}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        record={currentRecord}
        onDelete={handleDelete}
        loading={loading}
      />

      <ViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        record={currentRecord}
      />
    </>
  )
}
