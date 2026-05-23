import MainLayout from '@/layouts/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import CompanyProfilePage from '@/pages/CompanyProfilePage.tsx';
import JobDetailPage from '@/pages/JobDetailPage.tsx';
import JobSearchPage from '@/pages/JobSearchPage.tsx';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/jobs" replace />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/job/:id" element={<JobDetailPage />} />
          <Route path="/company/:companyName" element={<CompanyProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
