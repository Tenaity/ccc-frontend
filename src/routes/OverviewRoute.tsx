import React from "react";
import EstimatePanel from "@/components/Estimate/EstimatePanel";
import type { EstimateResponse } from "@/types";

interface LeaderError {
  day: number;
  count: number;
}

interface OverviewRouteProps {
  estimate: EstimateResponse | null;
  loadingEstimate: boolean;
  estimateError: string | null;
  leaderErrors: LeaderError[];
  hasLeaderDup: boolean;
}

export default function OverviewRoute({
  estimate,
  loadingEstimate,
  estimateError,
  leaderErrors,
  hasLeaderDup,
}: OverviewRouteProps) {
  return (
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
            {leaderErrors.slice(0, 10).map((error) => (
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
  );
}
