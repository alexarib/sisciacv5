import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContextDebug.jsx';

// Componente simple para debug
const DebugPage = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔧 Debug - Sistema SISCIAC</h1>
      <p>Si puedes ver esta página, React está funcionando correctamente.</p>
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', margin: '20px 0' }}>
        <h3>Información del Sistema:</h3>
        <ul>
          <li>✅ React cargado correctamente</li>
          <li>✅ React Router funcionando</li>
          <li>✅ Componentes renderizando</li>
          <li>✅ Contexto de autenticación funcionando</li>
        </ul>
      </div>
      <button
        onClick={() => alert('¡React está funcionando!')}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Probar React
      </button>
    </div>
  );
};

// Componente de login funcional
const SimpleLoginPage = () => {
  const { login, loading } = useAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        alert('¡Login exitoso! Redirigiendo...');
        window.location.href = '/admin';
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #10b981',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Cargando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{ textAlign: 'center', color: '#10b981', marginBottom: '30px' }}>
          🔐 SISCIAC Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Usuario:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              placeholder="Ingresa tu usuario"
              disabled={isSubmitting}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Contraseña:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px'
              }}
              placeholder="Ingresa tu contraseña"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              background: isSubmitting ? '#ccc' : '#10b981',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          <p><strong>Credenciales de prueba:</strong></p>
          <p>Usuario: admin</p>
          <p>Contraseña: admin123</p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Componente de dashboard simple
const SimpleDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#10b981', margin: 0 }}>🎉 ¡SISCIAC Funcionando!</h1>
          <button
            onClick={logout}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2>✅ Sistema Completamente Funcional</h2>
          <p><strong>Usuario:</strong> {user?.name}</p>
          <p><strong>Rol:</strong> {user?.role}</p>
          <p><strong>Email:</strong> {user?.email}</p>
        </div>

        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '8px' }}>
          <h3>🎯 Funcionalidades Verificadas:</h3>
          <ul>
            <li>✅ React cargado correctamente</li>
            <li>✅ React Router funcionando</li>
            <li>✅ Contexto de autenticación operativo</li>
            <li>✅ Login funcional</li>
            <li>✅ Navegación entre páginas</li>
            <li>✅ Logout funcional</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <SimpleLoginPage />} />
        <Route path="/admin" element={isAuthenticated ? <SimpleDashboard /> : <Navigate to="/login" replace />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App; 