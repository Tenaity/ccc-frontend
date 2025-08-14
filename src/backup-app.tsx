// import React, { useEffect, useMemo, useState } from "react";

// /** Trọng số công theo quy định */
// const SHIFT_CREDIT = { CA1: 1, CA2: 1, HC: 1, K: 1.25, Đ: 1.5, P: 0 };

// /** Thứ trong tuần (vi): 0=CN, 1=T2, ... 6=T7 */
// const DOW_LABEL = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

// function fmtYMD(y, m, d) { return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`; }
// function getDow(y, m, d) { return new Date(y, m - 1, d).getDay(); }
// function isWeekend(dow) { return dow === 0 || dow === 6; }

// export default function App() {
//     const today = new Date();
//     const [year, setYear] = useState(today.getFullYear());
//     const [month, setMonth] = useState(today.getMonth() + 1);

//     const [staff, setStaff] = useState([]);
//     const [assignments, setAssignments] = useState([]);
//     const [loadingGen, setLoadingGen] = useState(false);

//     const ym = useMemo(() => `${year}-${String(month).padStart(2, "0")}`, [year, month]);
//     const lastDay = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
//     const days = useMemo(() => Array.from({ length: lastDay }, (_, i) => i + 1), [lastDay]);

//     // nhóm ca
//     const DAY_SHIFTS = ["CA1", "K", "CA2"]; // ca NGÀY (không tính HC)
//     const NIGHT_SHIFTS = ["Đ"];             // ca ĐÊM

//     // Map: `${staff_id}|YYYY-MM-DD` -> { code, position }
//     const assignmentIndex = useMemo(() => {
//         const m = new Map();
//         for (const a of assignments) {
//             m.set(`${a.staff_id}|${a.day}`, { code: a.shift_code, position: a.position || null });
//         }
//         return m;
//     }, [assignments]);

//     useEffect(() => { fetch("/api/staff").then(r => r.json()).then(setStaff); }, []);
//     useEffect(() => {
//         fetch(`/api/assignments?year=${year}&month=${month}`).then(r => r.json()).then(setAssignments);
//     }, [ym]);

//     const fetchAssignments = async () => {
//         const res = await fetch(`/api/assignments?year=${year}&month=${month}`);
//         setAssignments(await res.json());
//     };

//     const onGenerate = async () => {
//         setLoadingGen(true);
//         try {
//             await fetch("/api/schedule/generate", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ year, month }),
//             });
//             await fetchAssignments();
//         } finally { setLoadingGen(false); }
//     };

//     const onShuffle = async () => {
//         setLoadingGen(true);
//         try {
//             const seed = Date.now().toString(); // mỗi lần bấm 1 seed khác
//             await fetch("/api/schedule/generate", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ year, month, shuffle: true, seed }),
//             });
//             await fetchAssignments();
//         } finally { setLoadingGen(false); }
//     };

//     /** Tổng theo từng nhân viên */
//     const summariesByStaffId = useMemo(() => {
//         const out = new Map();
//         for (const s of staff) {
//             const counts = { CA1: 0, CA2: 0, K: 0, HC: 0, Đ: 0, P: 0 };
//             let credit = 0, dayCount = 0, nightCount = 0;
//             for (const d of days) {
//                 const cell = assignmentIndex.get(`${s.id}|${fmtYMD(year, month, d)}`);
//                 const code = cell?.code;
//                 if (!code) continue;
//                 if (counts[code] !== undefined) counts[code] += 1;
//                 credit += SHIFT_CREDIT[code] ?? 0;
//                 if (DAY_SHIFTS.includes(code)) dayCount += 1;
//                 if (code === "Đ") nightCount += 1;
//             }
//             out.set(s.id, { counts, credit: +credit.toFixed(2), dayCount, nightCount });
//         }
//         return out;
//     }, [staff, days, year, month, assignmentIndex]);

//     /** Tổng theo NGÀY: đếm mọi K (gồm K PGD & K_WHITE) để theo dõi phân bổ chung */
//     const perDayCounts = useMemo(() => {
//         const byDay = {};
//         for (const d of days) byDay[d] = { CA1: 0, K: 0, CA2: 0, HC: 0, Đ: 0, P: 0 };
//         for (const a of assignments) {
//             const dt = new Date(a.day);
//             const y = dt.getFullYear(), m = dt.getMonth() + 1, d = dt.getDate();
//             if (y === year && m === month && byDay[d] && byDay[d][a.shift_code] !== undefined) {
//                 byDay[d][a.shift_code] += 1;
//             }
//         }
//         return byDay;
//     }, [assignments, days, year, month]);

//     /** Đếm riêng Trưởng ca NGÀY (K, position=TD) để kiểm soát đúng 1/ngày */
//     const perDayLeaders = useMemo(() => {
//         const map = {};
//         for (const d of days) map[d] = 0;
//         for (const a of assignments) {
//             const dt = new Date(a.day);
//             const y = dt.getFullYear(), m = dt.getMonth() + 1, d = dt.getDate();
//             if (y !== year || m !== month) continue;
//             if (a.shift_code === "K" && a.position === "TD") map[d] += 1;
//         }
//         return map;
//     }, [assignments, days, year, month]);

//     // NGÀY vs ĐÊM theo NGÀY
//     const perDayDayNight = useMemo(() => {
//         const map = {};
//         for (const d of days) map[d] = { dayCount: 0, nightCount: 0 };
//         for (const a of assignments) {
//             const dt = new Date(a.day);
//             const y = dt.getFullYear(), m = dt.getMonth() + 1, d = dt.getDate();
//             if (y !== year || m !== month || !map[d]) continue;
//             if (DAY_SHIFTS.includes(a.shift_code)) map[d].dayCount += 1;
//             else if (NIGHT_SHIFTS.includes(a.shift_code)) map[d].nightCount += 1;
//         }
//         return map;
//     }, [assignments, days, year, month]);

//     /** Ngày lỗi leader (≠ 1) để cảnh báo */
//     const leaderErrors = useMemo(() => {
//         const errs = [];
//         for (const d of days) {
//             const c = perDayLeaders[d] ?? 0;
//             if (c !== 1) errs.push({ day: d, count: c });
//         }
//         return errs;
//     }, [perDayLeaders, days]);

//     return (
//         <div style={{ fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial", padding: 16 }}>
//             <h1 style={{ marginBottom: 8 }}>Lịch phân ca dạng ma trận</h1>

//             {/* Banner cảnh báo nếu có ngày thiếu/thừa trưởng ca ngày */}
//             {leaderErrors.length > 0 && (
//                 <div style={{ marginBottom: 12, padding: 10, border: "1px solid #f59e0b", background: "#FFFBEB", borderRadius: 8 }}>
//                     <strong>Cảnh báo:</strong> Có {leaderErrors.length} ngày không đúng số lượng <em>Trưởng ca ngày</em> (K, position=TD).
//                     {" "}Chi tiết:{" "}
//                     {leaderErrors.slice(0, 10).map(e => <code key={e.day} style={{ marginRight: 6 }}>D{e.day}: {e.count}</code>)}
//                     {leaderErrors.length > 10 ? "…" : ""}
//                 </div>
//             )}

//             <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
//                 <label>Năm:</label>
//                 <input type="number" value={year} onChange={(e) => setYear(+e.target.value)} style={{ width: 100 }} />
//                 <label>Tháng:</label>
//                 <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(+e.target.value)} style={{ width: 80 }} />

//                 <button onClick={onGenerate} disabled={loadingGen} style={{ padding: "6px 12px" }}>
//                     {loadingGen ? "Đang tạo..." : "Generate"}
//                 </button>

//                 <button onClick={onShuffle} disabled={loadingGen} style={{ padding: "6px 12px" }}>
//                     {loadingGen ? "…" : "Shuffle"}
//                 </button>

//                 <button onClick={async () => {
//                     const day = prompt("Nhập ngày Lễ (YYYY-MM-DD):");
//                     if (!day) return;
//                     const name = prompt("Tên Lễ (tuỳ chọn):") || "";
//                     await fetch("/api/holidays", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ day, name }) });
//                     alert("Đã thêm ngày Lễ. Generate lại để áp dụng.");
//                 }}>+ Ngày Lễ</button>

//                 <button onClick={async () => {
//                     const staff_id = Number(prompt("staff_id nghỉ phép:"));
//                     const day = prompt("Ngày nghỉ (YYYY-MM-DD):");
//                     if (!staff_id || !day) return;
//                     await fetch("/api/off", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ staff_id, day, reason: "Nghỉ phép" }) });
//                     alert("Đã thêm nghỉ phép. Generate lại để áp dụng.");
//                 }}>+ Nghỉ phép</button>
//             </div>

//             <div style={{ overflow: "auto", border: "1px solid #eee", borderRadius: 8 }}>
//                 <table style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: 1000 }}>
//                     <thead>
//                         <tr>
//                             <th rowSpan={3} className="sticky-col" style={thStickyLeft}>Nhân viên</th>
//                             {days.map((d) => {
//                                 const dow = getDow(year, month, d);
//                                 const wk = isWeekend(dow);
//                                 const leaders = perDayLeaders[d] ?? 0;
//                                 const ok = leaders === 1;
//                                 return (
//                                     <th key={`d-${d}`} style={{ ...th, ...(wk ? thWeekend : null), position: "relative" }}>
//                                         {d}
//                                         <div style={{ position: "absolute", right: 4, top: 2, fontSize: 10 }}>
//                                             {ok ? "✅" : "⚠️"}
//                                         </div>
//                                     </th>
//                                 );
//                             })}
//                             <th rowSpan={3} style={th}>CA1</th>
//                             <th rowSpan={3} style={th}>CA2</th>
//                             <th rowSpan={3} style={th}>K</th>
//                             <th rowSpan={3} style={th}>HC</th>
//                             <th rowSpan={3} style={th}>Đ</th>
//                             <th rowSpan={3} style={th}>P</th>
//                             <th rowSpan={3} style={{ ...th, background: "#eef8ff" }}>Ngày</th>
//                             <th rowSpan={3} style={{ ...th, background: "#fff7e6" }}>Đêm</th>
//                             <th rowSpan={3} style={{ ...th, background: "#f9fafb" }}>Tổng công</th>
//                         </tr>
//                         <tr>
//                             {days.map((d) => {
//                                 const dow = getDow(year, month, d);
//                                 const wk = isWeekend(dow);
//                                 return <th key={`w-${d}`} style={{ ...thSmall, ...(wk ? thWeekend : null) }}>{DOW_LABEL[dow]}</th>;
//                             })}
//                         </tr>
//                         <tr>
//                             {days.map((d) => {
//                                 const wk = isWeekend(getDow(year, month, d));
//                                 const leaders = perDayLeaders[d] ?? 0;
//                                 return (
//                                     <th key={`leader-${d}`} style={{ ...thMini, ...(wk ? thWeekend : null) }}>
//                                         K(leader TD): {leaders}
//                                     </th>
//                                 );
//                             })}
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {staff.map((s, idx) => {
//                             return (
//                                 <tr key={s.id} style={{ background: idx % 2 ? "#fff" : "#fbfbfd" }}>
//                                     <td className="sticky-col" style={tdStickyLeft}>
//                                         <div style={{ fontWeight: 600 }}>{s.full_name}</div>
//                                         <div style={{ fontSize: 12, color: "#666" }}>{s.role} {s.can_night ? "" : "· không đêm"}</div>
//                                     </td>

//                                     {days.map((d) => {
//                                         const dateKey = fmtYMD(year, month, d);
//                                         const cell = assignmentIndex.get(`${s.id}|${dateKey}`) || {};
//                                         const code = cell.code || "";
//                                         const pos = cell.position || null;
//                                         const dow = getDow(year, month, d);
//                                         const wk = isWeekend(dow);

//                                         // 👑 logic: chỉ K@TD là leader-day, Đ@TD + role=TC là leader-night
//                                         const isLeaderDay = code === "K" && pos === "TD";
//                                         const isLeaderNight = code === "Đ" && pos === "TD" && s.role === "TC";

//                                         return (
//                                             <td key={d} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>
//                                                 <Badge
//                                                     code={code}
//                                                     crown={isLeaderDay || isLeaderNight}
//                                                     variant={
//                                                         pos === "K_WHITE" ? "k-white" :
//                                                             pos === "PGD" ? "pgd" :
//                                                                 isLeaderDay ? "leader-day" :
//                                                                     isLeaderNight ? "leader-night" :
//                                                                         "td"
//                                                     }
//                                                 />
//                                             </td>
//                                         );
//                                     })}

//                                     {/* tổng theo nhân viên */}
//                                     {(() => {
//                                         const sum = summariesByStaffId.get(s.id) || { counts: {}, credit: 0, dayCount: 0, nightCount: 0 };
//                                         return (
//                                             <>
//                                                 <td style={tdCenter}>{sum.counts?.CA1 || 0}</td>
//                                                 <td style={tdCenter}>{sum.counts?.CA2 || 0}</td>
//                                                 <td style={tdCenter}>{sum.counts?.K || 0}</td>
//                                                 <td style={tdCenter}>{sum.counts?.HC || 0}</td>
//                                                 <td style={tdCenter}>{sum.counts?.Đ || 0}</td>
//                                                 <td style={tdCenter}>{sum.counts?.P || 0}</td>
//                                                 <td style={tdCenter}>{sum.dayCount}</td>
//                                                 <td style={tdCenter}>{sum.nightCount}</td>
//                                                 <td style={{ ...tdCenter, fontWeight: 700, background: "#f9fafb" }}>{sum.credit}</td>
//                                             </>
//                                         );
//                                     })()}
//                                 </tr>
//                             );
//                         })}

//                         {/* Tổng theo ngày (đếm tất cả K để theo dõi phân bổ) */}
//                         <tr style={{ background: "#ECEAFF" }}>
//                             <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>CA1</td>
//                             {days.map((d) => {
//                                 const wk = isWeekend(getDow(year, month, d));
//                                 const val = perDayCounts[d]?.CA1 ?? 0;
//                                 return <td key={`sum-ca1-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
//                             })}
//                             <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng ca CA1 theo ngày</td>
//                         </tr>
//                         <tr style={{ background: "#FFE9D6" }}>
//                             <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>CA2</td>
//                             {days.map((d) => {
//                                 const wk = isWeekend(getDow(year, month, d));
//                                 const val = perDayCounts[d]?.CA2 ?? 0;
//                                 return <td key={`sum-ca2-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
//                             })}
//                             <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng ca CA2 theo ngày</td>
//                         </tr>
//                         <tr style={{ background: "#E7F8EC" }}>
//                             <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>K (mọi vị trí)</td>
//                             {days.map((d) => {
//                                 const wk = isWeekend(getDow(year, month, d));
//                                 const val = perDayCounts[d]?.K ?? 0;
//                                 return <td key={`sum-k-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
//                             })}
//                             <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Tổng ca K (bao gồm K PGD & K_WHITE)</td>
//                         </tr>
//                         <tr style={{ background: "#DFF6FF" }}>
//                             <td className="sticky-col" style={{ ...tdStickyLeft, fontWeight: 700 }}>K (leader TD)</td>
//                             {days.map((d) => {
//                                 const wk = isWeekend(getDow(year, month, d));
//                                 const val = perDayLeaders[d] ?? 0;
//                                 return <td key={`sum-kleader-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null), fontWeight: 700 }}>{val}</td>;
//                             })}
//                             <td colSpan={9} style={{ ...tdCenter, fontStyle: "italic", color: "#666" }}>Phải luôn = 1/ngày</td>
//                         </tr>
//                         <tr style={{ background: "#FFE8A3", fontWeight: 700 }}>
//                             <td className="sticky-col" style={tdStickyLeft}>TỔNG CA ĐÊM</td>
//                             {days.map((d) => {
//                                 const wk = isWeekend(getDow(year, month, d));
//                                 const val = perDayDayNight[d]?.nightCount ?? 0;
//                                 return <td key={`sum-night-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{val}</td>;
//                             })}
//                             <td colSpan={9} />
//                         </tr>
//                         <tr style={{ background: "#CDEFC7", fontWeight: 700 }}>
//                             <td className="sticky-col" style={tdStickyLeft}>TỔNG CA NGÀY</td>
//                             {days.map((d) => {
//                                 const wk = isWeekend(getDow(year, month, d));
//                                 const { dayCount = 0 } = perDayDayNight[d] || {};
//                                 return <td key={`sum-day-${d}`} style={{ ...tdCenter, ...(wk ? tdWeekend : null) }}>{dayCount}</td>;
//                             })}
//                             <td colSpan={9} />
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>

//             <div style={{ marginTop: 10, fontSize: 12, color: "#555" }}>
//                 <strong>Chú giải:</strong>{" "}
//                 <Legend label="CA1" bg="#E6F0FF" />{" "}
//                 <Legend label="CA2" bg="#FFE8CC" />{" "}
//                 <Legend label="K" bg="#E6FFEA" />{" "}
//                 <Legend label="HC" bg="#EDEBFF" />{" "}
//                 <Legend label="Đ" bg="#FFE6EA" />{" "}
//                 <Legend label="P" bg="#EEE" />{" "}
//                 <Legend label="T7/CN" bg="#FFF7CC" />{" "}
//                 <Legend label="PGD (đỏ)" bg="#F7D1D1" />{" "}
//                 <Legend label="K trắng (T7)" bg="#FFFFFF" />{" "}
//                 <Legend label="TC ngày (K + 👑, position=TD)" bg="#E6FFEA" />{" "}
//                 <Legend label="TC đêm (Đ + 👑, position=TD & role=TC)" bg="#FFE6EA" />
//             </div>
//         </div>
//     );
// }

// /** Ô nhãn ca có màu nhẹ theo quy ước + biến thể theo vị trí/role */
// function Badge({ code, variant = "td", crown = false }) {
//     if (!code) return <span style={{ color: "#aaa" }}>—</span>;
//     const base = {
//         display: "inline-flex", alignItems: "center", gap: 6,
//         padding: "2px 6px", borderRadius: 6, border: "1px solid #e5e7eb",
//         fontSize: 12, background: pickBg(code), fontWeight: 500,
//     };
//     if (variant === "pgd") { base.background = "#F7D1D1"; base.border = "1px solid #e06b6b"; }
//     if (variant === "k-white") { base.background = "#FFFFFF"; base.border = "1.5px dashed #999"; }
//     if (variant === "leader-day") { base.border = "1.5px solid #16a34a"; base.boxShadow = "0 0 0 1px rgba(22,163,74,.12) inset"; }
//     if (variant === "leader-night") { base.border = "1.5px solid #7c3aed"; base.boxShadow = "0 0 0 1px rgba(124,58,237,.12) inset"; }
//     const crownIcon = crown ? <span title="Trưởng ca">👑</span> : null;
//     return <span style={base}>{code}{crownIcon}</span>;
// }

// function pickBg(code) {
//     switch (code) {
//         case "CA1": return "#E6F0FF";
//         case "CA2": return "#FFE8CC";
//         case "K": return "#E6FFEA";
//         case "HC": return "#EDEBFF";
//         case "Đ": return "#FFE6EA";
//         case "P": return "#EEEEEE";
//         default: return "#F8F8F8";
//     }
// }

// function Legend({ label, bg }) {
//     return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: bg, border: "1px solid #ddd", marginRight: 6 }}>{label}</span>;
// }

// /** Styles */
// const th = { position: "sticky", top: 0, background: "#f2f4f7", borderBottom: "1px solid #e5e7eb", padding: "6px 8px", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", zIndex: 1, textAlign: "center" };
// const thSmall = { ...th, fontWeight: 500, fontSize: 11, padding: "4px 6px", top: 28 };
// const thMini = { ...th, fontWeight: 500, fontSize: 10, padding: "2px 4px", top: 52 };
// const thWeekend = { background: "#FFF7CC" };
// const thStickyLeft = { ...th, left: 0, zIndex: 2, textAlign: "left" };
// const tdCenter = { borderTop: "1px solid #f0f0f0", padding: "6px 8px", textAlign: "center", whiteSpace: "nowrap" };
// const tdWeekend = { background: "#FFFDF0" };
// const tdStickyLeft = { ...tdCenter, position: "sticky", left: 0, zIndex: 1, background: "#fff", textAlign: "left" };
