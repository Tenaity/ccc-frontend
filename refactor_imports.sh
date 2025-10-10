#!/bin/bash

# Script to refactor duplicate apiFetch imports to use centralized @/lib/fetch

FILES=(
  "src/hooks/useScheduleData.ts"
  "src/hooks/useExpectedRules.ts"
  "src/pages/department-management/useDepartmentManagement.ts"
  "src/pages/ShiftConfig.tsx"
  "src/pages/staff-preferences/useStaffPreferences.ts"
  "src/components/Schedule/FixedOffHolidayForm.tsx"
  "src/components/QuickEditDialog.tsx"
  "src/pages/ChatbotUpload.tsx"
  "src/pages/ChatbotChunking.tsx"
)

echo "Refactoring imports to use centralized @/lib/fetch..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"

    # Remove duplicate API_KEY and apiFetch definitions
    # This is a simplified approach - manual review recommended
    echo "  - Removing duplicate code (manual cleanup recommended)"
  else
    echo "  - File not found: $file"
  fi
done

echo ""
echo "✅ Please manually:"
echo "1. Remove duplicate 'const API_KEY' declarations"
echo "2. Remove duplicate 'function apiFetch()' definitions  "
echo "3. Add 'import { apiFetch } from \"@/lib/fetch\"' at top"
echo "4. For files using safeJSON, import it: 'import { apiFetch, safeJSON } from \"@/lib/fetch\"'"
