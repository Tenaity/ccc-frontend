import { Users } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { GlassPanel } from "@/components/ui/glass"

import { StaffDialog } from "./components/StaffDialog"
import { StaffFilters } from "./components/StaffFilters"
import { StaffStats } from "./components/StaffStats"
import { StaffTable } from "./components/StaffTable"
import { useStaffManagement } from "./useStaffManagement"

export default function StaffManagementPage() {
  const {
    departments,
    dialogOpen,
    editingStaff,
    filterRole,
    filteredStaff,
    formData,
    loading,
    isDepartmentScoped,
    searchQuery,
    setFilterRole,
    setFormData,
    setSearchQuery,
    stats,
    closeDialog,
    openCreateDialog,
    openEditDialog,
    saveStaff,
    deleteStaff,
  } = useStaffManagement()

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        tagline="Human Resources"
        title="Staff Management"
        description="Manage staff members, their roles, quotas, and department assignments"
      />

      <StaffStats
        totalStaff={stats.totalStaff}
        canNightCount={stats.canNightCount}
        averageQuota={stats.averageQuota}
      />

      <GlassPanel variant="strong" className="p-4">
        <StaffFilters
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          filterRole={filterRole}
          onFilterRoleChange={setFilterRole}
          onCreate={openCreateDialog}
        />
      </GlassPanel>

      <StaffTable
        staff={filteredStaff}
        loading={loading}
        searchQuery={searchQuery}
        filterRole={filterRole}
        isDepartmentScoped={isDepartmentScoped}
        onEdit={openEditDialog}
        onDelete={deleteStaff}
      />

      <StaffDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog()
          }
        }}
        mode={editingStaff ? "edit" : "create"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={saveStaff}
        departments={departments}
      />
    </div>
  )
}
