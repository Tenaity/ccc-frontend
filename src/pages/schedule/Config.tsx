import { CalendarPlus, Settings2 } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { GlassPanel } from "@/components/ui/glass"
import { cn } from "@/lib/utils"
import { HolidaysTab, MonthPlanTab } from "@/components/config"

export default function ConfigSchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Settings2}
        tagline="Advanced Configuration"
        title="Schedule Configuration Hub"
        description="Quản lý ngày nghỉ lễ và tùy chỉnh cấu hình sinh lịch thông minh cho từng tháng"
      />
      <Tabs defaultValue="month-plan" className="space-y-6">
        <GlassPanel variant="strong" className="p-2">
          <TabsList className={cn(
            "w-full max-w-2xl h-auto gap-2 bg-transparent p-0",
            "grid grid-cols-2"
          )}>
            <TabsTrigger
              value="month-plan"
              className={cn(
                "flex-1 gap-2 h-12 rounded-lg",
                "data-[state=active]:bg-white/90 data-[state=active]:shadow-ios",
                "data-[state=active]:ring-1 data-[state=active]:ring-sky-400/40",
                "dark:data-[state=active]:bg-slate-900/80",
                "transition-all duration-200"
              )}
            >
              <Settings2 className="h-4 w-4" />
              <span className="font-semibold">Month Plan</span>
            </TabsTrigger>
            <TabsTrigger
              value="holidays"
              className={cn(
                "flex-1 gap-2 h-12 rounded-lg",
                "data-[state=active]:bg-white/90 data-[state=active]:shadow-ios",
                "data-[state=active]:ring-1 data-[state=active]:ring-emerald-400/40",
                "dark:data-[state=active]:bg-slate-900/80",
                "transition-all duration-200"
              )}
            >
              <CalendarPlus className="h-4 w-4" />
              <span className="font-semibold">Holidays</span>
            </TabsTrigger>
          </TabsList>
        </GlassPanel>
        <TabsContent value="month-plan" className="space-y-6 mt-6">
          <MonthPlanTab />
        </TabsContent>
        <TabsContent value="holidays" className="space-y-6 mt-6">
          <HolidaysTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

