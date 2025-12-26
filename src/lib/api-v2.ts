/**
 * CCC Backend V2 API Client
 *
 * Provides TypeScript-friendly API methods for:
 * - Staff Management (List, Create, Update, Delete, Leave Management)
 * - Department Management (List, Create, Update, Delete, Configuration)
 */

import { safeJSON } from "@/lib/fetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_KEY = "123456";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
} as const;

/**
 * Build full API URL
 */
function buildUrl(path: string): string {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Wrapper around fetch with API key
 */
function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const headers = new Headers(options?.headers || {});
  if (!headers.has("x-api-key")) {
    headers.set("x-api-key", API_KEY);
  }

  return fetch(buildUrl(url), {
    ...options,
    headers,
  });
}

// ============================================================================
// TYPES
// ============================================================================

export interface Staff {
  id: number;
  full_name: string;
  employee_code?: string;
  department_id: number;
  department_name?: string;
  team_id?: number;
  team_name?: string;
  rank_id?: number;
  rank_name?: string;
  title_id?: number | null;
  title_name?: string | null;
  is_active: boolean;
  is_on_leave: boolean;
  leave_start_date?: string | null;
  leave_end_date?: string | null;
  role?: string;
  can_night: boolean;
  base_quota?: number;
  notes?: string | null;
}

export interface CreateStaffInput {
  full_name: string;
  employee_code?: string;
  department_id: number;
  team_id?: number;
  rank_id?: number;
  title_id?: number;
  is_active?: boolean;
  role?: string;
  can_night?: boolean;
  base_quota?: number;
  notes?: string;
}

export interface UpdateStaffInput {
  full_name?: string;
  employee_code?: string;
  team_id?: number;
  rank_id?: number;
  title_id?: number;
  is_active?: boolean;
  is_on_leave?: boolean;
  leave_start_date?: string;
  leave_end_date?: string;
  role?: string;
  can_night?: boolean;
  base_quota?: number;
  notes?: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  color?: string;
  icon?: string;
  description?: string;
  is_active: boolean;
  settings?: {
    working_hours?: {
      start: string;
      end: string;
    };
    weekend_policy?: string;
    max_hours_per_month?: number;
    min_staff_per_shift?: number;
  };
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  color?: string;
  icon?: string;
  description?: string;
  is_active?: boolean;
  settings?: Record<string, unknown>;
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
  color?: string;
  icon?: string;
  description?: string;
  is_active?: boolean;
  settings?: Record<string, unknown>;
}

export interface ListStaffFilters {
  department_id?: number;
  team_id?: number;
  rank_id?: number;
  is_active?: boolean;
  q?: string;
}

// ============================================================================
// STAFF API
// ============================================================================

/**
 * List all staff with optional filtering
 */
export async function listStaff(filters?: ListStaffFilters): Promise<Staff[]> {
  const params = new URLSearchParams();
  if (filters?.department_id) params.append("department_id", String(filters.department_id));
  if (filters?.team_id) params.append("team_id", String(filters.team_id));
  if (filters?.rank_id) params.append("rank_id", String(filters.rank_id));
  if (filters?.is_active !== undefined) params.append("is_active", filters.is_active ? "1" : "0");
  if (filters?.q) params.append("q", filters.q);

  const url = `/api/v2/staff${params.toString() ? `?${params.toString()}` : ""}`;
  const response = await apiFetch(url);
  return safeJSON<Staff[]>(response);
}

/**
 * Get a single staff member by ID
 */
export async function getStaff(staffId: number): Promise<Staff> {
  const response = await apiFetch(`/api/v2/staff/${staffId}`);
  return safeJSON<Staff>(response);
}

/**
 * Get staff by employee code
 */
export async function getStaffByCode(employeeCode: string): Promise<Staff> {
  const response = await apiFetch(`/api/v2/staff/code/${employeeCode}`);
  return safeJSON<Staff>(response);
}

/**
 * Create a new staff member
 */
export async function createStaff(input: CreateStaffInput): Promise<Staff> {
  const response = await apiFetch("/api/v2/staff", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  return safeJSON<Staff>(response);
}

/**
 * Update a staff member
 */
export async function updateStaff(staffId: number, input: UpdateStaffInput): Promise<Staff> {
  const response = await apiFetch(`/api/v2/staff/${staffId}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  return safeJSON<Staff>(response);
}

/**
 * Delete a staff member
 */
export async function deleteStaff(staffId: number): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/v2/staff/${staffId}`, {
    method: "DELETE",
  });
  return safeJSON<{ ok: boolean }>(response);
}

/**
 * Set staff on leave
 */
export async function setStaffOnLeave(
  staffId: number,
  startDate: string,
  endDate: string
): Promise<Staff> {
  const response = await apiFetch(`/api/v2/staff/${staffId}/leave`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
    }),
  });
  return safeJSON<Staff>(response);
}

/**
 * Cancel staff leave
 */
export async function cancelStaffLeave(staffId: number): Promise<Staff> {
  const response = await apiFetch(`/api/v2/staff/${staffId}/leave/cancel`, {
    method: "POST",
    headers: JSON_HEADERS,
  });
  return safeJSON<Staff>(response);
}

/**
 * Get staff capable of night shifts
 */
export async function getNightCapableStaff(departmentId?: number): Promise<Staff[]> {
  const params = departmentId ? `?department_id=${departmentId}` : "";
  const response = await apiFetch(`/api/v2/staff/night-capable${params}`);
  return safeJSON<Staff[]>(response);
}

/**
 * Get staff currently on leave
 */
export async function getStaffOnLeave(departmentId?: number): Promise<Staff[]> {
  const params = departmentId ? `?department_id=${departmentId}` : "";
  const response = await apiFetch(`/api/v2/staff/on-leave${params}`);
  return safeJSON<Staff[]>(response);
}

// ============================================================================
// DEPARTMENT API
// ============================================================================

/**
 * List all departments with optional filtering
 */
export async function listDepartments(active?: boolean): Promise<Department[]> {
  const params = active !== undefined ? `?active=${active ? "1" : "0"}` : "";
  const response = await apiFetch(`/api/v2/departments${params}`);
  return safeJSON<Department[]>(response);
}

/**
 * Get a single department by ID
 */
export async function getDepartment(deptId: number): Promise<Department> {
  const response = await apiFetch(`/api/v2/departments/${deptId}`);
  return safeJSON<Department>(response);
}

/**
 * Get department by code
 */
export async function getDepartmentByCode(code: string): Promise<Department> {
  const response = await apiFetch(`/api/v2/departments/code/${code}`);
  return safeJSON<Department>(response);
}

/**
 * Create a new department
 */
export async function createDepartment(input: CreateDepartmentInput): Promise<Department> {
  const payload = {
    ...input,
    is_active: input.is_active !== false,
    settings: input.settings || {
      working_hours: { start: "08:00", end: "17:00" },
      weekend_policy: "sat_off",
      max_hours_per_month: 208,
      min_staff_per_shift: 2,
    },
  };

  const response = await apiFetch("/api/v2/departments", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  return safeJSON<Department>(response);
}

/**
 * Update a department
 */
export async function updateDepartment(
  deptId: number,
  input: UpdateDepartmentInput
): Promise<Department> {
  const response = await apiFetch(`/api/v2/departments/${deptId}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(input),
  });
  return safeJSON<Department>(response);
}

/**
 * Delete a department
 */
export async function deleteDepartment(deptId: number): Promise<{ ok: boolean }> {
  const response = await apiFetch(`/api/v2/departments/${deptId}`, {
    method: "DELETE",
  });
  return safeJSON<{ ok: boolean }>(response);
}

// ============================================================================
// EXPORTS
// ============================================================================

export const staffApi = {
  list: listStaff,
  get: getStaff,
  getByCode: getStaffByCode,
  create: createStaff,
  update: updateStaff,
  delete: deleteStaff,
  setOnLeave: setStaffOnLeave,
  cancelLeave: cancelStaffLeave,
  getNightCapable: getNightCapableStaff,
  getOnLeave: getStaffOnLeave,
};

export const departmentApi = {
  list: listDepartments,
  get: getDepartment,
  getByCode: getDepartmentByCode,
  create: createDepartment,
  update: updateDepartment,
  delete: deleteDepartment,
};
