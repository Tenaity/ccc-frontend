import { Calendar, Clock, Settings } from "lucide-react"

import { PageHeader } from "@/components/PageHeader"
import { GlassPanel } from "@/components/ui/glass"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useStaffPreferences } from "./useStaffPreferences"
import { ConstraintsSection } from "./components/ConstraintsSection"
import { DayOffPreferencesSection } from "./components/DayOffPreferencesSection"
import { ShiftPreferencesSection } from "./components/ShiftPreferencesSection"
import { StaffSelector } from "./components/StaffSelector"

export default function StaffPreferencesPage() {
  const {
    staff,
    loading,
    saving,
    selectedStaff,
    selectedStaffId,
    preferences,
    handleSelectStaff,
    toggleShiftPreference,
    toggleDayOff,
    updateMaxConsecutiveDays,
    resetPreferences,
    savePreferences,
  } = useStaffPreferences()

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
          <StaffSelector staff={staff} selectedStaffId={selectedStaffId} onSelect={handleSelectStaff} />

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

              <TabsContent value="shifts" className="space-y-4">
                <ShiftPreferencesSection
                  preferences={preferences}
                  onToggle={toggleShiftPreference}
                  staffName={selectedStaff?.full_name}
                />
              </TabsContent>

              <TabsContent value="days-off" className="space-y-4">
                <DayOffPreferencesSection
                  preferences={preferences}
                  onToggle={toggleDayOff}
                  staffName={selectedStaff?.full_name}
                />
              </TabsContent>

              <TabsContent value="constraints" className="space-y-4">
                <ConstraintsSection
                  preferences={preferences}
                  onChangeMaxDays={updateMaxConsecutiveDays}
                  staffName={selectedStaff?.full_name}
                />
              </TabsContent>
            </Tabs>
          )}

          {selectedStaffId && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={resetPreferences} disabled={loading || saving}>
                Reset
              </Button>
              <Button onClick={savePreferences} disabled={loading || saving}>
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  )
}
