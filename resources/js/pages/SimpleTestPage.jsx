import React from 'react';

const SimpleTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Página de Prueba Simple</h1>
        <p className="text-gray-600 mb-4">
          Esta es una página de prueba para verificar que el sistema funciona correctamente.
        </p>
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ La página se está renderizando correctamente
        </div>
      </div>
    </div>
  );
};

export default SimpleTestPage;
