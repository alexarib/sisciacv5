import React from 'react';

function App() {
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
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '20px' }}>🎉 ¡React Funciona!</h1>
        <p style={{ color: '#7f8c8d', fontSize: '16px', marginBottom: '20px' }}>
          El sistema SISCIAC se está renderizando correctamente.
        </p>
        <div style={{
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ✅ React está funcionando correctamente<br/>
          ✅ El sistema se está cargando<br/>
          ✅ No hay páginas en blanco<br/>
          ✅ El div #app se está renderizando
        </div>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => {
              alert('✅ React y JavaScript funcionan correctamente!');
            }}
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Probar React
          </button>
          <button
            onClick={() => {
              window.location.href = '/test-basic';
            }}
            style={{
              backgroundColor: '#27ae60',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Ir a Prueba Básica
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
