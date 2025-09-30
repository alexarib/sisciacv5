import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import ProducerDashboard from './pages/ProducerDashboard';
import ProducerCropsPage from './pages/ProducerCropsPage';
import ProducerTrainingsPage from './pages/ProducerTrainingsPage';
import ProducerLogisticsPage from './pages/ProducerLogisticsPage';
import ProducerProfilePage from './pages/ProducerProfilePage';
import ProducersPage from './pages/ProducersPage';
import CropsPage from './pages/CropsPage';
import MapPage from './pages/MapPage';
import SuppliesPage from './pages/SuppliesPage';
import TrainingPage from './pages/TrainingPage';
import CommercePage from './pages/CommercePage';
import ReportsPage from './pages/ReportsPage';
import LogisticsPage from './pages/LogisticsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ?
              <Navigate to={user?.role === 'admin' ? '/admin' : '/producer'} replace /> :
              <LoginPage />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer"
          element={
            <ProtectedRoute allowedRoles={['producer']}>
              <ProducerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/crops"
          element={
            <ProtectedRoute allowedRoles={['producer']}>
              <ProducerCropsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/trainings"
          element={
            <ProtectedRoute allowedRoles={['producer']}>
              <ProducerTrainingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/logistics"
          element={
            <ProtectedRoute allowedRoles={['producer']}>
              <ProducerLogisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producer/profile"
          element={
            <ProtectedRoute allowedRoles={['producer']}>
              <ProducerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/producers"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProducersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crops"
          element={
            <ProtectedRoute allowedRoles={['admin', 'producer']}>
              <CropsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute allowedRoles={['admin', 'producer']}>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplies"
          element={
            <ProtectedRoute allowedRoles={['admin', 'producer']}>
              <SuppliesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/training"
          element={
            <ProtectedRoute allowedRoles={['admin', 'producer']}>
              <TrainingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/commerce"
          element={
            <ProtectedRoute allowedRoles={['admin', 'producer']}>
              <CommercePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logistics"
          element={
            <ProtectedRoute allowedRoles={['admin', 'producer']}>
              <LogisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['admin', 'producer']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <Navigate to={
              isAuthenticated ?
                (user?.role === 'admin' ? '/admin' : '/producer') :
                '/login'
            } replace />
          }
        />
      </Routes>
  );
}

function App() {
  return (
    <Router>
      <Helmet>
        <title>SISCIAC - Sistema de Información de Cultivos y Asistencia Comunitaria</title>
        <meta name="description" content="Plataforma integral para el control y gestión de procesos agrícolas. Conectando productores, comunidades y gobierno para una agricultura sostenible." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 font-sans">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App; 