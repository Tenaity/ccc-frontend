// src/hooks/useScheduleData.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Staff,
  Assignment,
  EstimateResponse,
  ExpectedByDay,
  DayPlaceSummary,
  FixedAssignment,
  OffDay,
  Holiday,
} from "../types";
import { DAY_SHIFTS, NIGHT_SHIFTS, SHIFT_CREDIT } from "../utils/schedule"; // giữ nguyên nguồn constants/credit hiện tại
import { fmtYMD, parseYMD } from "../utils/date";
import { buildCellIndex, type Cell } from "../utils/mergeCellIndex";
import { generateSchedule, validateSchedule } from "@/lib/api";


/** safeJSON: đọc Response an toàn, ném Error message gọn gàng khi !ok */
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

/**
 * useScheduleData:
 * - Quản lý state dữ liệu lịch (staff, assignments)
 * - Cung cấp các action (generate/shuffle/save/reset)
 * - Tính các chỉ số tổng hợp (perDayCounts, perDayLeaders, perDayByPlace, summariesByStaffId, …)
 */
export function isScheduleEnabled(options?: { enabled?: boolean }): boolean {
  return options?.enabled ?? true;
}

export function useScheduleData(
  year: number,
  month: number,
  options?: { enabled?: boolean },
) {
  const isEnabled = isScheduleEnabled(options);
  // ====== RAW DATA ======
  const [staff, setStaff] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [fixed, setFixed] = useState<FixedAssignment[]>([]);
  const [offdays, setOffdays] = useState<OffDay[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loadingGen, setLoadingGen] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(isEnabled);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [validation, setValidation] = useState<{ ok: boolean; conflicts: any[] }>({ ok: true, conflicts: [] });
  const [hasLeaderDup, setHasLeaderDup] = useState(false);

  // Rule expected per-day (dùng cho so sánh với planned khi cần)
  const [expectedByDay, setExpectedByDay] = useState<ExpectedByDay>({});
  const [loadingExpected, setLoadingExpected] = useState(false);
  const [expectedError, setExpectedError] = useState<string | null>(null);

  // Lưu lại tham số lần generate gần nhất để SAVE chạy lại y hệt
  const [lastOptions, setLastOptions] = useState<{
    year: number; month: number; shuffle: boolean; seed: number | null; fillHC: boolean;
  } | null>(null);

  // Estimate (nhu cầu/cung cấp theo THÁNG)
  const [estimate, setEstimate] = useState<EstimateResponse | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);

  // Checkbox “Auto fill HC” (chuyển xuống body khi Generate/Save)
  const [fillHC, setFillHC] = useState<boolean>(false);

  // ====== BASIC DERIVEDS ======
  const lastDay = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: lastDay }, (_, i) => i + 1), [lastDay]);

  /** assignmentIndex: map "staffId|YYYY-MM-DD" -> {code, position} để render nhanh từng ô */
  const assignmentIndex = useMemo(
    () => buildCellIndex(assignments, fixed, offdays),
    [assignments, fixed, offdays],
  );

  const fixedByDay = useMemo(() => {
    const m = new Map<string, FixedAssignment[]>();
    for (const f of fixed) {
      if (!m.has(f.day)) m.set(f.day, []);
      m.get(f.day)!.push(f);
    }
    return m;
  }, [fixed]);

  const offByDay = useMemo(() => {
    const m = new Map<string, OffDay[]>();
    for (const o of offdays) {
      if (!m.has(o.day)) m.set(o.day, []);
      m.get(o.day)!.push(o);
    }
    return m;
  }, [offdays]);

  const fixedByDayStaff = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const f of fixed) m.set(`${f.staff_id}|${f.day}`, true);
    return m;
  }, [fixed]);

  const offByDayStaff = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const o of offdays) m.set(`${o.staff_id}|${o.day}`, true);
    return m;
  }, [offdays]);

  const allAssignments = useMemo<Assignment[]>(() => {
    const merged: Assignment[] = assignments.map(a => ({ ...a }));
    for (const f of fixed) {
      merged.push({ day: f.day, shift_code: f.shift_code, staff_id: f.staff_id, position: f.position });
    }
    for (const o of offdays) {
      merged.push({ day: o.day, shift_code: "P", staff_id: o.staff_id, position: null });
    }
    return merged;
  }, [assignments, fixed, offdays]);

  // ====== LOADERS ======
  const fetchStaff = useCallback(async () => {
    if (!isEnabled) {
      setLoadingStaff(false);
      return;
    }

    setLoadingStaff(true);
    setStaffError(null);
    try {
      const res = await fetch("/api/staff");
      const json = await safeJSON<Staff[]>(res);
      setStaff(json);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách nhân sự.";
      setStaff([]);
      setStaffError(message);
    } finally {
      setLoadingStaff(false);
    }
  }, [isEnabled]);

  useEffect(() => {
    void fetchStaff();
  }, [fetchStaff]);

  /** fetchAssignments: tải lịch đã lưu (DB) theo (year,month) */
  const fetchAssignments = useCallback(async () => {
    if (!isEnabled) {
      return;
    }
    const res = await fetch(`/api/assignments?year=${year}&month=${month}`);
    setAssignments(await safeJSON<Assignment[]>(res));
  }, [isEnabled, month, year]);

  /** fetchFixed: tải các ca cố định theo (year,month) */
  const fetchFixed = useCallback(async () => {
    if (!isEnabled) {
      return;
    }
    const res = await fetch(`/api/fixed?year=${year}&month=${month}`);
    setFixed(await safeJSON<FixedAssignment[]>(res));
  }, [isEnabled, month, year]);

  /** fetchOffdays: tải danh sách xin nghỉ theo (year,month) */
  const fetchOffdays = useCallback(async () => {
    if (!isEnabled) {
      return;
    }
    const res = await fetch(`/api/offdays?year=${year}&month=${month}`);
    setOffdays(await safeJSON<OffDay[]>(res));
  }, [isEnabled, month, year]);

  const fetchHolidays = useCallback(async () => {
    if (!isEnabled) {
      return;
    }
    const res = await fetch(`/api/holidays?year=${year}&month=${month}`);
    setHolidays(await safeJSON<Holiday[]>(res));
  }, [isEnabled, month, year]);

  const fetchValidate = useCallback(async (): Promise<{ ok: boolean; conflicts: any[] }> => {
    if (!isEnabled) {
      return validation;
    }
    const result = await validateSchedule(year, month);
    const normalized = { ok: result.ok, conflicts: result.conflicts };
    setValidation(normalized);
    setHasLeaderDup(result.hasLeaderDup);
    return normalized;
  }, [isEnabled, month, validation, year]);

  /** fetchExpected: tải rule “chuẩn” từng ngày trong tháng (để đối chiếu UI nếu cần) */
  const fetchExpected = useCallback(async () => {
    if (!isEnabled) {
      setLoadingExpected(false);
      return;
    }
    setLoadingExpected(true);
    setExpectedError(null);
    try {
      const res = await fetch(`/api/rules/expected?year=${year}&month=${month}`);
      const json = await safeJSON<{ ok: boolean; perDayExpected: ExpectedByDay }>(res);
      setExpectedByDay(json?.perDayExpected || {});
    } catch (err: any) {
      setExpectedError(err?.message || "Load expected failed");
      setExpectedByDay({});
    } finally {
      setLoadingExpected(false);
    }
  }, [isEnabled, month, year]);

  /** fetchEstimate: tải estimate (nhu cầu/cung) cho tháng đang chọn */
  const fetchEstimate = useCallback(async () => {
    if (!isEnabled) {
      setLoadingEstimate(false);
      return;
    }
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
  }, [isEnabled, month, year]);

  // Khi đổi (year,month): refresh assignments + fixed/off + estimate + expected
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    (async () => {
      await fetchAssignments();
      await fetchFixed();
      await fetchOffdays();
      await fetchHolidays();
      await fetchEstimate();
      await fetchExpected();
      await fetchValidate();
    })();
  }, [
    fetchAssignments,
    fetchEstimate,
    fetchExpected,
    fetchFixed,
    fetchHolidays,
    fetchOffdays,
    fetchValidate,
    isEnabled,
    month,
    year,
  ]);

  // ====== ACTIONS (Generate/Shuffle/Save/Reset) ======
  /** onGenerate: chạy engine để xem preview (không lưu DB) */
  const onGenerate = async (
    opts?: { shuffle?: boolean }
  ): Promise<{ ok: boolean; conflicts: any[] }> => {
    setLoadingGen(true);
    try {
      const valid = await fetchValidate();
      if (!valid.ok) return valid;
      const shuffle = !!opts?.shuffle;
      const seed = shuffle ? Date.now() : null;
      const result = await generateSchedule({
        year,
        month,
        shuffle,
        seed,
        save: false,
        fillHC,
      });

      setAssignments(result?.ok === false ? [] : (result.planned ?? []));
      setLastOptions({ year, month, shuffle, seed, fillHC });

      await fetchEstimate();
      await fetchExpected();

      return valid;
    } finally {
      setLoadingGen(false);
    }
  };

  /** onShuffle: generate với random seed */
  const onShuffle = async () => onGenerate({ shuffle: true });

  /** onSave: chạy lại đúng tham số lần trước & lưu DB, sau đó reload assignments thật */
  const onSave = async () => {
    if (!lastOptions) { alert("Hãy Generate hoặc Shuffle trước khi Save."); return; }
    setLoadingGen(true);
    try {
    await generateSchedule({ ...lastOptions, save: true });
    await fetchAssignments();
    await fetchEstimate();
    await fetchExpected();
      alert("Đã lưu lịch vào DB.");
    } finally {
      setLoadingGen(false);
    }
  };

  /** Reset mềm: xoá toàn bộ assignment nhưng giữ schema */
  const onResetSoft = async () => {
    if (!confirm("Xoá tất cả Assignment?")) return;
    await fetch("/api/admin/reset?mode=soft", { method: "POST" });
    await fetchAssignments();
    await fetchEstimate();
    await fetchExpected();
  };

  /** Reset cứng: drop DB file + recreate schema */
  const onResetHard = async () => {
    if (!confirm("Xoá file DB và tạo lại schema? (mất toàn bộ dữ liệu)")) return;
    await fetch("/api/admin/reset?mode=hard", { method: "POST" });
    await fetchAssignments();
    await fetchEstimate();
    await fetchExpected();
  };

  // ====== SUMMARIES (cho panel bên phải và TotalsRows) ======

  /**
   * summariesByStaffId:
   *  - counts: số lượng ca theo mã (CA1/CA2/K/HC/Đ/P) cho từng nhân sự trong tháng
   *  - credit: tổng công quy đổi theo SHIFT_CREDIT
   *  - dayCount / nightCount: số ca ngày / đêm của nhân sự
   */
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

  /**
   * perDayCounts:
   *  - Đếm số ca theo mã (CA1/CA2/K/HC/Đ/P) cho MỖI NGÀY của tháng (bất kể vị trí)
   *  - Dùng để hiển thị các cột tổng “theo mã ca” phía trên nếu cần
   */
  const perDayCounts = useMemo(() => {
    const byDay: Record<number, Record<string, number>> = {};
    for (const d of days) byDay[d] = { CA1: 0, K: 0, CA2: 0, HC: 0, Đ: 0, P: 0 };
    for (const a of allAssignments) {
      const { yy, mm, dd } = parseYMD(a.day);
      if (yy === year && mm === month && byDay[dd] && byDay[dd][a.shift_code] !== undefined) {
        byDay[dd][a.shift_code] += 1;
      }
    }
    return byDay;
  }, [allAssignments, days, year, month]);

  /**
   * perDayLeaders:
   *  - Số “trưởng ca” theo NGÀY: tính 1 cho K@TD (leader ngày) + 1 cho Đ@TD (leader đêm)
   *  - Dùng cho MatrixHeader (hiển thị badge cảnh báo khi != 1 nếu bạn còn giữ rule đó)
   */
  const perDayLeaders = useMemo(() => {
    const map: Record<number, number> = {};
    for (const d of days) map[d] = 0;
    for (const a of allAssignments) {
      const { yy, mm, dd } = parseYMD(a.day);
      if (yy !== year || mm !== month) continue;
      if ((a.shift_code === "K" && a.position === "TD") || (a.shift_code === "Đ" && a.position === "TD")) {
        map[dd] += 1;
      }
    }
    return map;
  }, [allAssignments, days, year, month]);

  /**
   * perDayDayNight:
   *  - Tổng số slot ca ngày / ca đêm theo NGÀY (không phân vị trí)
   */
  const perDayDayNight = useMemo(() => {
    const map: Record<number, { dayCount: number; nightCount: number }> = {};
    for (const d of days) map[d] = { dayCount: 0, nightCount: 0 };
    for (const a of allAssignments) {
      const { yy, mm, dd } = parseYMD(a.day);
      if (yy !== year || mm !== month || !map[dd]) continue;
      if (DAY_SHIFTS.includes(a.shift_code)) map[dd].dayCount += 1;
      else if (NIGHT_SHIFTS.includes(a.shift_code)) map[dd].nightCount += 1;
    }
    return map;
  }, [allAssignments, days, year, month]);

 const perDayByPlace = useMemo(() => {
  const init = () => ({
    TD:  { K: 0, CA1: 0, CA2: 0, D: 0 },
    PGD: { K: 0, CA2: 0, D: 0 },
  });
  const by: Record<number, ReturnType<typeof init>> = {};
  for (const d of days) by[d] = init();

  for (const a of allAssignments) {
    const { yy, mm, dd } = parseYMD(a.day);
    if (yy !== year || mm !== month || !by[dd]) continue;

    // TD (ngày + đêm @ TD)
    if (a.position === "TD" || !a.position) {
      if (a.shift_code === "K") by[dd].TD.K += 1;
      else if (a.shift_code === "CA1") by[dd].TD.CA1 += 1;
      else if (a.shift_code === "CA2") by[dd].TD.CA2 += 1;
      else if (a.shift_code === "Đ") by[dd].TD.D += 1;   // gộp leader + white
    }

    // PGD (ngày + đêm @ PGD)
    if (a.position === "PGD") {
      if (a.shift_code === "K") by[dd].PGD.K += 1;
      else if (a.shift_code === "CA2") by[dd].PGD.CA2 += 1;
      else if (a.shift_code === "Đ") by[dd].PGD.D += 1;
    }
  }
  return by;
  }, [allAssignments, days, year, month]);

  /** leaderErrors: tiện phát hiện ngày không đúng số “trưởng ca” mong muốn */
  const leaderErrors = useMemo(() => {
    const errs: { day: number; count: number }[] = [];
    for (const d of days) {
      const c = perDayLeaders[d] ?? 0;
      if (c !== 1) errs.push({ day: d, count: c });
    }
    return errs;
  }, [perDayLeaders, days]);

  // ====== PUBLIC API của hook ======
  return {
    // raw
    staff, assignments, setAssignments,
    loadingGen,
    loadingStaff,
    staffError,
    validation,
    hasLeaderDup,

    // calendar shape
    days,
    assignmentIndex,
    fixedByDay,
    offByDay,
    fixedByDayStaff,
    offByDayStaff,
    holidays,

    // summaries & totals
    summariesByStaffId, perDayCounts, perDayLeaders, perDayDayNight, leaderErrors,
    perDayByPlace,

    // actions
    onGenerate, onShuffle, onSave,
    onResetSoft, onResetHard,
    fetchStaff, fetchFixed, fetchOffdays, fetchHolidays, fetchValidate,

    // estimate & expected
    estimate, loadingEstimate, estimateError, fetchEstimate,
    expectedByDay, loadingExpected, expectedError,

    // UI options
    fillHC, setFillHC,
  };
}