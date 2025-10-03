import { Building2, Settings2, Users } from "lucide-react"

import { GlassPanel } from "@/components/ui/glass"

interface DepartmentStatsProps {
  totalDepartments: number
  totalStaff: number
  totalShifts: number
}

export function DepartmentStats({ totalDepartments, totalStaff, totalShifts }: DepartmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <GlassPanel variant="strong" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Departments</p>
            <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              {totalDepartments}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-900/30 dark:to-indigo-900/30">
            <Building2 className="h-6 w-6 text-sky-600 dark:text-sky-400" />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel variant="strong" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
            <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {totalStaff}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
            <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel variant="strong" className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Custom Shifts</p>
            <p className="text-3xl font-bold mt-1 bg-gradient-to-br from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {totalShifts}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
            <Settings2 className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
