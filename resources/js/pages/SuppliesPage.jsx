import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Warehouse,
  ArrowLeft,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const SuppliesPage = () => {
  const { user } = useAuth();
  
  const [supplies, setSupplies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // inventory | requests

  // Ajuste de stock
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedSupply, setSelectedSupply] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ type: 'in', quantity: '', date: new Date().toISOString().slice(0, 10), reference: '', notes: '' });

  // Formularios
  const [addForm, setAddForm] = useState({
    name: '', category: '', unit: '', min_stock: '', current_stock: '', price: '', location: '', supplier: ''
  });
  const [requestForm, setRequestForm] = useState({
    supply_id: '', quantity: '', unit: '', priority: 'medium', notes: ''
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('sisciac_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const refreshData = async () => {
    const headers = { headers: getAuthHeaders() };
    const [suppliesRes, requestsRes] = await Promise.all([
      fetch('/api/supplies', headers),
      fetch('/api/supply-requests', headers)
    ]);
    const suppliesJson = await suppliesRes.json();
    const requestsJson = await requestsRes.json();
    setSupplies(suppliesJson.data || suppliesJson || []);
    setRequests(requestsJson.data || requestsJson || []);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshData();
      } catch (e) {
        console.error('Error cargando insumos/solicitudes', e);
        showMapNotification('Error: No se pudieron cargar los datos de insumos', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = (supply.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (supply.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || supply.status === filterStatus;
    const matchesType = filterType === 'all' || (supply.category || '') === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredRequests = requests.filter(request => {
    const producerName = request.producer?.name || '';
    const supplyName = request.supply?.name || '';
    const matchesSearch = producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'fulfilled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'low_stock':
        return 'Stock Bajo';
      case 'out_of_stock':
        return 'Sin Stock';
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'fulfilled':
        return 'Cumplida';
      default:
        return 'Desconocido';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return 'Desconocida';
    }
  };

  const apiPost = async (url, body = {}) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error en la solicitud');
    return res.json();
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await apiPost(`/api/supply-requests/${requestId}/approve`);
      showMapNotification('Solicitud aprobada: La solicitud ha sido aprobada exitosamente.', 'info');
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo aprobar la solicitud', 'error');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await apiPost(`/api/supply-requests/${requestId}/reject`);
      showMapNotification('Solicitud rechazada: La solicitud ha sido rechazada.', 'info');
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo rechazar la solicitud', 'error');
    }
  };

  const handleFulfillRequest = async (requestId) => {
    try {
      await apiPost(`/api/supply-requests/${requestId}/fulfill`);
      showMapNotification('Solicitud cumplida: La solicitud ha sido marcada como cumplida.', 'info');
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo cumplir la solicitud', 'error');
    }
  };

  const openAdjustModal = (supply) => {
    setSelectedSupply(supply);
    setAdjustForm({ type: 'in', quantity: '', date: new Date().toISOString().slice(0, 10), reference: '', notes: '' });
    setShowAdjustModal(true);
  };

  const submitAdjust = async () => {
    if (!selectedSupply) return;
    try {
      await apiPost(`/api/supplies/${selectedSupply.id}/adjust`, adjustForm);
      showMapNotification('Stock ajustado: El stock ha sido ajustado exitosamente.', 'info');
      setShowAdjustModal(false);
      setSelectedSupply(null);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo ajustar el stock', 'error');
    }
  };

  const handleAddSupply = async () => {
    try {
      await apiPost('/api/supplies', addForm);
      showMapNotification('Insumo agregado: El insumo ha sido agregado exitosamente.', 'info');
      setShowAddModal(false);
      setAddForm({ name: '', category: '', unit: '', min_stock: '', current_stock: '', price: '', location: '', supplier: '' });
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo agregar el insumo', 'error');
    }
  };

  const handleAddRequest = async () => {
    try {
      await apiPost('/api/supply-requests', requestForm);
      showMapNotification('Solicitud creada: La solicitud ha sido creada exitosamente.', 'info');
      setShowRequestModal(false);
      setRequestForm({ supply_id: '', quantity: '', unit: '', priority: 'medium', notes: '' });
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo crear la solicitud', 'error');
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
    <>
      <Helmet>
        <title>Gestión de Insumos y Logística - SCIAC</title>
        <meta name="description" content="Administra insumos, inventario y solicitudes del sistema SCIAC" />
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
                  <h1 className="text-2xl font-bold text-gray-900">Insumos y Logística</h1>
                  <p className="text-gray-600">Gestión de inventario y solicitudes</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Solicitud
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Insumo
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
                      placeholder="Buscar insumos o solicitudes..."
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
                    <option value="available">Disponible</option>
                    <option value="low_stock">Stock Bajo</option>
                    <option value="out_of_stock">Sin Stock</option>
                    <option value="pending">Pendiente</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                    <option value="fulfilled">Cumplida</option>
                  </select>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="semillas">Semillas</option>
                    <option value="fertilizantes">Fertilizantes</option>
                    <option value="pesticidas">Pesticidas</option>
                    <option value="herramientas">Herramientas</option>
                  </select>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inventory' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Inventario de Insumos
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Solicitudes
                  </button>
                </nav>
              </div>

              {/* Inventory Table */}
              {activeTab === 'inventory' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Insumo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proveedor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSupplies.map((supply) => (
                        <motion.tr
                          key={supply.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {supply.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ${supply.price} / {supply.unit}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                            {supply.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {supply.current_stock} {supply.unit}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${Number(supply.current_stock) <= Number(supply.min_stock)
                                  ? 'bg-red-600'
                                  : Number(supply.current_stock) <= Number(supply.min_stock) * 2
                                    ? 'bg-yellow-600'
                                    : 'bg-green-600'
                                  }`}
                                style={{ width: `${Math.min(100, (Number(supply.current_stock) / Math.max(1, Number(supply.min_stock) * 3)) * 100)}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(supply.status)}`}>
                              {getStatusText(supply.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {supply.supplier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Warehouse className="w-4 h-4 mr-1 text-gray-400" />
                              {supply.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => openAdjustModal(supply)} className="text-green-600 hover:text-green-800 p-1">
                                Ajustar
                              </button>
                              <button className="text-blue-600 hover:text-blue-900 p-1">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900 p-1">
                                <Trash2 classNameName="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Requests Table */}
              {activeTab === 'requests' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insumo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.producer?.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.supply?.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{req.quantity} {req.unit}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(req.priority)}`}>
                              {getPriorityText(req.priority)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                              {getStatusText(req.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              {req.status === 'pending' && (
                                <>
                                  <button onClick={() => handleApproveRequest(req.id)} className="text-green-600 hover:text-green-800">Aprobar</button>
                                  <button onClick={() => handleRejectRequest(req.id)} className="text-red-600 hover:text-red-800">Rechazar</button>
                                </>
                              )}
                              {req.status === 'approved' && (
                                <button onClick={() => handleFulfillRequest(req.id)} className="text-blue-600 hover:text-blue-800">Cumplir</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Insumos</p>
                    <p className="text-2xl font-semibold text-gray-900">{supplies.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Disponibles</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {supplies.filter(s => s.status === 'available').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {supplies.filter(s => s.status === 'low_stock').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Solicitudes</p>
                    <p className="text-2xl font-semibold text-gray-900">{requests.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Agregar Insumo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Insumo</h3>
            <div className="space-y-3">
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
                <label className="block text-sm text-gray-700 mb-1">Categoría</label>
                <select
                  value={addForm.category}
                  onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="semillas">Semillas</option>
                  <option value="fertilizantes">Fertilizantes</option>
                  <option value="pesticidas">Pesticidas</option>
                  <option value="herramientas">Herramientas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Unidad *</label>
                <input
                  type="text"
                  value={addForm.unit}
                  onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Stock Mínimo *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addForm.min_stock}
                    onChange={(e) => setAddForm({ ...addForm, min_stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Stock Actual *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={addForm.current_stock}
                    onChange={(e) => setAddForm({ ...addForm, current_stock: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Precio *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={addForm.price}
                  onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Ubicación</label>
                <input
                  type="text"
                  value={addForm.location}
                  onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Proveedor</label>
                <input
                  type="text"
                  value={addForm.supplier}
                  onChange={(e) => setAddForm({ ...addForm, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
              <button onClick={handleAddSupply} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva Solicitud */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nueva Solicitud de Insumo</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Insumo *</label>
                <select
                  value={requestForm.supply_id}
                  onChange={(e) => setRequestForm({ ...requestForm, supply_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar insumo</option>
                  {supplies.map(supply => (
                    <option key={supply.id} value={supply.id}>{supply.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cantidad *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm({ ...requestForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Unidad *</label>
                  <input
                    type="text"
                    value={requestForm.unit}
                    onChange={(e) => setRequestForm({ ...requestForm, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Prioridad</label>
                <select
                  value={requestForm.priority}
                  onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Notas</label>
                <textarea
                  value={requestForm.notes}
                  onChange={(e) => setRequestForm({ ...requestForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowRequestModal(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
              <button onClick={handleAddRequest} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Crear</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajuste de Stock */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajustar Stock - {selectedSupply?.name}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Tipo</label>
                <select
                  value={adjustForm.type}
                  onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="in">Entrada</option>
                  <option value="out">Salida</option>
                  <option value="adjustment">Ajuste</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={adjustForm.date}
                  onChange={(e) => setAdjustForm({ ...adjustForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Referencia</label>
                <input
                  type="text"
                  value={adjustForm.reference}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Notas</label>
                <textarea
                  value={adjustForm.notes}
                  onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button onClick={() => setShowAdjustModal(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
              <button onClick={submitAdjust} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuppliesPage; 