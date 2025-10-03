import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { RoleFilter } from "../types"

interface StaffFiltersProps {
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  filterRole: RoleFilter
  onFilterRoleChange: (value: RoleFilter) => void
  onCreate: () => void
}

export function StaffFilters({
  searchQuery,
  onSearchQueryChange,
  filterRole,
  onFilterRoleChange,
  onCreate,
}: StaffFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={filterRole} onValueChange={(value) => onFilterRoleChange(value as RoleFilter)}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="GDV">GDV</SelectItem>
          <SelectItem value="TC">TC</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={onCreate}
        className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Staff
      </Button>
    </div>
  )
}
