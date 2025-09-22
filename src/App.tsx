import React, { useMemo, useState } from "react";
import AppShell, { type AppShellBreadcrumbItem } from "./components/layout/AppShell";
import CalendarHeader from "./components/CalendarHeader";
import ConflictList from "./components/ConflictList";
import Legend from "./components/Legend";
import MatrixTable from "./components/Matrix/MatrixTable";
import EstimatePanel from "./components/Estimate/EstimatePanel";
import { useScheduleData } from "./hooks/useScheduleData";
import { FixedOffPanel } from "./components/fixed-off";
import { useExportCsv } from "./hooks/useExportCsv";
import Toolbar from "./components/Toolbar";
import { useToast } from "@/components/ui/use-toast";

export default function App() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [showFixedOff, setShowFixedOff] = useState(false);
    const { toast } = useToast();

    const {
        staff,
        loadingGen,
        loadingStaff,
        staffError,
        days,
        assignmentIndex,
        fixedByDayStaff,
        offByDayStaff,
        summariesByStaffId,
        perDayLeaders,
        perDayByPlace,
        leaderErrors,
        estimate,
        loadingEstimate,
        estimateError,
        onGenerate,
        onShuffle,
        onSave,
        onResetSoft,
        onResetHard,
        fetchStaff,
        fetchFixed,
        fetchOffdays,
        fetchHolidays,
        fetchValidate,
        fillHC,
        setFillHC,
        expectedByDay,
        validation,
        hasLeaderDup,
    } = useScheduleData(year, month);

    const { exportCsv, isExporting } = useExportCsv();

    const onExport = React.useCallback(() => {
        void exportCsv(year, month);
    }, [exportCsv, year, month]);

    const monthLabel = useMemo(() => `${String(month).padStart(2, "0")}/${year}`, [month, year]);
    const breadcrumbs: AppShellBreadcrumbItem[] = useMemo(
        () => [
            { label: "Trang chủ", href: "#overview" },
            { label: "Lịch phân ca", href: "#matrix" },
            { label: `Tháng ${monthLabel}`, current: true },
        ],
        [monthLabel],
    );

    const conflictCount = validation.conflicts.length;
    const leaderWarningCount = leaderErrors.length;
    const duplicateLabel = hasLeaderDup ? "Có" : "Không";
    const matrixLoading = loadingStaff || (loadingGen && staff.length === 0);
    const matrixError = staffError;

    return (
        <AppShell
            title="Customer Care Center"
            description="Quản lý lịch phân ca dạng ma trận"
            breadcrumbs={breadcrumbs}
            headerActions={
                <div className="flex flex-col items-start gap-1 text-sm text-muted-foreground sm:items-end">
                    <span>Tháng hiện tại: {monthLabel}</span>
                    <span>{staff.length} nhân sự</span>
                </div>
            }
            sidebar={
                <div className="flex flex-col gap-6">
                    <section aria-labelledby="sidebar-navigation" className="space-y-3">
                        <h2
                            id="sidebar-navigation"
                            className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/70"
                        >
                            Điều hướng
                        </h2>
                        <nav aria-labelledby="sidebar-navigation" className="flex flex-col gap-2 text-sm">
                            <a
                                className="rounded-md px-3 py-2 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                href="#overview"
                            >
                                Tổng quan
                            </a>
                            <a
                                className="rounded-md px-3 py-2 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                href="#matrix"
                            >
                                Ma trận phân ca
                            </a>
                            <a
                                className="rounded-md px-3 py-2 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                href="#fixed-off"
                            >
                                Cố định &amp; Nghỉ
                            </a>
                        </nav>
                    </section>

                    <section aria-labelledby="sidebar-status" className="space-y-3">
                        <h2
                            id="sidebar-status"
                            className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/70"
                        >
                            Trạng thái
                        </h2>
                        <dl className="space-y-2 text-sm text-sidebar-foreground/90">
                            <div className="flex items-center justify-between rounded-md border border-border/40 bg-sidebar/40 px-3 py-2">
                                <dt>Cảnh báo</dt>
                                <dd className="font-semibold">{conflictCount}</dd>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-border/40 bg-sidebar/40 px-3 py-2">
                                <dt>Ngày thiếu trưởng ca</dt>
                                <dd className="font-semibold">{leaderWarningCount}</dd>
                            </div>
                            <div className="flex items-center justify-between rounded-md border border-border/40 bg-sidebar/40 px-3 py-2">
                                <dt>Trùng trưởng ca</dt>
                                <dd className="font-semibold">{duplicateLabel}</dd>
                            </div>
                        </dl>
                    </section>

                    <section aria-labelledby="sidebar-legend" className="space-y-3">
                        <h2
                            id="sidebar-legend"
                            className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/70"
                        >
                            Chú giải mã ca
                        </h2>
                        <div className="flex flex-wrap gap-2 text-xs leading-5 text-sidebar-foreground">
                            <Legend label="CA1" bg="#E6F0FF" />
                            <Legend label="CA2" bg="#FFE8CC" />
                            <Legend label="K" bg="#E6FFEA" />
                            <Legend label="HC" bg="#EDEBFF" />
                            <Legend label="Đ" bg="#FFE6EA" />
                            <Legend label="P" bg="#EEE" />
                            <Legend label="T7/CN" bg="#FFF7CC" />
                            <Legend label="PGD (đỏ)" bg="#F7D1D1" />
                            <Legend label="K trắng (T7)" bg="#FFFFFF" />
                            <Legend label="TC ngày (K + 👑, position=TD)" bg="#E6FFEA" />
                            <Legend label="TC đêm (Đ + 👑, position=TD & role=TC)" bg="#FFE6EA" />
                        </div>
                    </section>
                </div>
            }
        >
            <section id="overview" aria-labelledby="overview-heading" className="space-y-4">
                <div>
                    <h2 id="overview-heading" className="text-base font-semibold text-foreground">
                        Tổng quan nhu cầu
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Theo dõi ước tính nhu cầu công và cảnh báo thiếu trưởng ca
                    </p>
                </div>
                <EstimatePanel data={estimate} loading={loadingEstimate} error={estimateError} />

                {leaderErrors.length > 0 ? (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900" id="alerts">
                        <strong className="font-semibold">Cảnh báo:</strong> Có {leaderErrors.length} ngày không đúng số lượng
                        <em className="px-1">Trưởng ca ngày</em> (K, position=TD).
                        <div className="mt-2 flex flex-wrap gap-2">
                            {leaderErrors.slice(0, 10).map(error => (
                                <code
                                    key={error.day}
                                    className="rounded bg-white px-2 py-1 text-xs font-semibold text-amber-900"
                                >
                                    D{error.day}: {error.count}
                                </code>
                            ))}
                            {leaderErrors.length > 10 ? <span>…</span> : null}
                        </div>
                    </div>
                ) : null}

                {hasLeaderDup ? (
                    <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-900">
                        <strong className="font-semibold">Cảnh báo:</strong> Có ngày có &gt;1 trưởng ca
                    </div>
                ) : null}
            </section>

            <section id="matrix" aria-labelledby="matrix-heading" className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 id="matrix-heading" className="text-base font-semibold text-foreground">
                            Ma trận phân ca
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Chỉnh sửa, sinh ca và xuất báo cáo CSV
                        </p>
                    </div>
                </div>

                <CalendarHeader
                    year={year}
                    month={month}
                    setYear={setYear}
                    setMonth={setMonth}
                    loading={loadingGen}
                    onGenerate={onGenerate}
                    onShuffle={onShuffle}
                    onSave={onSave}
                    onResetSoft={onResetSoft}
                    onResetHard={onResetHard}
                    onExport={onExport}
                    exporting={isExporting}
                    fillHC={fillHC}
                    setFillHC={setFillHC}
                    canGenerate={validation.ok}
                    onOpenFixedOff={() => setShowFixedOff(true)}
                />

                <Toolbar
                    onGenerate={onGenerate}
                    onValidate={() => fetchValidate()}
                    onExport={onExport}
                    onFixedOff={() => setShowFixedOff(true)}
                    disabled={loadingGen}
                    exporting={isExporting}
                />

                <div id="conflicts" className="space-y-4">
                    <ConflictList conflicts={validation.conflicts} />
                </div>

                <div id="matrix-table" className="overflow-x-auto">
                    <MatrixTable
                        year={year}
                        month={month}
                        days={days}
                        staff={staff}
                        assignmentIndex={assignmentIndex}
                        summariesByStaffId={summariesByStaffId}
                        perDayLeaders={perDayLeaders}
                        perDayByPlace={perDayByPlace}
                        expectedByDay={expectedByDay}
                        fixedByDayStaff={fixedByDayStaff}
                        offByDayStaff={offByDayStaff}
                        loading={matrixLoading}
                        error={matrixError}
                        onRetry={fetchStaff}
                    />
                </div>
            </section>

            <div id="fixed-off" className="space-y-4">
                <div className="sr-only" aria-hidden="true">
                    Điểm neo cố định/off
                </div>
                <FixedOffPanel
                    year={year}
                    month={month}
                    open={showFixedOff}
                    onClose={() => setShowFixedOff(false)}
                    onExportCsv={onExport}
                    exporting={isExporting}
                    onToast={(message, options) =>
                        toast({
                            description: message,
                            ...options,
                        })
                    }
                    onRefresh={async () => {
                        await fetchFixed();
                        await fetchOffdays();
                        await fetchHolidays();
                    }}
                />
            </div>
        </AppShell>
    );
}
