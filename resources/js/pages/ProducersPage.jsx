import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Upload,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

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
      const response = await fetch('/api/producers', { headers: getAuthHeaders() });
      const data = await response.json();
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
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error en la solicitud');
    return res.json();
  };

  const apiPut = async (url, body = {}) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error en la solicitud');
    return res.json();
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
      showMapNotification('Productor agregado: El productor ha sido agregado exitosamente.', 'info');
      setShowAddModal(false);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo agregar el productor', 'error');
    }
  };

  const submitEditProducer = async () => {
    if (!selectedProducer) return;
    try {
      await apiPut(`/api/producers/${selectedProducer.id}`, editForm);
      showMapNotification('Productor actualizado: El productor ha sido actualizado exitosamente.', 'info');
      setShowEditModal(false);
      setSelectedProducer(null);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo actualizar el productor', 'error');
    }
  };

  const handleDeleteProducer = async (producerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este productor?')) {
      try {
        await fetch(`/api/producers/${producerId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        showMapNotification('Productor eliminado: El productor ha sido eliminado exitosamente.', 'info');
        await refreshData();
      } catch (e) {
        showMapNotification('Error: No se pudo eliminar el productor', 'error');
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
    <>
      <Helmet>
        <title>Gestión de Productores - SCIAC</title>
        <meta name="description" content="Administra productores del sistema SCIAC" />
      </Helmet>

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
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gestión de Productores</h1>
                  <p className="text-gray-600">Administra productores del sistema</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddProducer}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Productor
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar productores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </button>
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
                      <motion.tr
                        key={producer.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
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
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProducer(producer.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
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
                    <Users className="w-6 h-6 text-blue-600" />
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
                    <Users className="w-6 h-6 text-green-600" />
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
                    <Users className="w-6 h-6 text-red-600" />
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
                    <MapPin className="w-6 h-6 text-purple-600" />
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
      </div>

      {/* Modal Agregar Productor */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Productor</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre Completo *</label>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tipo Documento</label>
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
                  <label className="block text-sm text-gray-700 mb-1">Número Documento</label>
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
              <button onClick={submitAddProducer} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Productor */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Productor</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Nombre Completo *</label>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tipo Documento</label>
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
                  <label className="block text-sm text-gray-700 mb-1">Número Documento</label>
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
    </>
  );
};

export default ProducersPage; 