import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContextDebug';
import Toaster from './components/ui/Toaster';
import 'react-toastify/dist/ReactToastify.css';
import '../css/app.css';

console.log('=== MAIN DEBUG LOADING ===');

// Componente de login simple
const SimpleLoginPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt with:', username, password);
        setIsLoading(true);

        // Simular login
        setTimeout(() => {
            setIsLoading(false);
            alert('Login simulado exitoso!');
        }, 1000);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f8ff'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #e3e3e3',
                        borderTop: '4px solid #3498db',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <p>Cargando aplicación...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f0f8ff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>SISCIAC</h1>
                    <p style={{ color: '#7f8c8d', fontSize: '16px' }}>
                        Sistema de Información de Cultivos y Asistencia Comunitaria
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: 'bold' }}>
                            Usuario
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e3e3e3',
                                borderRadius: '5px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Ingresa tu usuario"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#2c3e50', fontWeight: 'bold' }}>
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e3e3e3',
                                borderRadius: '5px',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            backgroundColor: isLoading ? '#bdc3c7' : '#3498db',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s'
                        }}
                        onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#2980b9')}
                        onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#3498db')}
                    >
                        {isLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
                        ¿No tienes cuenta? <a href="#" style={{ color: '#3498db', textDecoration: 'none' }}>Regístrate aquí</a>
                    </p>
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

// Componente principal simplificado
const SimpleApp = () => {
    console.log('SimpleApp: Rendering');
    return <SimpleLoginPage />;
};

// Renderizar la aplicación
const rootElement = document.getElementById('app');
console.log('Root element found:', rootElement);

if (rootElement) {
    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    console.log('Rendering SimpleApp...');
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <SimpleApp />
                    <Toaster />
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
    console.log('SimpleApp rendered successfully');
} else {
    console.error('Root element #app not found!');
} 