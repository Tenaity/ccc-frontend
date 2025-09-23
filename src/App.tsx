import React, { lazy, useMemo, useState, Suspense } from "react";
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import AppShell, { type AppShellBreadcrumbItem } from "./components/layout/AppShell";
import Legend from "./components/Legend";
import { useScheduleData } from "./hooks/useScheduleData";
import { useExportCsv } from "./hooks/useExportCsv";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const OverviewRoute = lazy(() => import("./routes/OverviewRoute"));
const MatrixRoute = lazy(() => import("./routes/MatrixRoute"));
const FixedOffPanel = lazy(() => import("./components/fixed-off/FixedOffPanel"));

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
    const location = useLocation();

    const onExport = React.useCallback(() => {
        void exportCsv(year, month);
    }, [exportCsv, year, month]);

    const monthLabel = useMemo(() => `${String(month).padStart(2, "0")}/${year}`, [month, year]);
    const normalizedPath = location.pathname === "/" ? "/overview" : location.pathname;
    const breadcrumbs: AppShellBreadcrumbItem[] = useMemo(() => {
        if (normalizedPath === "/matrix") {
            return [
                { label: "Trang chủ", href: "#/overview" },
                { label: "Lịch phân ca", href: "#/matrix" },
                { label: `Tháng ${monthLabel}`, current: true },
            ];
        }

        return [
            { label: "Trang chủ", href: "#/overview", current: true },
            { label: "Lịch phân ca", href: "#/matrix" },
            { label: `Tháng ${monthLabel}` },
        ];
    }, [monthLabel, normalizedPath]);

    const conflictCount = validation.conflicts.length;
    const leaderWarningCount = leaderErrors.length;
    const duplicateLabel = hasLeaderDup ? "Có" : "Không";
    const matrixLoading = loadingStaff || (loadingGen && staff.length === 0);
    const matrixError = staffError;
    const navLinkClass = React.useCallback(
        ({ isActive }: { isActive: boolean }) =>
            cn(
                "rounded-md px-3 py-2 font-medium text-sidebar-foreground transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : undefined,
            ),
        [],
    );

    const routesFallback = (
        <div className="flex justify-center py-10" aria-live="polite">
            <span className="text-sm text-muted-foreground">Đang tải nội dung…</span>
        </div>
    );

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
                            className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground"
                        >
                            Điều hướng
                        </h2>
                        <nav aria-labelledby="sidebar-navigation" className="flex flex-col gap-2 text-sm">
                            <NavLink to="/overview" className={navLinkClass} end>
                                Tổng quan
                            </NavLink>
                            <NavLink to="/matrix" className={navLinkClass}>
                                Ma trận phân ca
                            </NavLink>
                            <button
                                type="button"
                                className="rounded-md px-3 py-2 text-left font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                onClick={() => setShowFixedOff(true)}
                            >
                                Cố định &amp; Nghỉ
                            </button>
                        </nav>
                    </section>

                    <section aria-labelledby="sidebar-status" className="space-y-3">
                        <h2
                            id="sidebar-status"
                            className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground"
                        >
                            Trạng thái
                        </h2>
                        <dl className="space-y-2 text-sm text-sidebar-foreground">
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
                            className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground"
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
            <Suspense fallback={routesFallback}>
                <Routes>
                    <Route path="/" element={<Navigate to="/overview" replace />} />
                    <Route
                        path="/overview"
                        element={
                            <OverviewRoute
                                estimate={estimate}
                                loadingEstimate={loadingEstimate}
                                estimateError={estimateError}
                                leaderErrors={leaderErrors}
                                hasLeaderDup={hasLeaderDup}
                            />
                        }
                    />
                    <Route
                        path="/matrix"
                        element={
                            <MatrixRoute
                                year={year}
                                month={month}
                                setYear={setYear}
                                setMonth={setMonth}
                                loadingGen={loadingGen}
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
                                onValidate={fetchValidate}
                                onOpenFixedOff={() => setShowFixedOff(true)}
                                days={days}
                                staff={staff}
                                assignmentIndex={assignmentIndex}
                                summariesByStaffId={summariesByStaffId}
                                perDayLeaders={perDayLeaders}
                                perDayByPlace={perDayByPlace}
                                expectedByDay={expectedByDay}
                                fixedByDayStaff={fixedByDayStaff}
                                offByDayStaff={offByDayStaff}
                                matrixLoading={matrixLoading}
                                matrixError={matrixError}
                                fetchStaff={fetchStaff}
                                validationConflicts={validation.conflicts}
                            />
                        }
                    />
                    <Route path="*" element={<Navigate to="/overview" replace />} />
                </Routes>
            </Suspense>

            <div id="fixed-off" className="space-y-4">
                <div className="sr-only" aria-hidden="true">
                    Điểm neo cố định/off
                </div>
                <Suspense
                    fallback={
                        <div className="text-sm text-muted-foreground" aria-live="polite">
                            Đang tải bảng cố định…
                        </div>
                    }
                >
                    {showFixedOff ? (
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
                    ) : null}
                </Suspense>
            </div>
        </AppShell>
    );
}
