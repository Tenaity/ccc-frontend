import { Badge } from "@/components/ui/badge"

export default function Legend({ label, bg }: { label: string; bg: string }) {
  return (
    <Badge
      variant="outline"
      className="whitespace-nowrap px-3 py-1 text-xs font-medium shadow-sm"
      style={{ backgroundColor: bg }}
    >
      {label}
    </Badge>
  )
}
