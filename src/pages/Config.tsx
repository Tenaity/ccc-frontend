import { CalendarPlus, Settings2 } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { HolidaysTab, MonthPlanTab } from "@/components/config"

export default function ConfigSchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Settings2}
        tagline="Operations Toolkit"
        title="Config Schedule"
        description="Quản lý ngày nghỉ và cấu hình sinh lịch cho từng tháng."
      />
      <Tabs defaultValue="month-plan" className="space-y-6">
        <TabsList className="w-full max-w-xl">
          <TabsTrigger value="month-plan" className="flex-1 gap-2">
            <Settings2 className="h-4 w-4" /> Month Plan
          </TabsTrigger>
          <TabsTrigger value="holidays" className="flex-1 gap-2">
            <CalendarPlus className="h-4 w-4" /> Holidays
          </TabsTrigger>
        </TabsList>
        <TabsContent value="month-plan" className="space-y-6">
          <MonthPlanTab />
        </TabsContent>
        <TabsContent value="holidays" className="space-y-6">
          <HolidaysTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

