import * as React from "react"
import { Check, ChevronsUpDown, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDepartment } from "@/contexts/DepartmentContext"
import * as Icons from "lucide-react"

export function DepartmentSwitcher() {
  const { selectedDepartmentId, setSelectedDepartmentId, departments, isLoading, selectedDepartment } = useDepartment()
  const [open, setOpen] = React.useState(false)

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Building2
    return IconComponent
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select department"
          className={cn(
            "w-[250px] justify-between",
            "bg-white/80 dark:bg-slate-900/80",
            "backdrop-blur-xl",
            "border-slate-200/60 dark:border-slate-700/60",
            "hover:bg-white/95 dark:hover:bg-slate-900/95",
            "transition-all duration-200"
          )}
        >
          {selectedDepartment ? (
            <div className="flex items-center gap-2 truncate">
              <div
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                style={{ backgroundColor: selectedDepartment.color }}
              >
                {React.createElement(getIconComponent(selectedDepartment.icon), {
                  className: "h-3 w-3 text-white",
                })}
              </div>
              <span className="truncate font-medium">{selectedDepartment.name}</span>
              <span className="text-xs text-muted-foreground">({selectedDepartment.code})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>All Departments</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search department..." />
          <CommandList>
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandGroup>
              {/* All Departments option */}
              <CommandItem
                value="all-departments"
                onSelect={() => {
                  setSelectedDepartmentId(null)
                  setOpen(false)
                }}
                className="cursor-pointer"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-200 dark:bg-slate-700">
                    <Building2 className="h-3 w-3 text-slate-600 dark:text-slate-300" />
                  </div>
                  <span>All Departments</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    selectedDepartmentId === null ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>

              {/* Individual departments */}
              {departments.map((dept) => {
                const IconComponent = getIconComponent(dept.icon)
                return (
                  <CommandItem
                    key={dept.id}
                    value={`${dept.name} ${dept.code}`}
                    onSelect={() => {
                      setSelectedDepartmentId(dept.id)
                      setOpen(false)
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                        style={{ backgroundColor: dept.color }}
                      >
                        <IconComponent className="h-3 w-3 text-white" />
                      </div>
                      <span className="truncate">{dept.name}</span>
                      <span className="text-xs text-muted-foreground">({dept.code})</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedDepartmentId === dept.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
