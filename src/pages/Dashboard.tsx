import { useMemo } from "react"
import { z } from "zod"

import documentsData from "@/app/dashboard/data.json"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable, schema as documentSchema } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

const dataArraySchema = z.array(documentSchema)

export default function DashboardPage() {
  const documents = useMemo(() => dataArraySchema.parse(documentsData), [])

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-3 pb-10 md:px-6">
      <SectionCards />
      <div className="@container/main grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ChartAreaInteractive />
        </div>
        <div className="lg:col-span-2">
          <DataTable data={documents.slice(0, 12)} />
        </div>
      </div>
    </div>
  )
}
