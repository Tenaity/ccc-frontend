import React from "react";
import { DOW_LABEL } from "../../utils/schedule";
import { getDow, isWeekend } from "../../utils/date";
import { cn } from "../../lib/utils";

export default function MatrixHeader({
    year, month, days, perDayLeaders
}: {
    year: number; month: number; days: number[];
    perDayLeaders: Record<number, number>;
}) {
    return (
        <thead>
            <tr>
                <th
                    rowSpan={3}
                    className="sticky left-0 top-0 z-20 bg-gray-100 border-b border-gray-200 p-1.5 text-left whitespace-nowrap"
                >
                    Nhân viên
                </th>
                {days.map((d) => {
                    const dow = getDow(year, month, d);
                    const wk = isWeekend(dow);
                    const leaders = perDayLeaders[d] ?? 0;
                    const ok = leaders === 1;
                    return (
                        <th
                            key={`d-${d}`}
                            className={cn(
                                "sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-1.5 text-center whitespace-nowrap relative",
                                wk && "bg-amber-50"
                            )}
                        >
                            {d}
                            <div className="absolute right-1 top-0.5 text-[10px]">
                                {ok ? "✅" : "⚠️"}
                            </div>
                        </th>
                    );
                })}
                <th rowSpan={3} className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-1.5">CA1</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-1.5">CA2</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-1.5">K</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-1.5">HC</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-1.5">Đ</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200 p-1.5">P</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-blue-50 border-b border-gray-200 p-1.5">Ngày</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-orange-50 border-b border-gray-200 p-1.5">Đêm</th>
                <th rowSpan={3} className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 p-1.5">Tổng công</th>
            </tr>
            <tr>
                {days.map((d) => {
                    const dow = getDow(year, month, d);
                    const wk = isWeekend(dow);
                    return (
                        <th
                            key={`w-${d}`}
                            className={cn(
                                "sticky top-[28px] z-10 bg-gray-100 border-b border-gray-200 p-1 text-center text-xs font-medium whitespace-nowrap",
                                wk && "bg-amber-50"
                            )}
                        >
                            {DOW_LABEL[dow]}
                        </th>
                    );
                })}
            </tr>
            <tr>
                {days.map((d) => {
                    const wk = isWeekend(getDow(year, month, d));
                    const leaders = perDayLeaders[d] ?? 0;
                    return (
                        <th
                            key={`leader-${d}`}
                            className={cn(
                                "sticky top-[52px] z-10 bg-gray-100 border-b border-gray-200 p-1 text-[10px] font-medium whitespace-nowrap",
                                wk && "bg-amber-50"
                            )}
                        >
                            K(leader TD): {leaders}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}
