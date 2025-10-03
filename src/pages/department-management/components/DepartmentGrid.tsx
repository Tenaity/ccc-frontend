import { Edit2, Trash2 } from "lucide-react"

import { GlassPanel } from "@/components/ui/glass"

import type { Department } from "../types"
import { resolveIcon } from "../utils"

interface DepartmentGridProps {
  departments: Department[]
  onEdit: (department: Department) => void
  onDelete: (department: Department) => void
}

export function DepartmentGrid({ departments, onEdit, onDelete }: DepartmentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {departments.map((department) => {
        const Icon = resolveIcon(department.icon)

        return (
          <GlassPanel
            key={department.id}
            variant="strong"
            className="p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${department.color}20, ${department.color}40)` }}
              >
                <Icon className="h-5 w-5" style={{ color: department.color }} />
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => onEdit(department)}
                  className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                >
                  <Edit2 className="h-4 w-4 text-sky-600" />
                </button>
                <button
                  onClick={() => onDelete(department)}
                  className="p-2 rounded-lg bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-rose-600" />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-1">{department.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Code: <span className="font-mono font-semibold">{department.code}</span>
            </p>

            {department.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{department.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Staff</p>
                <p className="text-lg font-bold text-foreground">{department.staff_count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Shifts</p>
                <p className="text-lg font-bold text-foreground">{department.shift_count}</p>
              </div>
            </div>
          </GlassPanel>
        )
      })}
    </div>
  )
}
