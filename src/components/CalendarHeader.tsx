import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CalendarIcon,
  DatabaseIcon,
  DownloadIcon,
  Settings2,
  ShuffleIcon,
  Sparkles,
} from "lucide-react";

const months = Array.from({ length: 12 }, (_, index) => index + 1);

export default function CalendarHeader({
  year,
  month,
  setYear,
  setMonth,
  loading,
  onGenerate,
  onShuffle,
  onSave,
  onResetSoft,
  onResetHard,
  onExport,
  exporting = false,
  fillHC,
  setFillHC,
  canGenerate = true,
  onOpenFixedOff,
}: {
  year: number;
  month: number;
  setYear: (y: number) => void;
  setMonth: (m: number) => void;
  loading: boolean;
  onGenerate: () => void;
  onShuffle: () => void;
  onSave: () => void;
  onResetSoft: () => void;
  onResetHard: () => void;
  onExport: () => void;
  exporting?: boolean;
  fillHC: boolean;
  setFillHC: (v: boolean) => void;
  canGenerate?: boolean;
  onOpenFixedOff: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState<"preview" | "manage">(
    "preview"
  );

  const yearOptions = React.useMemo(() => {
    const start = year - 2;
    return Array.from({ length: 5 }, (_, index) => start + index);
  }, [year]);

  return (
    <Card className="mb-6 border-border/60 shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 md:w-1/2">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="year-input" className="text-xs uppercase text-muted-foreground">
                Năm
              </Label>
              <Input
                id="year-input"
                type="number"
                inputMode="numeric"
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                className="h-10 w-24"
                disabled={loading}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="month-select" className="text-xs uppercase text-muted-foreground">
                Tháng
              </Label>
              <Select
                value={String(month)}
                onValueChange={(value) => setMonth(Number(value))}
                disabled={loading}
              >
                <SelectTrigger id="month-select" className="h-10 w-28">
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={String(m)}>
                      Tháng {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="year-select" className="text-xs uppercase text-muted-foreground">
                Năm gần đây
              </Label>
              <Select
                value={String(year)}
                onValueChange={(value) => setYear(Number(value))}
                disabled={loading}
              >
                <SelectTrigger id="year-select" className="h-10 w-32">
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 rounded-full border border-border/70 bg-muted/40 px-4 py-2">
                  <Switch
                    id="fill-hc-switch"
                    checked={fillHC}
                    onCheckedChange={setFillHC}
                    disabled={loading}
                  />
                  <Label
                    htmlFor="fill-hc-switch"
                    className="text-sm font-medium text-foreground"
                  >
                    Tự động bù HC
                  </Label>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bù ca HC khi Generate/Shuffle để tránh thiếu nhân sự.</p>
              </TooltipContent>
            </Tooltip>
            <div className="rounded-full border border-dashed border-border/60 px-4 py-1 text-xs text-muted-foreground">
              <span className="font-medium">Lưu ý:</span> Generate/Shuffle chỉ preview.
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 md:items-end">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "preview" | "manage")}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="preview" className="gap-2">
                <Sparkles className="h-4 w-4" /> Preview
              </TabsTrigger>
              <TabsTrigger value="manage" className="gap-2">
                <DatabaseIcon className="h-4 w-4" /> Quản lý
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="preview"
              className="mt-4 flex flex-col gap-2 md:flex-row"
            >
              <Button
                onClick={onGenerate}
                disabled={loading || !canGenerate}
                className="min-w-[170px]"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {loading ? "Đang tạo..." : "Generate preview"}
              </Button>
              <Button
                variant="outline"
                onClick={onShuffle}
                disabled={loading || !canGenerate}
                className="min-w-[150px]"
              >
                <ShuffleIcon className="mr-2 h-4 w-4" /> Shuffle preview
              </Button>
            </TabsContent>
            <TabsContent
              value="manage"
              className="mt-4 flex flex-col gap-2 md:flex-row"
            >
              <Button
                variant="secondary"
                onClick={onSave}
                disabled={loading}
                className="min-w-[140px]"
              >
                <DatabaseIcon className="mr-2 h-4 w-4" />
                {loading ? "Đang lưu..." : "Lưu lịch"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="min-w-[160px]"
                  >
                    <Settings2 className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Reset lịch</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={onResetSoft}>
                    Reset lịch (soft)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onResetHard}>
                    Reset DB (hard)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              onClick={onExport}
              disabled={loading || exporting}
              className="min-w-[140px]"
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              {exporting ? "Đang xuất..." : "Export CSV"}
            </Button>
            <Button onClick={onOpenFixedOff} disabled={loading} className="min-w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" /> Fixed/Off/Holiday
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
