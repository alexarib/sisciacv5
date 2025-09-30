import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ProducersPage = () => {
  const { user } = useAuth();
  
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProducer, setSelectedProducer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Formularios
  const [addForm, setAddForm] = useState({
    name: '', email: '', phone: '', document_number: '', document_type: 'V',
    address: '', total_area: '', notes: ''
  });
  const [editForm, setEditForm] = useState({
    name: '', email: '', phone: '', document_number: '', document_type: 'V',
    address: '', total_area: '', notes: '', status: 'active'
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('sisciac_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const refreshData = async () => {
    try {
      const response = await axios.get('/api/producers');
      const data = response.data;
      setProducers(data.data || data || []);
    } catch (error) {
      console.error('Error loading producers:', error);
      // Fallback a datos simulados
      setProducers(mockProducers);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, []);

  // Datos simulados de productores (fallback)
  const mockProducers = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+58 412-123-4567',
      document_number: 'V-12.345.678',
      document_type: 'V',
      address: 'Caracas, Venezuela',
      status: 'active',
      registration_date: '2024-01-15',
      total_crops: 5,
      total_area: 25.5
    },
    {
      id: 2,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+58 414-987-6543',
      document_number: 'V-15.678.901',
      document_type: 'V',
      address: 'Valencia, Venezuela',
      status: 'active',
      registration_date: '2024-02-20',
      total_crops: 3,
      total_area: 18.2
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+58 416-555-1234',
      document_number: 'V-18.901.234',
      document_type: 'V',
      address: 'Maracay, Venezuela',
      status: 'inactive',
      registration_date: '2024-03-10',
      total_crops: 0,
      total_area: 0
    }
  ];

  const filteredProducers = producers.filter(producer => {
    const matchesSearch = producer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producer.document_number.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || producer.status === filterStatus;
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

  const handleAddProducer = () => {
    setAddForm({
      name: '', email: '', phone: '', document_number: '', document_type: 'V',
      address: '', total_area: '', notes: ''
    });
    setShowAddModal(true);
  };

  const handleEditProducer = (producer) => {
    setEditForm({
      name: producer.name,
      email: producer.email,
      phone: producer.phone,
      document_number: producer.document_number,
      document_type: producer.document_type,
      address: producer.address,
      total_area: producer.total_area || '',
      notes: producer.notes || '',
      status: producer.status
    });
    setSelectedProducer(producer);
    setShowEditModal(true);
  };

  const submitAddProducer = async () => {
    try {
      await apiPost('/api/producers', addForm);
      alert('Productor agregado exitosamente');
      setShowAddModal(false);
      await refreshData();
    } catch (e) {
      alert('Error: No se pudo agregar el productor');
    }
  };

  const submitEditProducer = async () => {
    if (!selectedProducer) return;
    try {
      await apiPut(`/api/producers/${selectedProducer.id}`, editForm);
      alert('Productor actualizado exitosamente');
      setShowEditModal(false);
      setSelectedProducer(null);
      await refreshData();
    } catch (e) {
      alert('Error: No se pudo actualizar el productor');
    }
  };

  const handleDeleteProducer = async (producerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este productor?')) {
      try {
        await fetch(`/api/producers/${producerId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        alert('Productor eliminado exitosamente');
        await refreshData();
      } catch (e) {
        alert('Error: No se pudo eliminar el productor');
      }
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    return status === 'active' ? 'Activo' : 'Inactivo';
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
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Productores</h1>
                <p className="text-gray-600">Administra productores del sistema</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleAddProducer}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                + Agregar Productor
              </button>
            </div>
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
                  placeholder="Buscar productores..."
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
                  <option value="active">Activos</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Producers Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cultivos
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducers.map((producer) => (
                    <tr key={producer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              👤
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {producer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Registrado: {new Date(producer.registration_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{producer.email}</div>
                        <div className="text-sm text-gray-500">{producer.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {producer.document_type}-{producer.document_number}
                        </div>
                        <div className="text-sm text-gray-500">{producer.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(producer.status)}`}>
                          {getStatusText(producer.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{producer.total_crops} cultivos</div>
                        <div className="text-gray-500">{producer.total_area} ha</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditProducer(producer)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteProducer(producer.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  👥
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Productores</p>
                  <p className="text-2xl font-semibold text-gray-900">{producers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  ✅
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {producers.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  ❌
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inactivos</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {producers.filter(p => p.status === 'inactive').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  📍
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Área Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {producers.reduce((sum, p) => sum + (p.total_area || 0), 0).toFixed(1)} ha
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Agregar Productor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Productor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tipo de Documento</label>
                  <select
                    value={addForm.document_type}
                    onChange={(e) => setAddForm({ ...addForm, document_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                    <option value="J">J</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    value={addForm.document_number}
                    onChange={(e) => setAddForm({ ...addForm, document_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Área Total (ha)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={addForm.total_area}
                  onChange={(e) => setAddForm({ ...addForm, total_area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Notas</label>
                <textarea
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
              <button onClick={submitAddProducer} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Agregar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Productor */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Productor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tipo de Documento</label>
                  <select
                    value={editForm.document_type}
                    onChange={(e) => setEditForm({ ...editForm, document_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="V">V</option>
                    <option value="E">E</option>
                    <option value="J">J</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Número de Documento *</label>
                  <input
                    type="text"
                    value={editForm.document_number}
                    onChange={(e) => setEditForm({ ...editForm, document_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Área Total (ha)</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={editForm.total_area}
                  onChange={(e) => setEditForm({ ...editForm, total_area: e.target.value })}
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
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Notas</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
              <button onClick={submitEditProducer} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Actualizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProducersPage;
