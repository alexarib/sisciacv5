import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Componente de Login simplificado
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Simular login por ahora
      setTimeout(() => {
        setMessage('✅ Login simulado exitoso');
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage('❌ Error en el login');
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        maxWidth: '400px', 
        width: '100%' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>🌱 SISCIAC</h1>
          <p style={{ color: '#718096' }}>Sistema de Información de Cultivos</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Usuario:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#a0aec0' : '#4299e1',
              color: 'white',
              padding: '0.75rem',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {message && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '4px',
            background: message.includes('✅') ? '#f0fff4' : '#fed7d7',
            color: message.includes('✅') ? '#22543d' : '#c53030',
            border: `1px solid ${message.includes('✅') ? '#9ae6b4' : '#feb2b2'}`
          }}>
            {message}
          </div>
        )}

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', color: '#718096' }}>
            <strong>Credenciales de prueba:</strong><br />
            Usuario: admin | Clave: admin123
          </p>
        </div>
      </div>
    </div>
  );
};

// Dashboard simplificado
const Dashboard = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#2d3748', marginBottom: '2rem' }}>🌱 SISCIAC - Dashboard</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>🌾 Gestión de Cultivos</h3>
            <p style={{ color: '#718096' }}>Control completo del ciclo de vida de tus cultivos.</p>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>👥 Gestión de Productores</h3>
            <p style={{ color: '#718096' }}>Administra información de productores y sus cultivos.</p>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>📊 Reportes y Análisis</h3>
            <p style={{ color: '#718096' }}>Genera reportes detallados y análisis estadísticos.</p>
          </div>
          
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>🗺️ Mapa Interactivo</h3>
            <p style={{ color: '#718096' }}>Visualiza la ubicación de cultivos y productores.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/producer" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
