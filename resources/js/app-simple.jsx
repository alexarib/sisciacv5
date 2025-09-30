import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Simple components
const SimpleLoginPage = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2d3748' }}>🌱 SISCIAC</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#4a5568' }}>Iniciar Sesión</h2>
      <form>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Usuario:</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '4px' }}
            placeholder="Ingresa tu usuario"
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contraseña:</label>
          <input 
            type="password" 
            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '4px' }}
            placeholder="Ingresa tu contraseña"
          />
        </div>
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            background: '#4299e1', 
            color: 'white', 
            padding: '0.75rem', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  </div>
);

const SimpleDashboard = () => (
  <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#2d3748', marginBottom: '2rem' }}>🌱 SISCIAC - Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>🌾 Gestión de Cultivos</h3>
          <p style={{ color: '#718096' }}>Control completo del ciclo de vida de tus cultivos.</p>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>👥 Gestión de Productores</h3>
          <p style={{ color: '#718096' }}>Administra información de productores y sus cultivos.</p>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>📊 Reportes y Análisis</h3>
          <p style={{ color: '#718096' }}>Genera reportes detallados y análisis estadísticos.</p>
        </div>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>🗺️ Mapa Interactivo</h3>
          <p style={{ color: '#718096' }}>Visualiza la ubicación de cultivos y productores.</p>
        </div>
      </div>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<SimpleLoginPage />} />
      <Route path="/admin" element={<SimpleDashboard />} />
      <Route path="/producer" element={<SimpleDashboard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <Helmet>
        <title>SISCIAC - Sistema de Información de Cultivos y Asistencia Comunitaria</title>
        <meta name="description" content="Plataforma integral para el control y gestión de procesos agrícolas." />
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