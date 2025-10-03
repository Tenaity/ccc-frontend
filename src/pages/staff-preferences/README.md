# Staff Preferences

- **Entry point:** `StaffPreferencesPage.tsx`
  - Hiển thị header, selector nhân sự, tab cấu hình và thanh hành động.
  - Kết nối logic từ `useStaffPreferences`.
- **Hook chính:** `useStaffPreferences.ts`
  - Fetch danh sách nhân sự theo `selectedDepartmentId` và tải ưu tiên của từng người.
  - Reset lựa chọn khi chuyển phòng ban để tránh cập nhật sai dữ liệu.
  - Cung cấp các handler: `handleSelectStaff`, `toggleShiftPreference`, `toggleDayOff`, `updateMaxConsecutiveDays`, `resetPreferences`, `savePreferences`.
- **Component con:**
  - `components/StaffSelector.tsx` – dropdown chọn nhân sự.
  - `components/ShiftPreferencesSection.tsx` – bật/tắt các ca ưu tiên.
  - `components/DayOffPreferencesSection.tsx` – chọn ngày nghỉ ưu tiên.
  - `components/ConstraintsSection.tsx` – chỉnh giới hạn ngày làm liên tiếp.
- **Hằng số & util:**
  - `constants.ts` – danh sách ngày trong tuần, ca làm và state mặc định.
  - `utils.ts` – resolve icon ca trực (`lucide-react`).
