import { Edit2, Trash2, UserCheck, UserX, Users } from "lucide-react"

import { GlassPanel } from "@/components/ui/glass"
import { cn } from "@/lib/utils"

import type { RoleFilter, Staff } from "../types"

interface StaffTableProps {
  staff: Staff[]
  loading: boolean
  searchQuery: string
  filterRole: RoleFilter
  isDepartmentScoped: boolean
  onEdit: (staffMember: Staff) => void
  onDelete: (staffMember: Staff) => void
}

export function StaffTable({
  staff,
  loading,
  searchQuery,
  filterRole,
  isDepartmentScoped,
  onEdit,
  onDelete,
}: StaffTableProps) {
  return (
    <GlassPanel variant="strong" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Night Shift
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Base Quota
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {staff.map((staffMember) => (
              <tr
                key={staffMember.id}
                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900 dark:text-slate-100">
                  #{staffMember.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {staffMember.full_name}
                  </div>
                  {staffMember.notes && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                      {staffMember.notes}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      staffMember.role === "GDV"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    )}
                  >
                    {staffMember.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {staffMember.department_name || (
                    <span className="text-slate-400 dark:text-slate-500 italic">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {staffMember.can_night ? (
                    <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <UserX className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900 dark:text-slate-100">
                  {staffMember.base_quota}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(staffMember)}
                      className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4 text-sky-600" />
                    </button>
                    <button
                      onClick={() => onDelete(staffMember)}
                      className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-rose-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {staff.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground">
                    {loading
                      ? "Loading staff..."
                      : searchQuery || filterRole !== "all" || isDepartmentScoped
                        ? "No staff found matching your filters"
                        : "No staff members yet. Click 'Add Staff' to create your first entry."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}
