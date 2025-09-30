import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TestAuthPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testAPI = async (endpoint, description) => {
    try {
      const response = await axios.get(`/api/${endpoint}`);
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || error.message, 
        status: error.response?.status 
      };
    }
  };

  const runTests = async () => {
    setLoading(true);
    const results = {};

    // Test 1: Verificar autenticación
    results.auth = {
      isAuthenticated,
      user: user,
      token: localStorage.getItem('sisciac_token')
    };

    // Test 2: Verificar headers de axios
    results.axiosHeaders = {
      authorization: axios.defaults.headers.common['Authorization'],
      contentType: axios.defaults.headers.common['Content-Type']
    };

    // Test 3: Probar endpoint de cultivos
    results.crops = await testAPI('crops', 'Cultivos');

    // Test 4: Probar endpoint de productores
    results.producers = await testAPI('producers', 'Productores');

    // Test 5: Probar endpoint de autenticación
    results.authMe = await testAPI('auth/me', 'Autenticación');

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 Prueba de Autenticación y API</h1>
        
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-800">Ejecutando pruebas...</span>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Estado de Autenticación */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔐 Estado de Autenticación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Autenticado:</p>
                <p className={`font-medium ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthenticated ? '✅ Sí' : '❌ No'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Token:</p>
                <p className="font-medium text-gray-900">
                  {localStorage.getItem('sisciac_token') ? '✅ Presente' : '❌ Ausente'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Usuario:</p>
                <p className="font-medium text-gray-900">
                  {user ? user.name || user.email : '❌ No disponible'}
                </p>
              </div>
            </div>
          </div>

          {/* Headers de Axios */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Headers de Axios</h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Authorization:</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {axios.defaults.headers.common['Authorization'] || 'No configurado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Content-Type:</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {axios.defaults.headers.common['Content-Type'] || 'No configurado'}
                </p>
              </div>
            </div>
          </div>

          {/* Resultados de API */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🌐 Pruebas de API</h2>
            <div className="space-y-4">
              {/* Cultivos */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Cultivos (/api/crops)</h3>
                <div className={`p-3 rounded-lg ${testResults.crops?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-sm">
                    <span className={`font-medium ${testResults.crops?.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults.crops?.success ? '✅ Éxito' : '❌ Error'}
                    </span>
                    {testResults.crops?.status && ` (${testResults.crops.status})`}
                  </p>
                  {testResults.crops?.success && (
                    <p className="text-sm text-green-700 mt-1">
                      Datos recibidos: {Array.isArray(testResults.crops.data) ? testResults.crops.data.length : 'Objeto'} elementos
                    </p>
                  )}
                  {!testResults.crops?.success && (
                    <p className="text-sm text-red-700 mt-1">
                      Error: {JSON.stringify(testResults.crops?.error)}
                    </p>
                  )}
                </div>
              </div>

              {/* Productores */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Productores (/api/producers)</h3>
                <div className={`p-3 rounded-lg ${testResults.producers?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-sm">
                    <span className={`font-medium ${testResults.producers?.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults.producers?.success ? '✅ Éxito' : '❌ Error'}
                    </span>
                    {testResults.producers?.status && ` (${testResults.producers.status})`}
                  </p>
                  {testResults.producers?.success && (
                    <p className="text-sm text-green-700 mt-1">
                      Datos recibidos: {Array.isArray(testResults.producers.data) ? testResults.producers.data.length : 'Objeto'} elementos
                    </p>
                  )}
                  {!testResults.producers?.success && (
                    <p className="text-sm text-red-700 mt-1">
                      Error: {JSON.stringify(testResults.producers?.error)}
                    </p>
                  )}
                </div>
              </div>

              {/* Auth Me */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Autenticación (/api/auth/me)</h3>
                <div className={`p-3 rounded-lg ${testResults.authMe?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-sm">
                    <span className={`font-medium ${testResults.authMe?.success ? 'text-green-800' : 'text-red-800'}`}>
                      {testResults.authMe?.success ? '✅ Éxito' : '❌ Error'}
                    </span>
                    {testResults.authMe?.status && ` (${testResults.authMe.status})`}
                  </p>
                  {testResults.authMe?.success && (
                    <p className="text-sm text-green-700 mt-1">
                      Usuario autenticado correctamente
                    </p>
                  )}
                  {!testResults.authMe?.success && (
                    <p className="text-sm text-red-700 mt-1">
                      Error: {JSON.stringify(testResults.authMe?.error)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botón de recarga */}
          <div className="text-center">
            <button
              onClick={runTests}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              🔄 Ejecutar Pruebas Nuevamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuthPage;
