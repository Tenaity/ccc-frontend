import { Plus, Building2 } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"

import { COLOR_PALETTE, ICON_OPTIONS } from "./constants"
import { DepartmentDialog } from "./components/DepartmentDialog"
import { DepartmentGrid } from "./components/DepartmentGrid"
import { DepartmentStats } from "./components/DepartmentStats"
import { useDepartmentManagement } from "./useDepartmentManagement"

export default function DepartmentManagementPage() {
  const {
    departments,
    dialogOpen,
    editingDepartment,
    formData,
    setFormData,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    saveDepartment,
    deleteDepartment,
    stats,
  } = useDepartmentManagement()

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        tagline="Organization Structure"
        title="Department Management"
        description="Manage departments, shifts, and staff across your organization"
      />

      <DepartmentStats
        totalDepartments={stats.totalDepartments}
        totalStaff={stats.totalStaff}
        totalShifts={stats.totalShifts}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
          Departments
        </h2>
        <Button
          onClick={openCreateDialog}
          className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      <DepartmentGrid departments={departments} onEdit={openEditDialog} onDelete={deleteDepartment} />

      <DepartmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog()
          }
        }}
        mode={editingDepartment ? "edit" : "create"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={saveDepartment}
        iconOptions={ICON_OPTIONS}
        colorPalette={COLOR_PALETTE}
      />
    </div>
  )
}
