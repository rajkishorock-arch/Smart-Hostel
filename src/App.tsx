import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { WardenRegisterPage } from './pages/admin/WardenRegisterPage';

// Warden Portal Pages
import { WardenOverviewPage } from './pages/admin/WardenOverviewPage';
import { HostelOverviewPage } from './pages/admin/HostelOverviewPage';
import { HostelRoomsPage } from './pages/admin/HostelRoomsPage';
import { HostelAllocationPage } from './pages/admin/HostelAllocationPage';
import { HostelResidentsPage } from './pages/admin/HostelResidentsPage';
import { HostelBlocksPage } from './pages/admin/HostelBlocksPage';
import { MessOverviewPage } from './pages/admin/MessOverviewPage';
import { MessTodayPage } from './pages/admin/MessTodayPage';
import { MessWeeklyPage } from './pages/admin/MessWeeklyPage';
import { MessSchedulePage } from './pages/admin/MessSchedulePage';
import { MessAnnouncementsPage } from './pages/admin/MessAnnouncementsPage';
import { MaintenanceOverviewPage } from './pages/admin/MaintenanceOverviewPage';
import { MaintenanceTicketsPage } from './pages/admin/MaintenanceTicketsPage';
import { MaintenanceResolutionPage } from './pages/admin/MaintenanceResolutionPage';
import { MaintenanceCategoriesPage } from './pages/admin/MaintenanceCategoriesPage';
import { PredictiveAnalyticsPage } from './pages/admin/PredictiveAnalyticsPage';
import { AdvancedReportsPage } from './pages/admin/AdvancedReportsPage';
import { PreventiveMaintenancePage } from './pages/admin/PreventiveMaintenancePage';
import { BillingManagementPage } from './pages/admin/BillingManagementPage';
import { SmartInfrastructurePage } from './pages/admin/SmartInfrastructurePage';
import { VendorManagementPage } from './pages/admin/VendorManagementPage';

// Resident Portal Pages
import { ResidentOverviewPage } from './pages/resident/ResidentOverviewPage';
import { ResidentBillingPage } from './pages/resident/ResidentBillingPage';
import { ResidentRoomPage } from './pages/resident/ResidentRoomPage';
import { ResidentAllocationPage } from './pages/resident/ResidentAllocationPage';
import { ResidentMessTodayPage } from './pages/resident/ResidentMessTodayPage';
import { ResidentMessWeeklyPage } from './pages/resident/ResidentMessWeeklyPage';
import { ResidentAnnouncementsPage } from './pages/resident/ResidentAnnouncementsPage';
import { ResidentReportIssuePage } from './pages/resident/ResidentReportIssuePage';
import { ResidentTicketsPage } from './pages/resident/ResidentTicketsPage';
import { ResidentProfilePage } from './pages/resident/ResidentProfilePage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/warden/register" element={<WardenRegisterPage />} />
          <Route path="/admin/register" element={<WardenRegisterPage />} />

          {/* ============================================================ */}
          {/* WARDEN PORTAL ROUTES (Protected: allowedRole="warden")        */}
          {/* ============================================================ */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="warden">
                <WardenOverviewPage />
              </ProtectedRoute>
            }
          />

          {/* Hostel Management */}
          <Route
            path="/admin/hostel"
            element={
              <ProtectedRoute allowedRole="warden">
                <HostelOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hostel/rooms"
            element={
              <ProtectedRoute allowedRole="warden">
                <HostelRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hostel/allocation"
            element={
              <ProtectedRoute allowedRole="warden">
                <HostelAllocationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hostel/residents"
            element={
              <ProtectedRoute allowedRole="warden">
                <HostelResidentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hostel/blocks"
            element={
              <ProtectedRoute allowedRole="warden">
                <HostelBlocksPage />
              </ProtectedRoute>
            }
          />

          {/* Smart Mess Management */}
          <Route
            path="/admin/mess"
            element={
              <ProtectedRoute allowedRole="warden">
                <MessOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mess/today"
            element={
              <ProtectedRoute allowedRole="warden">
                <MessTodayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mess/weekly"
            element={
              <ProtectedRoute allowedRole="warden">
                <MessWeeklyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mess/schedule"
            element={
              <ProtectedRoute allowedRole="warden">
                <MessSchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/mess/announcements"
            element={
              <ProtectedRoute allowedRole="warden">
                <MessAnnouncementsPage />
              </ProtectedRoute>
            }
          />

          {/* Maintenance Management */}
          <Route
            path="/admin/maintenance"
            element={
              <ProtectedRoute allowedRole="warden">
                <MaintenanceOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/maintenance/tickets"
            element={
              <ProtectedRoute allowedRole="warden">
                <MaintenanceTicketsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/maintenance/resolution"
            element={
              <ProtectedRoute allowedRole="warden">
                <MaintenanceResolutionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/maintenance/categories"
            element={
              <ProtectedRoute allowedRole="warden">
                <MaintenanceCategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/maintenance/preventive"
            element={
              <ProtectedRoute allowedRole="warden">
                <PreventiveMaintenancePage />
              </ProtectedRoute>
            }
          />

          {/* Intelligence & Analytics Suite */}
          <Route
            path="/admin/analytics/predictive"
            element={
              <ProtectedRoute allowedRole="warden">
                <PredictiveAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics/reports"
            element={
              <ProtectedRoute allowedRole="warden">
                <AdvancedReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/finance/billing"
            element={
              <ProtectedRoute allowedRole="warden">
                <BillingManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/iot/infrastructure"
            element={
              <ProtectedRoute allowedRole="warden">
                <SmartInfrastructurePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute allowedRole="warden">
                <VendorManagementPage />
              </ProtectedRoute>
            }
          />


          {/* ============================================================ */}
          {/* RESIDENT PORTAL ROUTES (Protected: allowedRole="resident")    */}
          {/* ============================================================ */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentOverviewPage />
              </ProtectedRoute>
            }
          />

          {/* My Hostel */}
          <Route
            path="/resident/room"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/allocation"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentAllocationPage />
              </ProtectedRoute>
            }
          />

          {/* Smart Mess */}
          <Route
            path="/resident/mess/today"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentMessTodayPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/mess/weekly"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentMessWeeklyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/announcements"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentAnnouncementsPage />
              </ProtectedRoute>
            }
          />

          {/* Maintenance */}
          <Route
            path="/resident/maintenance/report"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentReportIssuePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/maintenance/tickets"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentTicketsPage />
              </ProtectedRoute>
            }
          />

          {/* Account Profile */}
          <Route
            path="/resident/profile"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resident/billing"
            element={
              <ProtectedRoute allowedRole="resident">
                <ResidentBillingPage />
              </ProtectedRoute>
            }
          />

          {/* Safe Aliases */}
          <Route path="/warden" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/resident" element={<Navigate to="/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
