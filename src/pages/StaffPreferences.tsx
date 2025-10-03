import React, { useState, useEffect } from "react"
import { Settings, UserCog, Calendar, Moon, Sun, Clock } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { GlassPanel } from "@/components/ui/glass"
import { Button } from "@/components/ui/button"
import { useDepartment } from "@/contexts/DepartmentContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Staff {
  id: number
  full_name: string
  role: string
  department_name?: string
}

interface StaffPreferences {
  staff_id: number
  preferred_shifts: string[]  // e.g., ["K", "CA1", "Đ"]
  unavailable_days: string[]  // e.g., ["2025-10-15"]
  max_consecutive_days?: number
  preferred_days_off: number[]  // e.g., [0, 1] for Mon, Tue
  notes?: string
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
]

export default function StaffPreferences() {
  const { selectedDepartmentId } = useDepartment()
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null)
  const [preferences, setPreferences] = useState<StaffPreferences>({
    staff_id: 0,
    preferred_shifts: [],
    unavailable_days: [],
    max_consecutive_days: 6,
    preferred_days_off: [],
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchStaff()
  }, [selectedDepartmentId])

  useEffect(() => {
    if (selectedStaffId) {
      fetchPreferences(selectedStaffId)
    }
  }, [selectedStaffId])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const url = selectedDepartmentId
        ? `http://localhost:8000/api/staff?department_id=${selectedDepartmentId}`
        : "http://localhost:8000/api/staff"
      const res = await fetch(url)
      const data = await res.json()
      setStaff(data)
    } catch (err) {
      console.error("Failed to fetch staff:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPreferences = async (staffId: number) => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:8000/api/staff/${staffId}/preferences`)
      if (res.ok) {
        const data = await res.json()
        setPreferences(data)
      } else {
        // Initialize with defaults if no preferences exist
        setPreferences({
          staff_id: staffId,
          preferred_shifts: [],
          unavailable_days: [],
          max_consecutive_days: 6,
          preferred_days_off: [],
          notes: "",
        })
      }
    } catch (err) {
      console.error("Failed to fetch preferences:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePreferences = async () => {
    if (!selectedStaffId) return

    try {
      setSaving(true)
      const res = await fetch(`http://localhost:8000/api/staff/${selectedStaffId}/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      })

      if (res.ok) {
        // Show success message
        console.log("Preferences saved successfully")
      }
    } catch (err) {
      console.error("Failed to save preferences:", err)
    } finally {
      setSaving(false)
    }
  }

  const addShiftPreference = (shiftCode: string) => {
    if (!preferences.preferred_shifts.includes(shiftCode)) {
      setPreferences({
        ...preferences,
        preferred_shifts: [...preferences.preferred_shifts, shiftCode]
      })
    }
  }

  const removeShiftPreference = (shiftCode: string) => {
    setPreferences({
      ...preferences,
      preferred_shifts: preferences.preferred_shifts.filter(s => s !== shiftCode)
    })
  }

  const toggleDayOffPreference = (dayOfWeek: number) => {
    const exists = preferences.preferred_days_off.includes(dayOfWeek)
    if (exists) {
      setPreferences({
        ...preferences,
        preferred_days_off: preferences.preferred_days_off.filter(d => d !== dayOfWeek)
      })
    } else {
      setPreferences({
        ...preferences,
        preferred_days_off: [...preferences.preferred_days_off, dayOfWeek]
      })
    }
  }

  const selectedStaff = staff.find(s => s.id === selectedStaffId)

  return (
    <div className="space-y-6">
      <PageHeader
        tagline="Work-Life Balance"
        title="Staff Preferences"
        description="Configure scheduling preferences for each staff member"
        icon={Settings}
      />

      <GlassPanel className="p-6">
        <div className="space-y-6">
          {/* Staff Selection */}
          <div className="space-y-2">
            <Label>Select Staff Member</Label>
            <Select
              value={selectedStaffId?.toString() || ""}
              onValueChange={(value) => setSelectedStaffId(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a staff member..." />
              </SelectTrigger>
              <SelectContent>
                {staff.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      <span>{s.full_name}</span>
                      <Badge variant="outline" className="ml-2">
                        {s.role}
                      </Badge>
                      {s.department_name && (
                        <span className="text-xs text-muted-foreground">
                          ({s.department_name})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preferences Configuration */}
          {selectedStaffId && (
            <Tabs defaultValue="shifts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="shifts">
                  <Clock className="h-4 w-4 mr-2" />
                  Shift Preferences
                </TabsTrigger>
                <TabsTrigger value="days-off">
                  <Calendar className="h-4 w-4 mr-2" />
                  Day Off Preferences
                </TabsTrigger>
                <TabsTrigger value="constraints">
                  <Settings className="h-4 w-4 mr-2" />
                  Constraints
                </TabsTrigger>
              </TabsList>

              {/* Shift Preferences Tab */}
              <TabsContent value="shifts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferred Shifts</CardTitle>
                    <CardDescription>
                      Select shift types that {selectedStaff?.full_name} prefers to work
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Day Shifts */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Sun className="h-5 w-5 text-amber-500" />
                        <div>
                          <p className="font-medium">K (Day Shift)</p>
                          <p className="text-sm text-muted-foreground">Regular day shift</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.preferred_shifts.includes("K")}
                        onCheckedChange={(checked) =>
                          checked ? addShiftPreference("K") : removeShiftPreference("K")
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Sun className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium">CA1 (Morning Shift)</p>
                          <p className="text-sm text-muted-foreground">Morning shift</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.preferred_shifts.includes("CA1")}
                        onCheckedChange={(checked) =>
                          checked ? addShiftPreference("CA1") : removeShiftPreference("CA1")
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">CA2 (Afternoon Shift)</p>
                          <p className="text-sm text-muted-foreground">Afternoon shift</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.preferred_shifts.includes("CA2")}
                        onCheckedChange={(checked) =>
                          checked ? addShiftPreference("CA2") : removeShiftPreference("CA2")
                        }
                      />
                    </div>

                    {/* Night Shift */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Moon className="h-5 w-5 text-indigo-500" />
                        <div>
                          <p className="font-medium">Đ (Night Shift)</p>
                          <p className="text-sm text-muted-foreground">Night shift</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.preferred_shifts.includes("Đ")}
                        onCheckedChange={(checked) =>
                          checked ? addShiftPreference("Đ") : removeShiftPreference("Đ")
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Day Off Preferences Tab */}
              <TabsContent value="days-off" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferred Days Off</CardTitle>
                    <CardDescription>
                      Select preferred days off for {selectedStaff?.full_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {DAYS_OF_WEEK.map(day => {
                      const isPreferred = preferences.preferred_days_off.includes(day.value)
                      return (
                        <div key={day.value} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{day.label}</p>
                            </div>
                          </div>
                          <Switch
                            checked={isPreferred}
                            onCheckedChange={() => toggleDayOffPreference(day.value)}
                          />
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Constraints Tab */}
              <TabsContent value="constraints" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduling Constraints</CardTitle>
                    <CardDescription>
                      Set work-life balance constraints for {selectedStaff?.full_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Maximum Consecutive Working Days</Label>
                      <Select
                        value={preferences.max_consecutive_days?.toString() || "6"}
                        onValueChange={(value) =>
                          setPreferences({ ...preferences, max_consecutive_days: Number(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} days
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Maximum number of days staff can work before needing rest
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Save Button */}
          {selectedStaffId && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => fetchPreferences(selectedStaffId)}
                disabled={loading || saving}
              >
                Reset
              </Button>
              <Button
                onClick={handleSavePreferences}
                disabled={loading || saving}
              >
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  )
}
