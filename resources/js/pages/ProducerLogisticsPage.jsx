import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    Truck,
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
    TrendingDown,
    BarChart3,
    FileText,
    DollarSign
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const ProducerLogisticsPage = () => {
    const { user } = useAuth();
    
    const [logistics, setLogistics] = useState([]);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingLogistics, setEditingLogistics] = useState(null);

    // Formulario
    const [logisticsForm, setLogisticsForm] = useState({
        crop_id: '',
        type: 'input',
        item_name: '',
        description: '',
        quantity: '',
        unit: 'kg',
        unit_price: '',
        total_price: '',
        date: new Date().toISOString().slice(0, 10),
        status: 'pending',
        supplier: '',
        destination: '',
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
            const [logisticsRes, cropsRes] = await Promise.all([
                fetch('/api/logistics', { headers: getAuthHeaders() }),
                fetch('/api/crops', { headers: getAuthHeaders() })
            ]);

            const logisticsData = await logisticsRes.json();
            const cropsData = await cropsRes.json();

            setLogistics(logisticsData.data || logisticsData || []);
            setCrops(cropsData.data || cropsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setLogistics([]);
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

    const handleAddLogistics = () => {
        setLogisticsForm({
            crop_id: '',
            type: 'input',
            item_name: '',
            description: '',
            quantity: '',
            unit: 'kg',
            unit_price: '',
            total_price: '',
            date: new Date().toISOString().slice(0, 10),
            status: 'pending',
            supplier: '',
            destination: '',
            notes: ''
        });
        setShowAddModal(true);
    };

    const handleEditLogistics = (logistics) => {
        setLogisticsForm({
            crop_id: logistics.crop_id || '',
            type: logistics.type,
            item_name: logistics.item_name,
            description: logistics.description || '',
            quantity: logistics.quantity,
            unit: logistics.unit,
            unit_price: logistics.unit_price || '',
            total_price: logistics.total_price || '',
            date: logistics.date ? logistics.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
            status: logistics.status,
            supplier: logistics.supplier || '',
            destination: logistics.destination || '',
            notes: logistics.notes || ''
        });
        setEditingLogistics(logistics);
        setShowEditModal(true);
    };

    const handleDeleteLogistics = async (logisticsId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este registro logístico?')) {
            try {
                await fetch(`/api/logistics/${logisticsId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                showMapNotification('Registro eliminado: El registro logístico ha sido eliminado exitosamente.', 'info');
                await refreshData();
            } catch (e) {
                showMapNotification('Error: No se pudo eliminar el registro', 'error');
            }
        }
    };

    const handleSubmitLogistics = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...logisticsForm,
                producer_id: user.producer_id,
                quantity: parseFloat(logisticsForm.quantity),
                unit_price: logisticsForm.unit_price ? parseFloat(logisticsForm.unit_price) : null,
                total_price: logisticsForm.total_price ? parseFloat(logisticsForm.total_price) : null
            };

            if (editingLogistics) {
                await apiPut(`/api/logistics/${editingLogistics.id}`, submitData);
                showMapNotification('Registro actualizado: El registro logístico ha sido actualizado exitosamente.', 'info');
            } else {
                await apiPost('/api/logistics', submitData);
                showMapNotification('Registro creado: El registro logístico ha sido creado exitosamente.', 'info');
            }

            setShowAddModal(false);
            setShowEditModal(false);
            setEditingLogistics(null);
            await refreshData();
        } catch (e) {
            showMapNotification('Error: No se pudo guardar el registro', 'error');
        }
    };

    const filteredLogistics = logistics.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.destination?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesType = filterType === 'all' || item.type === filterType;
        const matchesTab = activeTab === 'all' || item.type === activeTab;
        return matchesSearch && matchesStatus && matchesType && matchesTab;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'input':
                return 'bg-green-100 text-green-800';
            case 'output':
                return 'bg-blue-100 text-blue-800';
            case 'transport':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'input':
                return 'Entrada';
            case 'output':
                return 'Salida';
            case 'transport':
                return 'Transporte';
            default:
                return 'Desconocido';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_transit':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'in_transit':
                return 'En Tránsito';
            case 'delivered':
                return 'Entregado';
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
                <title>Mi Logística - SISCIAC</title>
                <meta name="description" content="Gestión de logística del productor" />
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
                                    <h1 className="text-2xl font-bold text-gray-900">Mi Logística</h1>
                                    <p className="text-gray-600">Gestiona tus entradas, salidas y transporte</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleAddLogistics}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nuevo Registro
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 px-6">
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Truck className="w-4 h-4 inline mr-2" />
                                        Todos
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('input')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'input'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <TrendingUp className="w-4 h-4 inline mr-2" />
                                        Entradas
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('output')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'output'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <TrendingDown className="w-4 h-4 inline mr-2" />
                                        Salidas
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('transport')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'transport'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Truck className="w-4 h-4 inline mr-2" />
                                        Transporte
                                    </button>
                                </nav>
                            </div>

                            {/* Filters */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Buscar por item, proveedor o destino..."
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
                                            <option value="pending">Pendiente</option>
                                            <option value="in_transit">En Tránsito</option>
                                            <option value="delivered">Entregado</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">Todos los tipos</option>
                                            <option value="input">Entrada</option>
                                            <option value="output">Salida</option>
                                            <option value="transport">Transporte</option>
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
                                                    Item
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipo
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Cantidad
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Precio Total
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredLogistics.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <Truck className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                                                                <div className="text-sm text-gray-500">{item.description}</div>
                                                                {item.crop && (
                                                                    <div className="text-xs text-gray-400">Cultivo: {item.crop.name}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
                                                            {getTypeText(item.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.quantity} {item.unit}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.total_price ? `$${item.total_price.toFixed(2)}` : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                            {getStatusText(item.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => handleEditLogistics(item)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLogistics(item.id)}
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
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Registros</p>
                                        <p className="text-2xl font-semibold text-gray-900">{logistics.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <TrendingUp className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Entradas</p>
                                        <p className="text-2xl font-semibold text-gray-900">{logistics.filter(l => l.type === 'input').length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <TrendingDown className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Salidas</p>
                                        <p className="text-2xl font-semibold text-gray-900">{logistics.filter(l => l.type === 'output').length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Valor Total</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            ${logistics.reduce((sum, l) => sum + (l.total_price || 0), 0).toFixed(0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal para agregar/editar logística */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingLogistics ? 'Editar Registro Logístico' : 'Nuevo Registro Logístico'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                    setEditingLogistics(null);
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitLogistics} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Cultivo (Opcional)</label>
                                    <select
                                        value={logisticsForm.crop_id}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, crop_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Sin cultivo específico</option>
                                        {crops.map(crop => (
                                            <option key={crop.id} value={crop.id}>{crop.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Tipo de Operación *</label>
                                    <select
                                        value={logisticsForm.type}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="input">Entrada (Insumos)</option>
                                        <option value="output">Salida (Productos)</option>
                                        <option value="transport">Transporte</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Nombre del Item *</label>
                                    <input
                                        type="text"
                                        value={logisticsForm.item_name}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, item_name: e.target.value })}
                                        placeholder="ej: Fertilizante NPK, Semillas de maíz, Cosecha de tomate"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Fecha *</label>
                                    <input
                                        type="date"
                                        value={logisticsForm.date}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Cantidad *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={logisticsForm.quantity}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, quantity: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Unidad *</label>
                                    <select
                                        value={logisticsForm.unit}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, unit: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="kg">Kilogramos (kg)</option>
                                        <option value="tons">Toneladas (tons)</option>
                                        <option value="liters">Litros (L)</option>
                                        <option value="units">Unidades</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Estado *</label>
                                    <select
                                        value={logisticsForm.status}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="pending">Pendiente</option>
                                        <option value="in_transit">En Tránsito</option>
                                        <option value="delivered">Entregado</option>
                                        <option value="cancelled">Cancelado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Precio Unitario ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={logisticsForm.unit_price}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, unit_price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Precio Total ($)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={logisticsForm.total_price}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, total_price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Proveedor</label>
                                    <input
                                        type="text"
                                        value={logisticsForm.supplier}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, supplier: e.target.value })}
                                        placeholder="ej: AgroSupply S.A., Cooperativa Local"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-1">Destino</label>
                                    <input
                                        type="text"
                                        value={logisticsForm.destination}
                                        onChange={(e) => setLogisticsForm({ ...logisticsForm, destination: e.target.value })}
                                        placeholder="ej: Almacén Central, Mercado Local, Cliente Final"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={logisticsForm.description}
                                    onChange={(e) => setLogisticsForm({ ...logisticsForm, description: e.target.value })}
                                    rows="3"
                                    placeholder="Descripción detallada del item o operación..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Notas Adicionales</label>
                                <textarea
                                    value={logisticsForm.notes}
                                    onChange={(e) => setLogisticsForm({ ...logisticsForm, notes: e.target.value })}
                                    rows="2"
                                    placeholder="Información adicional, observaciones o comentarios..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        setEditingLogistics(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {editingLogistics ? 'Actualizar' : 'Crear'} Registro
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProducerLogisticsPage; 