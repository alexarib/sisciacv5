import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TestCropsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Intentando cargar cultivos...');
        console.log('👤 Usuario:', user);
        console.log('🔐 Autenticado:', isAuthenticated);
        console.log('📋 Headers:', axios.defaults.headers.common);
        
        const response = await axios.get('/api/crops');
        console.log('✅ Respuesta de cultivos:', response.data);
        
        setCrops(response.data);
      } catch (err) {
        console.error('❌ Error cargando cultivos:', err);
        setError(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, [user, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cultivos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold">Error al cargar cultivos</h3>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🌱 Prueba de Cultivos</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Estado de Autenticación</h3>
              <p className="text-blue-700">
                {isAuthenticated ? '✅ Autenticado' : '❌ No autenticado'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Usuario</h3>
              <p className="text-green-700">
                {user ? `${user.name} (${user.role})` : 'No disponible'}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Cultivos Cargados</h3>
              <p className="text-purple-700">
                {Array.isArray(crops) ? crops.length : 'Error en formato'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Lista de Cultivos</h2>
          </div>
          
          <div className="p-6">
            {Array.isArray(crops) && crops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crops.map((crop) => (
                  <div key={crop.id} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                    <p className="text-gray-600">Productor: {crop.producer?.name || 'N/A'}</p>
                    <p className="text-gray-600">Área: {crop.area} ha</p>
                    <p className="text-gray-600">Estado: {crop.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay cultivos disponibles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCropsPage;
