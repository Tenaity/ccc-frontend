# Department Management

- **Entry point:** `DepartmentManagementPage.tsx`
  - Hiển thị tiêu đề, thống kê KPI và điều khiển chung.
  - Kết nối với hook `useDepartmentManagement` để lấy dữ liệu và xử lý CRUD.
- **Hook chính:** `useDepartmentManagement.ts`
  - Gọi `/api/departments` để tải danh sách bộ phận.
  - Quản lý trạng thái dialog, form và thống kê (tổng bộ phận, nhân sự, ca).
  - Cung cấp hàm `openCreateDialog`, `openEditDialog`, `saveDepartment`, `deleteDepartment`.
- **Component con:**
  - `components/DepartmentStats.tsx` – hiển thị 3 ô KPI.
  - `components/DepartmentGrid.tsx` – lưới thẻ phòng ban với nút sửa/xoá.
  - `components/DepartmentDialog.tsx` – modal chỉnh sửa/tạo mới, xử lý chọn icon & màu.
- **Hằng số & util:**
  - `constants.ts` – danh sách icon, palette màu và form mặc định.
  - `utils.ts` – map tên icon sang component `lucide-react`.
