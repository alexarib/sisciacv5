import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    Sprout,
    Plus,
    Search,
    Edit,
    Trash2,
    ArrowLeft,
    Filter,
    Download,
    Eye,
    Calendar,
    MapPin,
    CheckCircle,
    AlertCircle,
    Clock,
    TrendingUp,
    BarChart3,
    FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const ProducerCropsPage = () => {
    const { user } = useAuth();
    
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    // Formulario
    const [cropForm, setCropForm] = useState({
        name: '',
        description: '',
        area: '',
        status: 'planning',
        variety: '',
        planting_date: '',
        expected_harvest_date: '',
        notes: ''
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('sisciac_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const refreshData = async () => {
        try {
            const response = await fetch('/api/crops', { headers: getAuthHeaders() });
            const data = await response.json();
            setCrops(data.data || data || []);
        } catch (error) {
            console.error('Error loading crops:', error);
            setCrops([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

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

    const handleAddCrop = () => {
        setCropForm({
            name: '',
            description: '',
            area: '',
            status: 'planning',
            variety: '',
            planting_date: '',
            expected_harvest_date: '',
            notes: ''
        });
        setShowAddModal(true);
    };

    const handleEditCrop = (crop) => {
        setCropForm({
            name: crop.name,
            description: crop.description || '',
            area: crop.area,
            status: crop.status,
            variety: crop.variety || '',
            planting_date: crop.planting_date ? crop.planting_date.slice(0, 10) : '',
            expected_harvest_date: crop.expected_harvest_date ? crop.expected_harvest_date.slice(0, 10) : '',
            notes: crop.notes || ''
        });
        setEditingCrop(crop);
        setShowEditModal(true);
    };

    const handleDeleteCrop = async (cropId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cultivo?')) {
            try {
                await fetch(`/api/crops/${cropId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                showMapNotification('Cultivo eliminado: El cultivo ha sido eliminado exitosamente.', 'info');
                await refreshData();
            } catch (e) {
                showMapNotification('Error: No se pudo eliminar el cultivo', 'error');
            }
        }
    };

    const handleSubmitCrop = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...cropForm,
                area: parseFloat(cropForm.area)
            };

            if (editingCrop) {
                await apiPut(`/api/crops/${editingCrop.id}`, submitData);
                showMapNotification('Cultivo actualizado: El cultivo ha sido actualizado exitosamente.', 'info');
            } else {
                await apiPost('/api/crops', submitData);
                showMapNotification('Cultivo creado: El cultivo ha sido creado exitosamente.', 'info');
            }

            setShowAddModal(false);
            setShowEditModal(false);
            setEditingCrop(null);
            await refreshData();
        } catch (e) {
            showMapNotification('Error: No se pudo guardar el cultivo', 'error');
        }
    };

    const filteredCrops = crops.filter(crop => {
        const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crop.variety?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || crop.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'planning':
                return 'bg-gray-100 text-gray-800';
            case 'growing':
                return 'bg-green-100 text-green-800';
            case 'harvested':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'planning':
                return 'Planificado';
            case 'growing':
                return 'En Crecimiento';
            case 'harvested':
                return 'Cosechado';
            case 'cancelled':
                return 'Cancelado';
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
        <>
            <Helmet>
                <title>Mis Cultivos - SISCIAC</title>
                <meta name="description" content="Gestión de cultivos del productor" />
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
                                    <h1 className="text-2xl font-bold text-gray-900">Mis Cultivos</h1>
                                    <p className="text-gray-600">Gestiona tus cultivos y cosechas</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleAddCrop}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Cultivo
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow mb-6">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Buscar cultivos..."
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
                                            <option value="planning">Planificado</option>
                                            <option value="growing">En Crecimiento</option>
                                            <option value="harvested">Cosechado</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center">
                                            <Download className="w-4 h-4 mr-2" />
                                            Exportar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cultivo
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Área
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha de Siembra
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cosecha Esperada
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredCrops.map((crop) => (
                                                <tr key={crop.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                                    <Sprout className="w-5 h-5 text-green-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{crop.name}</div>
                                                                <div className="text-sm text-gray-500">{crop.variety}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {crop.area} hectáreas
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(crop.status)}`}>
                                                            {getStatusText(crop.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {crop.planting_date ? new Date(crop.planting_date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {crop.expected_harvest_date ? new Date(crop.expected_harvest_date).toLocaleDateString() : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEditCrop(crop)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCrop(crop.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Sprout className="w-6 h-6 text-green-600" />
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
                                        <TrendingUp className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">En Crecimiento</p>
                                        <p className="text-2xl font-semibold text-gray-900">{crops.filter(c => c.status === 'growing').length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Calendar className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Planificados</p>
                                        <p className="text-2xl font-semibold text-gray-900">{crops.filter(c => c.status === 'planning').length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Cosechados</p>
                                        <p className="text-2xl font-semibold text-gray-900">{crops.filter(c => c.status === 'harvested').length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal para agregar/editar cultivo */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingCrop ? 'Editar Cultivo' : 'Nuevo Cultivo'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                    setEditingCrop(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitCrop} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Nombre del Cultivo *</label>
                                    <input
                                        type="text"
                                        value={cropForm.name}
                                        onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Variedad</label>
                                    <input
                                        type="text"
                                        value={cropForm.variety}
                                        onChange={(e) => setCropForm({ ...cropForm, variety: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Área (hectáreas) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={cropForm.area}
                                        onChange={(e) => setCropForm({ ...cropForm, area: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Estado *</label>
                                    <select
                                        value={cropForm.status}
                                        onChange={(e) => setCropForm({ ...cropForm, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="planning">Planificado</option>
                                        <option value="growing">En Crecimiento</option>
                                        <option value="harvested">Cosechado</option>
                                        <option value="cancelled">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Fecha de Siembra</label>
                                    <input
                                        type="date"
                                        value={cropForm.planting_date}
                                        onChange={(e) => setCropForm({ ...cropForm, planting_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Cosecha Esperada</label>
                                    <input
                                        type="date"
                                        value={cropForm.expected_harvest_date}
                                        onChange={(e) => setCropForm({ ...cropForm, expected_harvest_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={cropForm.description}
                                    onChange={(e) => setCropForm({ ...cropForm, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Notas</label>
                                <textarea
                                    value={cropForm.notes}
                                    onChange={(e) => setCropForm({ ...cropForm, notes: e.target.value })}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        setEditingCrop(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    {editingCrop ? 'Actualizar' : 'Crear'} Cultivo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProducerCropsPage; 