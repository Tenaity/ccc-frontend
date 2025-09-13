/**
 * exportMonthCsv: download schedule CSV for the given month.
 * @param year - full year (e.g., 2025)
 * @param month - month number 1-12
 * @throws Error when request fails
 */
export async function exportMonthCsv(year: number, month: number): Promise<void> {
  const res = await fetch(`/api/export/month.csv?year=${year}&month=${month}`);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule-${year}-${String(month).padStart(2, '0')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
