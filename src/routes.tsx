import React, { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { DepartmentSwitcher } from "@/components/DepartmentSwitcher"

import DashboardPage from "./pages/Dashboard"

// Lazy load pages
const SchedulePage = lazy(() => import("./pages/schedule/Schedule"))
const ChatbotCRUDPage = lazy(() => import("./pages/chatbot/ChatbotCRUD"))
const ChatbotDataManagementPage = lazy(() => import("./pages/chatbot/ChatbotDataManagement"))
const ChatbotUploadPage = lazy(() => import("./pages/chatbot/ChatbotUpload"))
const ChatbotChunkingPage = lazy(() => import("./pages/chatbot/ChatbotChunking"))
const ConfigPage = lazy(() => import("./pages/schedule/Config"))
const DepartmentManagementPage = lazy(() => import("./pages/DepartmentManagement"))
const ShiftConfigPage = lazy(() => import("./pages/schedule/ShiftConfig"))
const StaffManagementPage = lazy(() => import("./pages/StaffManagement"))
const StaffPreferencesPage = lazy(() => import("./pages/StaffPreferences"))

export const AppRoutes = () => {
    return (
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col gap-6 px-6 py-6">
            {/* Department Switcher Header */}
            <div className="flex items-center justify-between">
                <DepartmentSwitcher />
            </div>

            <Suspense
                fallback={
                    <div className="mx-auto w-full max-w-[1400px] px-6">
                        <div className="flex justify-center py-10" aria-live="polite">
                            <span className="text-sm text-muted-foreground">
                                Đang tải nội dung…
                            </span>
                        </div>
                    </div>
                }
            >
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/config" element={<ConfigPage />} />
                    <Route path="/departments" element={<DepartmentManagementPage />} />
                    <Route path="/shift-config" element={<ShiftConfigPage />} />
                    <Route path="/staff" element={<StaffManagementPage />} />
                    <Route path="/staff-preferences" element={<StaffPreferencesPage />} />

                    {/* Chatbot Routes */}
                    <Route path="/chatbot" element={<ChatbotCRUDPage />} />
                    <Route path="/chatbot/data" element={<ChatbotDataManagementPage />} />
                    <Route path="/chatbot/upload" element={<ChatbotUploadPage />} />
                    <Route path="/chatbot/chunking" element={<ChatbotChunkingPage />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </div>
    )
}
