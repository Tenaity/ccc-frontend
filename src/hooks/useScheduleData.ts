import { useEffect, useMemo, useState } from "react";
import type { Staff, Assignment } from "../types";
import { DAY_SHIFTS, NIGHT_SHIFTS, SHIFT_CREDIT } from "../utils/schedule";
import { fmtYMD } from "../utils/date";

type Cell = { code: Assignment["shift_code"]; position: Assignment["position"] };

export function useScheduleData(year:number, month:number) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingGen, setLoadingGen] = useState(false);
  const [lastOptions, setLastOptions] = useState<{year:number; month:number; shuffle:boolean; seed:number|null} | null>(null);

  const lastDay = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: lastDay }, (_, i) => i + 1), [lastDay]);

  const assignmentIndex = useMemo(() => {
    const m = new Map<string, Cell>();
    for (const a of assignments) {
      m.set(`${a.staff_id}|${a.day}`, { code: a.shift_code, position: a.position || null });
    }
    return m;
  }, [assignments]);

  useEffect(() => { fetch("/api/staff").then(r=>r.json()).then(setStaff); }, []);
  useEffect(() => {
    // Khi đổi (year,month), đọc từ DB — có thể trống nếu chưa Save
    fetch(`/api/assignments?year=${year}&month=${month}`).then(r=>r.json()).then(setAssignments);
  }, [year, month]);

  const fetchAssignments = async () => {
    const res = await fetch(`/api/assignments?year=${year}&month=${month}`);
    setAssignments(await res.json());
  };

  /** Preview: không lưu DB, render từ planned[] */
  const onGenerate = async (opts?: { shuffle?: boolean }) => {
    setLoadingGen(true);
    try {
      const shuffle = !!opts?.shuffle;
      const seed = shuffle ? Date.now() : null;
      const body = { year, month, shuffle, seed, save: false };
      const result = await fetch("/api/schedule/generate", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(body),
      }).then(r=>r.json());

      setLastOptions({ year, month, shuffle, seed });

      // Render preview từ planned
      const planned = (result?.planned ?? []) as Array<{ day:string; staff_id:number; shift_code:Assignment["shift_code"]; position: Assignment["position"] }>;
      setAssignments(planned);
    } finally { setLoadingGen(false); }
  };

  const onShuffle = async () => onGenerate({ shuffle: true });

  /** Save: chạy lại cùng tham số & lưu DB, sau đó fetch assignments thật */
  const onSave = async () => {
    if (!lastOptions) { alert("Hãy Generate hoặc Shuffle trước khi Save."); return; }
    setLoadingGen(true);
    try {
      const body = { ...lastOptions, save: true };
      await fetch("/api/schedule/generate", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(body),
      }).then(r=>r.json());
      await fetchAssignments();
      alert("Đã lưu lịch vào DB.");
    } finally { setLoadingGen(false); }
  };

  /** Reset lịch (soft/hard) */
  const onResetSoft = async () => {
    if (!confirm("Xoá tất cả Assignment?")) return;
    await fetch("/api/admin/reset?mode=soft", { method:"POST" });
    await fetchAssignments();
  };
  const onResetHard = async () => {
    if (!confirm("Xoá file DB và tạo lại schema? (mất toàn bộ dữ liệu)")) return;
    await fetch("/api/admin/reset?mode=hard", { method:"POST" });
    await fetchAssignments();
  };

  // === Summaries & totals như cũ ===
  const summariesByStaffId = useMemo(() => {
    const out = new Map<number, {
      counts: Record<string, number>, credit:number, dayCount:number, nightCount:number
    }>();
    for (const s of staff) {
      const counts: Record<string, number> = { CA1:0, CA2:0, K:0, HC:0, Đ:0, P:0 };
      let credit=0, dayCount=0, nightCount=0;
      for (const d of days) {
        const cell = assignmentIndex.get(`${s.id}|${fmtYMD(year,month,d)}`);
        const code = cell?.code as keyof typeof SHIFT_CREDIT | undefined;
        if (!code) continue;
        counts[code] = (counts[code] ?? 0) + 1;
        credit += SHIFT_CREDIT[code] ?? 0;
        if (["CA1","K","CA2"].includes(code)) dayCount++;
        if (code==="Đ") nightCount++;
      }
      out.set(s.id, { counts, credit:+credit.toFixed(2), dayCount, nightCount });
    }
    return out;
  }, [staff, days, year, month, assignmentIndex]);

  const perDayCounts = useMemo(() => {
    const byDay: Record<number, Record<string, number>> = {};
    for (const d of days) byDay[d] = { CA1:0, K:0, CA2:0, HC:0, Đ:0, P:0 };
    for (const a of assignments) {
      const dt = new Date(a.day);
      const y=dt.getFullYear(), m=dt.getMonth()+1, d=dt.getDate();
      if (y===year && m===month && byDay[d] && byDay[d][a.shift_code]!==undefined) byDay[d][a.shift_code] += 1;
    }
    return byDay;
  }, [assignments, days, year, month]);

  const perDayLeaders = useMemo(() => {
    const map: Record<number, number> = {};
    for (const d of days) map[d]=0;
    for (const a of assignments) {
      const dt = new Date(a.day); const y=dt.getFullYear(), m=dt.getMonth()+1, d=dt.getDate();
      if (y!==year || m!==month) continue;
      if (a.shift_code==="K" && a.position==="TD") map[d] += 1;
    }
    return map;
  }, [assignments, days, year, month]);

  const perDayDayNight = useMemo(() => {
    const map: Record<number, { dayCount:number; nightCount:number }> = {};
    for (const d of days) map[d] = { dayCount:0, nightCount:0 };
    for (const a of assignments) {
      const dt = new Date(a.day); const y=dt.getFullYear(), m=dt.getMonth()+1, d=dt.getDate();
      if (y!==year || m!==month || !map[d]) continue;
      if (["CA1","K","CA2"].includes(a.shift_code)) map[d].dayCount += 1;
      else if (a.shift_code==="Đ") map[d].nightCount += 1;
    }
    return map;
  }, [assignments, days, year, month]);

  const leaderErrors = useMemo(() => {
    const errs: {day:number; count:number}[] = [];
    for (const d of days) {
      const c = perDayLeaders[d] ?? 0;
      if (c !== 1) errs.push({ day:d, count:c });
    }
    return errs;
  }, [perDayLeaders, days]);

  return {
    staff, assignments, setAssignments,
    loadingGen,
    days,
    assignmentIndex,
    summariesByStaffId, perDayCounts, perDayLeaders, perDayDayNight, leaderErrors,
    onGenerate, onShuffle, onSave,
    onResetSoft, onResetHard,
  };
}
