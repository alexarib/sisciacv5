import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const CropsPage = () => {
  const { user } = useAuth();
  
  const [crops, setCrops] = useState([]);
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Formularios
  const [addForm, setAddForm] = useState({
    producer_id: '', name: '', description: '', area: '', status: 'planted',
    planting_date: '', expected_harvest_date: '', actual_harvest_date: '',
    yield_expected: '', yield_actual: '', variety: '', notes: ''
  });
  const [editForm, setEditForm] = useState({
    producer_id: '', name: '', description: '', area: '', status: 'planted',
    planting_date: '', expected_harvest_date: '', actual_harvest_date: '',
    yield_expected: '', yield_actual: '', variety: '', notes: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('sisciac_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const refreshData = async () => {
    try {
      const [cropsRes, producersRes] = await Promise.all([
        axios.get('/api/crops'),
        axios.get('/api/producers')
      ]);

      const cropsData = cropsRes.data;
      const producersData = producersRes.data;

      setCrops(cropsData.data || cropsData || []);
      setProducers(producersData.data || producersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback a datos simulados
      setCrops(mockCrops);
      setProducers(mockProducers);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, []);

  // Datos simulados (fallback)
  const mockCrops = [
    {
      id: 1,
      name: 'Maíz',
      producer_name: 'Juan Pérez',
      producer_id: 1,
      area: 5.5,
      planting_date: '2024-03-15',
      expected_harvest_date: '2024-07-15',
      actual_harvest_date: null,
      status: 'growing',
      yield_expected: 22.0,
      yield_actual: null,
      location: 'Caracas, Venezuela',
      notes: 'Cultivo de maíz amarillo para consumo local'
    },
    {
      id: 2,
      name: 'Tomate',
      producer_name: 'María González',
      producer_id: 2,
      area: 2.8,
      planting_date: '2024-02-20',
      expected_harvest_date: '2024-05-20',
      actual_harvest_date: '2024-05-18',
      status: 'harvested',
      yield_expected: 14.0,
      yield_actual: 15.2,
      location: 'Valencia, Venezuela',
      notes: 'Tomate cherry para exportación'
    },
    {
      id: 3,
      name: 'Papa',
      producer_name: 'Carlos Rodríguez',
      producer_id: 3,
      area: 3.2,
      planting_date: '2024-04-01',
      expected_harvest_date: '2024-08-01',
      actual_harvest_date: null,
      status: 'growing',
      yield_expected: 16.0,
      yield_actual: null,
      location: 'Maracay, Venezuela',
      notes: 'Papa blanca para procesamiento'
    }
  ];

  const mockProducers = [
    { id: 1, name: 'Juan Pérez' },
    { id: 2, name: 'María González' },
    { id: 3, name: 'Carlos Rodríguez' }
  ];

  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.producer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || crop.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const apiPost = async (url, body = {}) => {
    const response = await axios.post(url, body);
    return response.data;
  };

  const apiPut = async (url, body = {}) => {
    const response = await axios.put(url, body);
    return response.data;
  };

  const handleAddCrop = () => {
    setAddForm({
      producer_id: '', name: '', description: '', area: '', status: 'planted',
      planting_date: '', expected_harvest_date: '', actual_harvest_date: '',
      yield_expected: '', yield_actual: '', variety: '', notes: ''
    });
    setShowAddModal(true);
  };

  const handleEditCrop = (crop) => {
    setEditForm({
      producer_id: crop.producer_id,
      name: crop.name,
      description: crop.description || '',
      area: crop.area,
      status: crop.status,
      planting_date: crop.planting_date,
      expected_harvest_date: crop.expected_harvest_date,
      actual_harvest_date: crop.actual_harvest_date || '',
      yield_expected: crop.yield_expected || '',
      yield_actual: crop.yield_actual || '',
      variety: crop.variety || '',
      notes: crop.notes || ''
    });
    setSelectedCrop(crop);
    setShowEditModal(true);
  };

  const submitAddCrop = async () => {
    try {
      await apiPost('/api/crops', addForm);
      alert('Cultivo agregado exitosamente');
      setShowAddModal(false);
      await refreshData();
    } catch (e) {
      alert('Error: No se pudo agregar el cultivo');
    }
  };

  const submitEditCrop = async () => {
    if (!selectedCrop) return;
    try {
      await apiPut(`/api/crops/${selectedCrop.id}`, editForm);
      alert('Cultivo actualizado exitosamente');
      setShowEditModal(false);
      setSelectedCrop(null);
      await refreshData();
    } catch (e) {
      alert('Error: No se pudo actualizar el cultivo');
    }
  };

  const handleDeleteCrop = async (cropId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cultivo?')) {
      try {
        await axios.delete(`/api/crops/${cropId}`);
        alert('Cultivo eliminado exitosamente');
        await refreshData();
      } catch (e) {
        alert('Error: No se pudo eliminar el cultivo');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'growing':
        return 'bg-blue-100 text-blue-800';
      case 'harvested':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'growing':
        return 'En Crecimiento';
      case 'harvested':
        return 'Cosechado';
      case 'failed':
        return 'Fallido';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
              >
                ← Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Cultivos</h1>
                <p className="text-gray-600">Administra los cultivos del sistema</p>
              </div>
            </div>
            <button
              onClick={handleAddCrop}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              + Agregar Cultivo
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar cultivos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="growing">En Crecimiento</option>
                  <option value="harvested">Cosechados</option>
                  <option value="failed">Fallidos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        🌱
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                        <p className="text-sm text-gray-600">{crop.producer_name}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCrop(crop)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteCrop(crop.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Área:</span>
                      <span className="text-sm font-medium">{crop.area} ha</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Estado:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(crop.status)}`}>
                        {getStatusText(crop.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Ubicación:</span>
                      <span className="text-sm font-medium">{crop.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fecha de siembra:</span>
                      <span className="text-sm font-medium">{new Date(crop.planting_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Cosecha esperada:</span>
                      <span className="text-sm font-medium">{new Date(crop.expected_harvest_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  {crop.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{crop.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  🌱
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cultivos</p>
                  <p className="text-2xl font-semibold text-gray-900">{crops.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  ⏰
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">En Crecimiento</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {crops.filter(c => c.status === 'growing').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  ✅
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cosechados</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {crops.filter(c => c.status === 'harvested').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  📈
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Área Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {crops.reduce((sum, c) => sum + c.area, 0).toFixed(1)} ha
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Agregar Cultivo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Cultivo</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Productor *</label>
                  <select
                    value={addForm.producer_id}
                    onChange={(e) => setAddForm({ ...addForm, producer_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar productor</option>
                    {producers.map(producer => (
                      <option key={producer.id} value={producer.id}>{producer.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nombre del Cultivo *</label>
                  <input
                    type="text"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Área (hectáreas) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={addForm.area}
                    onChange={(e) => setAddForm({ ...addForm, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Estado</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planted">Plantado</option>
                    <option value="growing">En Crecimiento</option>
                    <option value="harvested">Cosechado</option>
                    <option value="failed">Fallido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha de Siembra</label>
                  <input
                    type="date"
                    value={addForm.planting_date}
                    onChange={(e) => setAddForm({ ...addForm, planting_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha de Cosecha Esperada</label>
                  <input
                    type="date"
                    value={addForm.expected_harvest_date}
                    onChange={(e) => setAddForm({ ...addForm, expected_harvest_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Rendimiento Esperado (ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={addForm.yield_expected}
                    onChange={(e) => setAddForm({ ...addForm, yield_expected: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Variedad</label>
                  <input
                    type="text"
                    value={addForm.variety}
                    onChange={(e) => setAddForm({ ...addForm, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Notas</label>
                <textarea
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
              <button onClick={submitAddCrop} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Cultivo */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Cultivo</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Productor *</label>
                  <select
                    value={editForm.producer_id}
                    onChange={(e) => setEditForm({ ...editForm, producer_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar productor</option>
                    {producers.map(producer => (
                      <option key={producer.id} value={producer.id}>{producer.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Nombre del Cultivo *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Área (hectáreas) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.area}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Estado</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="planted">Plantado</option>
                    <option value="growing">En Crecimiento</option>
                    <option value="harvested">Cosechado</option>
                    <option value="failed">Fallido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha de Siembra</label>
                  <input
                    type="date"
                    value={editForm.planting_date}
                    onChange={(e) => setEditForm({ ...editForm, planting_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fecha de Cosecha Esperada</label>
                  <input
                    type="date"
                    value={editForm.expected_harvest_date}
                    onChange={(e) => setEditForm({ ...editForm, expected_harvest_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Rendimiento Esperado (ton)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editForm.yield_expected}
                    onChange={(e) => setEditForm({ ...editForm, yield_expected: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Variedad</label>
                  <input
                    type="text"
                    value={editForm.variety}
                    onChange={(e) => setEditForm({ ...editForm, variety: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Notas</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
              <button onClick={submitEditCrop} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Actualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropsPage;
