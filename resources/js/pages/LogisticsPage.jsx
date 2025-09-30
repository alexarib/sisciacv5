import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    Truck,
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    ArrowLeft,
    Filter,
    Download,
    Eye,
    Calendar,
    MapPin,
    Users,
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
import { LogisticsForm } from '../components/LogisticsForms';

const LogisticsPage = () => {
    const { user } = useAuth();
    
    const [logistics, setLogistics] = useState([]);
    const [producers, setProducers] = useState([]);
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [activeTab, setActiveTab] = useState('all');

    // Estados para formularios
    const [showLogisticsForm, setShowLogisticsForm] = useState(false);
    const [editingLogistics, setEditingLogistics] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('sisciac_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const refreshData = async () => {
        try {
            const [logisticsRes, producersRes, cropsRes] = await Promise.all([
                fetch('/api/logistics', { headers: getAuthHeaders() }),
                fetch('/api/producers', { headers: getAuthHeaders() }),
                fetch('/api/crops', { headers: getAuthHeaders() })
            ]);

            const logisticsData = await logisticsRes.json();
            const producersData = await producersRes.json();
            const cropsData = await cropsRes.json();

            setLogistics(logisticsData.data || logisticsData || mockLogistics);
            setProducers(producersData.data || producersData || []);
            setCrops(cropsData.data || cropsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback a datos simulados
            setLogistics(mockLogistics);
            setProducers([]);
            setCrops([]);
        }
    };

    useEffect(() => {
        refreshData().finally(() => setLoading(false));
    }, []);

    // Mock data (fallback)
    const mockLogistics = [
        {
            id: 1,
            producer: { id: 1, name: 'Juan Pérez' },
            crop: { id: 1, name: 'Maíz' },
            type: 'input',
            item_name: 'Fertilizante NPK',
            description: 'Fertilizante nitrogenado para cultivo de maíz',
            quantity: 500,
            unit: 'kg',
            unit_price: 2.50,
            total_price: 1250.00,
            date: '2024-08-07',
            status: 'delivered',
            supplier: 'AgroSupply S.A.',
            destination: 'Finca El Paraíso',
            notes: 'Entrega programada para la mañana'
        },
        {
            id: 2,
            producer: { id: 2, name: 'María González' },
            crop: { id: 2, name: 'Tomate' },
            type: 'output',
            item_name: 'Cosecha de Tomate',
            description: 'Tomates frescos para venta',
            quantity: 200,
            unit: 'kg',
            unit_price: 1.80,
            total_price: 360.00,
            date: '2024-08-06',
            status: 'in_transit',
            supplier: 'Finca La Esperanza',
            destination: 'Mercado Central',
            notes: 'Transporte refrigerado requerido'
        },
        {
            id: 3,
            producer: { id: 3, name: 'Carlos Rodríguez' },
            crop: null,
            type: 'transport',
            item_name: 'Transporte de Semillas',
            description: 'Semillas de papa para siembra',
            quantity: 100,
            unit: 'kg',
            unit_price: 5.00,
            total_price: 500.00,
            date: '2024-08-05',
            status: 'pending',
            supplier: 'Semillas del Valle',
            destination: 'Finca San Carlos',
            notes: 'Entrega urgente para siembra'
        }
    ];

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

    // Funciones para logística
    const handleAddLogistics = () => {
        setEditingLogistics(null);
        setShowLogisticsForm(true);
    };

    const handleEditLogistics = (logistics) => {
        setEditingLogistics(logistics);
        setShowLogisticsForm(true);
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

    const handleSubmitLogistics = async (logisticsData) => {
        try {
            if (editingLogistics) {
                await apiPut(`/api/logistics/${editingLogistics.id}`, logisticsData);
                showMapNotification('Registro actualizado: El registro logístico ha sido actualizado exitosamente.', 'info');
            } else {
                await apiPost('/api/logistics', logisticsData);
                showMapNotification('Registro creado: El registro logístico ha sido creado exitosamente.', 'info');
            }
            setShowLogisticsForm(false);
            setEditingLogistics(null);
            await refreshData();
        } catch (e) {
            showMapNotification('Error: No se pudo guardar el registro', 'error');
        }
    };

    const filteredLogistics = logistics.filter(item => {
        const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.producer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'in_transit':
                return <Truck className="w-4 h-4" />;
            case 'delivered':
                return <CheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
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
                <title>Gestión Logística - SISCIAC</title>
                <meta name="description" content="Gestión de logística y transporte del sistema SISCIAC" />
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
                                    <h1 className="text-2xl font-bold text-gray-900">Gestión Logística</h1>
                                    <p className="text-gray-600">Control de entradas, salidas y transporte</p>
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
                                        <Package className="w-4 h-4 inline mr-2" />
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
                                                placeholder="Buscar por item, productor, proveedor o destino..."
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
                                                    Productor
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
                                                                    <Package className="w-5 h-5 text-blue-600" />
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
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.producer?.name}
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
                                                        <div className="flex items-center">
                                                            <div className={`mr-2 ${getStatusColor(item.status)}`}>
                                                                {getStatusIcon(item.status)}
                                                            </div>
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                                                                {getStatusText(item.status)}
                                                            </span>
                                                        </div>
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

            {/* Formulario */}
            <LogisticsForm
                isOpen={showLogisticsForm}
                onClose={() => {
                    setShowLogisticsForm(false);
                    setEditingLogistics(null);
                }}
                onSubmit={handleSubmitLogistics}
                initialData={editingLogistics}
                producers={producers}
                crops={crops}
            />
        </>
    );
};

export default LogisticsPage; 