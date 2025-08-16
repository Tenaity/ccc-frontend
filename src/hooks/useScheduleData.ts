// src/hooks/useScheduleData.ts
import { useEffect, useMemo, useState } from "react";
import type { Staff, Assignment, EstimateResponse } from "../types";
import { DAY_SHIFTS, NIGHT_SHIFTS, SHIFT_CREDIT } from "../utils/schedule";
import { fmtYMD } from "../utils/date";

type Cell = { code: Assignment["shift_code"]; position: Assignment["position"] };

// fetch JSON an toàn
async function safeJSON<T>(res: Response): Promise<T> {
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json?.error || res.statusText || "Request failed");
    return json as T;
  } catch (e) {
    if (!res.ok) throw new Error(text.slice(0, 200) || res.statusText);
    throw e;
  }
}

export function useScheduleData(year: number, month: number) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingGen, setLoadingGen] = useState(false);

  // ⬇️ NEW: nhớ thêm fillHC vào lastOptions để Save chạy lại đúng tham số
  const [lastOptions, setLastOptions] = useState<{
    year: number; month: number; shuffle: boolean; seed: number | null; fillHC: boolean;
  } | null>(null);

  // === Estimate state
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  // ⬇️ NEW: trạng thái checkbox “Auto fill HC”
  const [fillHC, setFillHC] = useState<boolean>(false);

  const lastDay = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: lastDay }, (_, i) => i + 1), [lastDay]);

  const assignmentIndex = useMemo(() => {
    const m = new Map<string, Cell>();
    for (const a of assignments) {
      m.set(`${a.staff_id}|${a.day}`, { code: a.shift_code, position: a.position || null });
    }
    return m;
  }, [assignments]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/staff");
      setStaff(await safeJSON<Staff[]>(res));
    })();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch(`/api/assignments?year=${year}&month=${month}`);
    setAssignments(await safeJSON<Assignment[]>(res));
  };

  // Estimate theo THÁNG hiện chọn
  const fetchEstimate = async () => {
    setLoadingEstimate(true);
    setEstimateError(null);
    try {
      const res = await fetch(`/api/schedule/estimate?year=${year}&month=${month}`);
      const json = await safeJSON<EstimateResponse>(res);
      setEstimate(json);
    } catch (err: any) {
      setEstimateError(err?.message || "Estimate failed");
      setEstimate(null);
    } finally {
      setLoadingEstimate(false);
    }
  };

  // Đọc lịch DB + Estimate mỗi khi đổi (year, month)
  useEffect(() => {
    (async () => {
      await fetchAssignments();
      await fetchEstimate();
    })(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  /** Preview: không lưu DB, render từ planned[] */
  const onGenerate = async (opts?: { shuffle?: boolean }) => {
    setLoadingGen(true);
    try {
      const shuffle = !!opts?.shuffle;
      const seed = shuffle ? Date.now() : null;

      // ⬇️ NEW: truyền fill_hc theo checkbox
      const body = { year, month, shuffle, seed, save: false, fill_hc: fillHC };

      const res = await fetch("/api/schedule/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await safeJSON<{ ok: boolean; planned?: Assignment[]; error?: string }>(res);

      setLastOptions({ year, month, shuffle, seed, fillHC }); // ⬅️ nhớ lưu
      setAssignments(result.planned ?? []); // preview ngay

      await fetchEstimate();
    } finally {
      setLoadingGen(false);
    }
  };

  const onShuffle = async () => onGenerate({ shuffle: true });

  /** Save: chạy lại cùng tham số & lưu DB, sau đó fetch assignments thật */
  const onSave = async () => {
    if (!lastOptions) { alert("Hãy Generate hoặc Shuffle trước khi Save."); return; }
    setLoadingGen(true);
    try {
      // ⬇️ NEW: fill_hc = lastOptions.fillHC
      const body = { ...lastOptions, save: true, fill_hc: lastOptions.fillHC };
      const res = await fetch("/api/schedule/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      await safeJSON(res);
      await fetchAssignments();
      await fetchEstimate();
      alert("Đã lưu lịch vào DB.");
    } finally {
      setLoadingGen(false);
    }
  };

  /** Reset lịch (soft/hard) */
  const onResetSoft = async () => {
    if (!confirm("Xoá tất cả Assignment?")) return;
    await fetch("/api/admin/reset?mode=soft", { method: "POST" });
    await fetchAssignments();
    await fetchEstimate();
  };
  const onResetHard = async () => {
    if (!confirm("Xoá file DB và tạo lại schema? (mất toàn bộ dữ liệu)")) return;
    await fetch("/api/admin/reset?mode=hard", { method: "POST" });
    await fetchAssignments();
    await fetchEstimate();
  };

  // === Summaries & totals
  const summariesByStaffId = useMemo(() => {
    const out = new Map<number, { counts: Record<string, number>, credit: number, dayCount: number, nightCount: number }>();
    for (const s of staff) {
      const counts: Record<string, number> = { CA1: 0, CA2: 0, K: 0, HC: 0, Đ: 0, P: 0 };
      let credit = 0, dayCount = 0, nightCount = 0;
      for (const d of days) {
        const cell = assignmentIndex.get(`${s.id}|${fmtYMD(year, month, d)}`);
        const code = cell?.code as keyof typeof SHIFT_CREDIT | undefined;
        if (!code) continue;
        counts[code] = (counts[code] ?? 0) + 1;
        credit += SHIFT_CREDIT[code] ?? 0;
        if (DAY_SHIFTS.includes(code as any)) dayCount++;
        if (code === "Đ") nightCount++;
      }
      out.set(s.id, { counts, credit: +credit.toFixed(2), dayCount, nightCount });
    }
    return out;
  }, [staff, days, year, month, assignmentIndex]);

  const perDayCounts = useMemo(() => {
    const byDay: Record<number, Record<string, number>> = {};
    for (const d of days) byDay[d] = { CA1: 0, K: 0, CA2: 0, HC: 0, Đ: 0, P: 0 };
    for (const a of assignments) {
      const dt = new Date(a.day);
      const yy = dt.getFullYear(), mm = dt.getMonth() + 1, dd = dt.getDate();
      if (yy === year && mm === month && byDay[dd] && byDay[dd][a.shift_code] !== undefined) byDay[dd][a.shift_code] += 1;
    }
    return byDay;
  }, [assignments, days, year, month]);

  const perDayLeaders = useMemo(() => {
    const map: Record<number, number> = {};
    for (const d of days) map[d] = 0;
    for (const a of assignments) {
      const dt = new Date(a.day);
      const yy = dt.getFullYear(), mm = dt.getMonth() + 1, dd = dt.getDate();
      if (yy !== year || mm !== month) continue;
      if (a.shift_code === "K" && a.position === "TD") map[dd] += 1;
    }
    return map;
  }, [assignments, days, year, month]);

  const perDayDayNight = useMemo(() => {
    const map: Record<number, { dayCount: number; nightCount: number }> = {};
    for (const d of days) map[d] = { dayCount: 0, nightCount: 0 };
    for (const a of assignments) {
      const dt = new Date(a.day);
      const yy = dt.getFullYear(), mm = dt.getMonth() + 1, dd = dt.getDate();
      if (yy !== year || mm !== month || !map[dd]) continue;
      if (DAY_SHIFTS.includes(a.shift_code)) map[dd].dayCount += 1;
      else if (NIGHT_SHIFTS.includes(a.shift_code)) map[dd].nightCount += 1;
    }
    return map;
  }, [assignments, days, year, month]);

  const leaderErrors = useMemo(() => {
    const errs: { day: number; count: number }[] = [];
    for (const d of days) {
      const c = perDayLeaders[d] ?? 0;
      if (c !== 1) errs.push({ day: d, count: c });
    }
    return errs;
  }, [perDayLeaders, days]);

  // perDayByPlace (phục vụ TotalsRows)
  const perDayByPlace = useMemo(() => {
    const init = () => ({
      TD: { K_leader: 0, K: 0, CA1: 0, CA2: 0 },
      PGD: { K: 0, CA2: 0 },
      NIGHT: { leader: 0, TD_WHITE: 0, PGD: 0 },
      K_WHITE: 0,
    });
    const by: Record<number, ReturnType<typeof init>> = {};
    for (const d of days) by[d] = init();

    for (const a of assignments) {
      const dt = new Date(a.day);
      const yy = dt.getFullYear(), mm = dt.getMonth() + 1, dd = dt.getDate();
      if (yy !== year || mm !== month || !by[dd]) continue;

      // Daytime @ TD
      if (["CA1", "CA2", "K"].includes(a.shift_code) && (a.position === "TD" || !a.position)) {
        if (a.shift_code === "K" && a.position === "TD") by[dd].TD.K_leader += 1;
        else by[dd].TD[a.shift_code as "CA1" | "CA2" | "K"] += 1;
      }

      // PGD (ngày/đêm)
      if (a.position === "PGD") {
        if (a.shift_code === "K") by[dd].PGD.K += 1;
        if (a.shift_code === "CA2") by[dd].PGD.CA2 += 1;
        // Đ@PGD sẽ tính ở NIGHT.PGD
      }

      // K trắng (thứ 7)
      if (a.shift_code === "K" && a.position === "K_WHITE") {
        by[dd].K_WHITE += 1;
      }

      // Night
      if (a.shift_code === "Đ") {
        if (a.position === "TD") by[dd].NIGHT.leader += 1;
        else if (a.position === "D_WHITE") by[dd].NIGHT.TD_WHITE += 1;
        else if (a.position === "PGD") by[dd].NIGHT.PGD += 1;
      }
    }
    return by;
  }, [assignments, days, year, month]);

  return {
    staff, assignments, setAssignments,
    loadingGen,
    days,
    assignmentIndex,
    summariesByStaffId, perDayCounts, perDayLeaders, perDayDayNight, leaderErrors,
    onGenerate, onShuffle, onSave,
    onResetSoft, onResetHard,
    // NEW (estimate + per-place)
    estimate, loadingEstimate, estimateError, fetchEstimate,
    perDayByPlace,
    // 👇 NEW: expose checkbox state
    fillHC, setFillHC,
  };
}