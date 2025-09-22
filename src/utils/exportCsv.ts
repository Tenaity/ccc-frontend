/**
 * exportMonthCsv: download schedule CSV for the given month.
 * @param year - full year (e.g., 2025)
 * @param month - month number 1-12
 * @throws Error when request fails
 */
export async function exportMonthCsv(year: number, month: number): Promise<number> {
  const res = await fetch(`/api/export/month.csv?year=${year}&month=${month}`);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const text = await res.text();
  const blob = new Blob([text], {
    type: res.headers.get('Content-Type') ?? 'text/csv',
  });
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const rowCount = lines.length > 0 ? Math.max(lines.length - 1, 0) : 0;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `schedule-${year}-${String(month).padStart(2, '0')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  return rowCount;
}
