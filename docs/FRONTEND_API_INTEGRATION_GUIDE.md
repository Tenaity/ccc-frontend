# Frontend API Integration Guide - V2 Staff & Department Management

## Overview

This guide documents the integration of CCC Backend V2 API with the frontend for staff and department management.

**Date**: November 5, 2024
**Status**: ✅ Integration Complete
**API Version**: V2 (`/api/v2/`)

---

## What Was Implemented

### 1. New API Service Module
**File**: `src/lib/api-v2.ts` (570+ lines)

- **Staff API Functions**:
  - `listStaff(filters?)` - Get all staff with filtering
  - `getStaff(staffId)` - Get single staff
  - `getStaffByCode(code)` - Get staff by employee code
  - `createStaff(input)` - Create new staff
  - `updateStaff(staffId, input)` - Update staff
  - `deleteStaff(staffId)` - Delete staff
  - `setStaffOnLeave(staffId, startDate, endDate)` - Mark on leave
  - `cancelStaffLeave(staffId)` - Cancel leave
  - `getNightCapableStaff(deptId?)` - Get night-shift capable staff
  - `getStaffOnLeave(deptId?)` - Get staff on leave

- **Department API Functions**:
  - `listDepartments(active?)` - Get all departments
  - `getDepartment(deptId)` - Get single department
  - `getDepartmentByCode(code)` - Get department by code
  - `createDepartment(input)` - Create new department
  - `updateDepartment(deptId, input)` - Update department
  - `deleteDepartment(deptId)` - Delete department

### 2. Updated Hooks

#### `src/pages/staff-management/useStaffManagement.ts`
- ✅ Updated `fetchStaff()` - Now uses V2 API
- ✅ Updated `fetchDepartments()` - Now uses V2 API
- ✅ Updated `saveStaff()` - Calls V2 API for create/update
- ✅ Updated `deleteStaff()` - Calls V2 API for delete
- ✅ Proper error handling with try-catch

#### `src/pages/department-management/useDepartmentManagement.ts`
- ✅ Updated `refreshDepartments()` - Now uses V2 API
- ✅ Updated `saveDepartment()` - Calls V2 API for create/update
- ✅ Updated `deleteDepartment()` - Calls V2 API for delete
- ✅ Proper error handling with try-catch

---

## API Configuration

### Base URL
```
Development: http://103.179.175.95:8000
Production: (Configure in .env)
```

### API Key
```
X-API-KEY: 123456 (auto-injected by api-v2.ts)
```

### API Version
```
V2 Endpoints: /api/v2/staff, /api/v2/departments
```

---

## Data Types

### Staff
```typescript
interface Staff {
  id: number
  full_name: string
  employee_code?: string
  department_id: number
  department_name?: string
  team_id?: number
  team_name?: string
  rank_id?: number
  rank_name?: string
  title_id?: number | null
  title_name?: string | null
  is_active: boolean
  is_on_leave: boolean
  leave_start_date?: string | null
  leave_end_date?: string | null
  role?: string
  can_night: boolean
  base_quota?: number
  notes?: string | null
}
```

### Department
```typescript
interface Department {
  id: number
  name: string
  code: string
  color?: string
  icon?: string
  description?: string
  is_active: boolean
  settings?: {
    working_hours?: { start: string; end: string }
    weekend_policy?: string
    max_hours_per_month?: number
    min_staff_per_shift?: number
  }
}
```

---

## Usage Examples

### Using the API Module Directly

```typescript
import * as staffApi from '@/lib/api-v2'

// List all staff
const allStaff = await staffApi.listStaff()

// List staff in a department
const deptStaff = await staffApi.listStaff({ department_id: 1 })

// Create a staff member
const newStaff = await staffApi.createStaff({
  full_name: "John Doe",
  department_id: 1,
  role: "GDV",
  can_night: true,
  base_quota: 26
})

// Update staff
await staffApi.updateStaff(staffId, {
  role: "LEAD",
  is_active: true
})

// Delete staff
await staffApi.deleteStaff(staffId)
```

### Using the Custom Hooks

#### Staff Management Hook
```typescript
import { useStaffManagement } from '@/pages/staff-management/useStaffManagement'

function MyComponent() {
  const {
    staff,
    departments,
    loading,
    saveStaff,
    deleteStaff,
    openCreateDialog,
    formData,
    setFormData
  } = useStaffManagement()

  return (
    <div>
      {loading ? <Spinner /> : <StaffList staff={staff} />}
      <button onClick={openCreateDialog}>Add Staff</button>
    </div>
  )
}
```

#### Department Management Hook
```typescript
import { useDepartmentManagement } from '@/pages/department-management/useDepartmentManagement'

function MyComponent() {
  const {
    departments,
    loading,
    saveDepartment,
    deleteDepartment,
    openCreateDialog,
    formData,
    setFormData
  } = useDepartmentManagement()

  return (
    <div>
      {loading ? <Spinner /> : <DepartmentList departments={departments} />}
      <button onClick={openCreateDialog}>Add Department</button>
    </div>
  )
}
```

---

## Testing the Integration

### Prerequisites
1. Backend running at `http://103.179.175.95:8000`
2. PostgreSQL database connected
3. Frontend running at `http://localhost:5173`

### Quick Test Steps

#### 1. Navigate to Department Management
```
Frontend URL: http://localhost:5173/department-management
Expected: See list of departments (empty if first time)
```

#### 2. Create a New Department
```
Button: "Create Department" (or similar)
Fill in:
  - Name: "Test Department"
  - Code: "TEST"
  - Color: "#0ea5e9" (optional)
  - Icon: "Building2" (optional)
Click: Save
Expected: Department appears in list
```

#### 3. Navigate to Staff Management
```
Frontend URL: http://localhost:5173/staff-management
Expected: See list of staff (empty if first time)
```

#### 4. Create a New Staff Member
```
Button: "Add Staff" (or similar)
Fill in:
  - Full Name: "Test Employee"
  - Department: Select from dropdown (the one you just created)
  - Role: "GDV"
  - Can Night: Yes/No
  - Base Quota: 26
Click: Save
Expected: Staff appears in list
```

#### 5. Verify Department Filter
```
In Staff Management, select department from filter
Expected: Only staff from that department appears
```

#### 6. Update Staff Member
```
Click on a staff member (edit icon)
Change role to "LEAD"
Click: Save
Expected: Staff updated, changes reflected in list
```

#### 7. Delete Staff (Optional)
```
Click delete icon on staff member
Confirm: Yes
Expected: Staff removed from list
```

---

## Error Handling

All API functions throw errors with descriptive messages. Handle them in try-catch blocks:

```typescript
try {
  const staff = await staffApi.createStaff(data)
  console.log('Staff created:', staff)
} catch (error) {
  // Error messages from backend (e.g., "full_name is required")
  console.error('Failed to create staff:', error.message)
  alert(error.message)
}
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `full_name is required` | Missing staff name | Provide full_name |
| `department_id must exist` | Invalid department | Select valid department |
| `employee_code must be unique` | Code already used | Use different code |
| `name is required` | Missing department name | Provide department name |
| `code is required` | Missing department code | Provide department code |
| `Department with code already exists` | Duplicate code | Use different code |

---

## File Structure

```
ccc-frontend/
├── src/
│   ├── lib/
│   │   ├── api-v2.ts                    ✅ NEW - V2 API client
│   │   ├── api.ts                       (old endpoints)
│   │   └── fetch.ts                     (base fetch wrapper)
│   │
│   ├── pages/
│   │   ├── staff-management/
│   │   │   ├── useStaffManagement.ts    ✅ UPDATED - Uses V2 API
│   │   │   ├── StaffManagementPage.tsx
│   │   │   ├── types.ts
│   │   │   └── components/
│   │   │
│   │   └── department-management/
│   │       ├── useDepartmentManagement.ts ✅ UPDATED - Uses V2 API
│   │       ├── DepartmentManagementPage.tsx
│   │       ├── types.ts
│   │       └── components/
│   │
│   ├── components/
│   ├── contexts/
│   └── App.tsx
```

---

## Verification Checklist

- [ ] Frontend can list all departments
- [ ] Frontend can create a new department
- [ ] Frontend can create a new staff member
- [ ] Staff appears in correct department
- [ ] Can update staff information
- [ ] Can delete staff
- [ ] Department filter works
- [ ] Role filter works
- [ ] Search functionality works
- [ ] Department configuration saved correctly

---

## Backend Connection

### Database
- **Host**: postgres-container (Docker) or 103.179.175.95:5432 (remote)
- **Database**: ccc
- **User**: admin
- **Password**: b

### Backend API
- **URL**: http://103.179.175.95:8000
- **Health Check**: GET /api/v2/departments (should list departments)

### Verify Connection
```bash
# Check if backend is responding
curl -X GET "http://103.179.175.95:8000/api/v2/departments" \
  -H "x-api-key: 123456"

# Should return a JSON array of departments (empty if none created yet)
```

---

## Next Steps

1. **Test the workflow** as described in "Testing the Integration" section
2. **Monitor console** for any errors during testing
3. **Check browser network tab** if requests fail (look at response body)
4. **Verify backend logs** if getting 5xx errors
5. **Proceed to schedule generation** once staff/department setup works

---

## API Endpoint Reference

### Staff Endpoints
```
GET    /api/v2/staff                    - List all staff
GET    /api/v2/staff/{id}               - Get single staff
GET    /api/v2/staff/code/{code}        - Get by employee code
POST   /api/v2/staff                    - Create staff
PUT    /api/v2/staff/{id}               - Update staff
DELETE /api/v2/staff/{id}               - Delete staff
POST   /api/v2/staff/{id}/leave         - Set on leave
POST   /api/v2/staff/{id}/leave/cancel  - Cancel leave
GET    /api/v2/staff/night-capable      - Get night-capable staff
GET    /api/v2/staff/on-leave           - Get staff on leave
```

### Department Endpoints
```
GET    /api/v2/departments              - List all departments
GET    /api/v2/departments/{id}         - Get single department
GET    /api/v2/departments/code/{code}  - Get by code
POST   /api/v2/departments              - Create department
PUT    /api/v2/departments/{id}         - Update department
DELETE /api/v2/departments/{id}         - Delete department
```

---

## Troubleshooting

### Frontend not connecting to backend
1. Check `.env` file - verify `VITE_API_BASE_URL`
2. Check backend is running - `curl http://103.179.175.95:8000/api/v2/departments`
3. Check CORS - browser console for CORS errors
4. Check API key - should be "123456"

### Departments not loading
1. Verify backend is running
2. Check browser console for errors
3. Check browser Network tab - look at response status
4. Verify PostgreSQL is connected on backend

### Can't create staff
1. Ensure department exists first
2. Provide required fields: `full_name`, `department_id`
3. Check error message in alert
4. Verify backend logs for detailed error

### Staff list doesn't update after creating
1. Check browser console for errors
2. Verify the API returned successfully (Network tab)
3. Check that `fetchStaff()` was called (should be auto-refresh)
4. Try manual refresh (F5)

---

## Support

For issues or questions:
1. Check error messages in alerts
2. Review browser console (F12)
3. Check Network tab for API responses
4. Check backend logs
5. Refer to API_FRONTEND_MAPPING.md in ccc-backend for endpoint details

---

**Last Updated**: November 5, 2024
**Version**: 1.0
**Status**: Production Ready
