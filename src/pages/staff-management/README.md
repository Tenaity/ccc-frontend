# Staff Management

- **Entry point:** `StaffManagementPage.tsx`
  - Tổng hợp header trang, thống kê, bộ lọc, bảng và dialog.
  - Lắng nghe state từ hook `useStaffManagement`.
- **Hook chính:** `useStaffManagement.ts`
  - Đọc `selectedDepartmentId` từ `DepartmentContext` để lọc dữ liệu.
  - Fetch `/api/staff` và `/api/departments`, quản lý lọc theo từ khoá/chức danh.
  - Xử lý form thêm/sửa, xoá nhân sự (`openCreateDialog`, `openEditDialog`, `saveStaff`, `deleteStaff`).
  - Tính toán KPI: tổng nhân sự, số người có thể trực đêm, quota trung bình.
- **Component con:**
  - `components/StaffStats.tsx` – các ô KPI.
  - `components/StaffFilters.tsx` – tìm kiếm & filter role, nút tạo mới.
  - `components/StaffTable.tsx` – bảng danh sách kèm empty state.
  - `components/StaffDialog.tsx` – dialog CRUD nhân sự.
