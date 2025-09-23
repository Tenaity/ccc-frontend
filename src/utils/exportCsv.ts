import { exportScheduleCsv } from "@/lib/api";

/**
 * exportMonthCsv: download schedule CSV for the given month.
 * @param year - full year (e.g., 2025)
 * @param month - month number 1-12
 * @throws Error when request fails
 */
export async function exportMonthCsv(year: number, month: number): Promise<number> {
  const { blob, rowCount, filename } = await exportScheduleCsv(year, month);
  const url = URL.createObjectURL(blob);
  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.rel = "noopener";
    anchor.click();
  } finally {
    URL.revokeObjectURL(url);
  }
  return rowCount;
}
