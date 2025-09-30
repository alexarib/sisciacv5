import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('=== DEBUG APP LOADING ===');
console.log('React version:', React.version);
console.log('ReactDOM version:', ReactDOM.version);
console.log('Document ready state:', document.readyState);
console.log('App element:', document.getElementById('app'));

// Componente de diagnóstico
const DebugApp = () => {
    console.log('DebugApp component rendering');

    return (
        <div style={{
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f0f8ff',
            minHeight: '100vh'
        }}>
            <h1 style={{ color: 'green', textAlign: 'center' }}>
                ✅ React está funcionando correctamente
            </h1>

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h2>🔍 Diagnóstico de la Aplicación</h2>

                <div style={{ marginTop: '20px' }}>
                    <h3>📅 Fecha y Hora:</h3>
                    <p>{new Date().toLocaleString()}</p>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h3>🌐 Información del Navegador:</h3>
                    <ul>
                        <li><strong>URL:</strong> {window.location.href}</li>
                        <li><strong>User Agent:</strong> {navigator.userAgent}</li>
                        <li><strong>Document Ready State:</strong> {document.readyState}</li>
                    </ul>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '5px' }}>
                    <h3>🎯 Estado de la Aplicación:</h3>
                    <ul>
                        <li>✅ React cargado correctamente</li>
                        <li>✅ ReactDOM funcionando</li>
                        <li>✅ JavaScript ejecutándose</li>
                        <li>✅ Componente renderizado</li>
                        <li>✅ Elemento #app encontrado</li>
                    </ul>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                    <h3>⚠️ Próximos Pasos:</h3>
                    <p>Si puedes ver este mensaje, React está funcionando correctamente. El problema debe estar en:</p>
                    <ol>
                        <li>El contexto de autenticación (AuthContext)</li>
                        <li>El enrutamiento (React Router)</li>
                        <li>Los componentes de las páginas</li>
                        <li>Las importaciones de dependencias</li>
                    </ol>
                </div>

                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '5px' }}>
                    <h3>🚨 Posibles Errores:</h3>
                    <p>Revisa la consola del navegador para ver si hay errores de:</p>
                    <ul>
                        <li>Importaciones de módulos</li>
                        <li>Contexto de autenticación</li>
                        <li>Enrutamiento</li>
                        <li>Dependencias faltantes</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

// Renderizar la aplicación
const rootElement = document.getElementById('app');
console.log('Root element found:', rootElement);

if (rootElement) {
    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    console.log('Rendering DebugApp...');
    root.render(
        <React.StrictMode>
            <DebugApp />
        </React.StrictMode>
    );
    console.log('DebugApp rendered successfully');
} else {
    console.error('Root element #app not found!');
    document.body.innerHTML = '<div style="padding: 20px; color: red; font-family: Arial, sans-serif;"><h1>❌ Error: Elemento #app no encontrado</h1><p>El elemento con ID "app" no existe en el DOM.</p></div>';
} 