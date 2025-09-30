import React, { useState, useEffect } from 'react';
import {
    Users,
    Sprout,
    Building,
    Truck,
    TrendingUp,
    MapPin,
    BarChart3,
    RefreshCw,
    Download,
    Eye,
    EyeOff
} from 'lucide-react';

const MapStatistics = ({ selectedLayer = 'all' }) => {
    const [stats, setStats] = useState({
        producers: { total: 0, active: 0, area: 0 },
        crops: { total: 0, area: 0, types: 0 },
        centers: { total: 0, capacity: 0, types: 0 },
        routes: { total: 0, distance: 0, efficiency: 0 }
    });
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        loadStatistics();
    }, [selectedLayer]);

    const loadStatistics = async () => {
        setLoading(true);
        try {
            // Load producers stats
            const producersResponse = await fetch('/api/producers');
            const producersData = await producersResponse.json();
            const producers = producersData.data || producersData || [];

            // Load crops stats
            const cropsResponse = await fetch('/api/crops');
            const cropsData = await cropsResponse.json();
            const crops = cropsData.data || cropsData || [];

            // Load centers stats
            const centersResponse = await fetch('/api/collection-centers');
            const centersData = await centersResponse.json();
            const centers = centersData.data || centersData || [];

            // Load routes stats
            const routesResponse = await fetch('/api/logistics-routes');
            const routesData = await routesResponse.json();
            const routes = routesData.data || routesData || [];

            setStats({
                producers: {
                    total: producers.length,
                    active: producers.filter(p => p.status === 'active').length,
                    area: producers.reduce((sum, p) => sum + (p.area_total || 0), 0)
                },
                crops: {
                    total: crops.length,
                    area: crops.reduce((sum, c) => sum + (c.area || 0), 0),
                    types: new Set(crops.map(c => c.name)).size
                },
                centers: {
                    total: centers.length,
                    capacity: centers.reduce((sum, c) => sum + (c.storage_capacity || 0), 0),
                    types: new Set(centers.map(c => c.type)).size
                },
                routes: {
                    total: routes.length,
                    distance: routes.reduce((sum, r) => sum + (r.total_distance || 0), 0),
                    efficiency: routes.length > 0 ? routes.reduce((sum, r) => sum + (r.total_distance || 0), 0) / routes.length : 0
                }
            });
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLayerStats = () => {
        switch (selectedLayer) {
            case 'producers':
                return [
                    {
                        title: 'Total Productores',
                        value: stats.producers.total,
                        icon: Users,
                        color: 'bg-blue-500',
                        change: '+5%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Productores Activos',
                        value: stats.producers.active,
                        icon: TrendingUp,
                        color: 'bg-green-500',
                        change: '+2%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Área Total',
                        value: `${stats.producers.area.toFixed(1)} ha`,
                        icon: MapPin,
                        color: 'bg-purple-500',
                        change: '+8%',
                        changeType: 'positive'
                    }
                ];
            case 'crops':
                return [
                    {
                        title: 'Total Cultivos',
                        value: stats.crops.total,
                        icon: Sprout,
                        color: 'bg-green-500',
                        change: '+12%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Área Cultivada',
                        value: `${stats.crops.area.toFixed(1)} ha`,
                        icon: MapPin,
                        color: 'bg-blue-500',
                        change: '+15%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Tipos de Cultivo',
                        value: stats.crops.types,
                        icon: BarChart3,
                        color: 'bg-yellow-500',
                        change: '+3',
                        changeType: 'positive'
                    }
                ];
            case 'centers':
                return [
                    {
                        title: 'Total Centros',
                        value: stats.centers.total,
                        icon: Building,
                        color: 'bg-red-500',
                        change: '+2',
                        changeType: 'positive'
                    },
                    {
                        title: 'Capacidad Total',
                        value: `${stats.centers.capacity.toFixed(1)} ton`,
                        icon: TrendingUp,
                        color: 'bg-green-500',
                        change: '+10%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Tipos de Centro',
                        value: stats.centers.types,
                        icon: BarChart3,
                        color: 'bg-purple-500',
                        change: '+1',
                        changeType: 'positive'
                    }
                ];
            case 'routes':
                return [
                    {
                        title: 'Total Rutas',
                        value: stats.routes.total,
                        icon: Truck,
                        color: 'bg-yellow-500',
                        change: '+3',
                        changeType: 'positive'
                    },
                    {
                        title: 'Distancia Total',
                        value: `${stats.routes.distance.toFixed(1)} km`,
                        icon: MapPin,
                        color: 'bg-blue-500',
                        change: '+5%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Eficiencia Promedio',
                        value: `${stats.routes.efficiency.toFixed(1)} km/ruta`,
                        icon: TrendingUp,
                        color: 'bg-green-500',
                        change: '+2%',
                        changeType: 'positive'
                    }
                ];
            default:
                return [
                    {
                        title: 'Productores',
                        value: stats.producers.total,
                        icon: Users,
                        color: 'bg-blue-500',
                        change: '+5%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Cultivos',
                        value: stats.crops.total,
                        icon: Sprout,
                        color: 'bg-green-500',
                        change: '+12%',
                        changeType: 'positive'
                    },
                    {
                        title: 'Centros',
                        value: stats.centers.total,
                        icon: Building,
                        color: 'bg-red-500',
                        change: '+2',
                        changeType: 'positive'
                    },
                    {
                        title: 'Rutas',
                        value: stats.routes.total,
                        icon: Truck,
                        color: 'bg-yellow-500',
                        change: '+3',
                        changeType: 'positive'
                    }
                ];
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <BarChart3 className="w-6 h-6 text-gray-600 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                        Estadísticas del Mapa
                        {selectedLayer !== 'all' && (
                            <span className="ml-2 text-sm font-normal text-gray-500">
                                - {selectedLayer.charAt(0).toUpperCase() + selectedLayer.slice(1)}
                            </span>
                        )}
                    </h3>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showDetails ? 'Ocultar' : 'Detalles'}
                    </button>
                    <button
                        onClick={loadStatistics}
                        disabled={loading}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </button>
                    <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Main Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {getLayerStats().map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg ${stat.color} text-white mr-3`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </div>
                            <div className={`text-right ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <p className="text-sm font-medium">{stat.change}</p>
                                <p className="text-xs">vs mes anterior</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Statistics */}
            {showDetails && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Estadísticas Detalladas</h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Producers Details */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                                <Users className="w-4 h-4 mr-2" />
                                Productores
                            </h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Total:</span>
                                    <span className="font-medium">{stats.producers.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Activos:</span>
                                    <span className="font-medium">{stats.producers.active}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Área Total:</span>
                                    <span className="font-medium">{stats.producers.area.toFixed(1)} ha</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Promedio por Productor:</span>
                                    <span className="font-medium">
                                        {stats.producers.total > 0 ? (stats.producers.area / stats.producers.total).toFixed(1) : 0} ha
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Crops Details */}
                        <div className="bg-green-50 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-green-900 mb-3 flex items-center">
                                <Sprout className="w-4 h-4 mr-2" />
                                Cultivos
                            </h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-green-700">Total:</span>
                                    <span className="font-medium">{stats.crops.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Área Total:</span>
                                    <span className="font-medium">{stats.crops.area.toFixed(1)} ha</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Tipos Diferentes:</span>
                                    <span className="font-medium">{stats.crops.types}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-green-700">Promedio por Cultivo:</span>
                                    <span className="font-medium">
                                        {stats.crops.total > 0 ? (stats.crops.area / stats.crops.total).toFixed(1) : 0} ha
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Centers Details */}
                        <div className="bg-red-50 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-red-900 mb-3 flex items-center">
                                <Building className="w-4 h-4 mr-2" />
                                Centros de Acopio
                            </h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-red-700">Total:</span>
                                    <span className="font-medium">{stats.centers.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-700">Capacidad Total:</span>
                                    <span className="font-medium">{stats.centers.capacity.toFixed(1)} ton</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-700">Tipos Diferentes:</span>
                                    <span className="font-medium">{stats.centers.types}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-red-700">Promedio por Centro:</span>
                                    <span className="font-medium">
                                        {stats.centers.total > 0 ? (stats.centers.capacity / stats.centers.total).toFixed(1) : 0} ton
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Routes Details */}
                        <div className="bg-yellow-50 rounded-lg p-4">
                            <h5 className="text-sm font-medium text-yellow-900 mb-3 flex items-center">
                                <Truck className="w-4 h-4 mr-2" />
                                Rutas Logísticas
                            </h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Total:</span>
                                    <span className="font-medium">{stats.routes.total}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Distancia Total:</span>
                                    <span className="font-medium">{stats.routes.distance.toFixed(1)} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Eficiencia Promedio:</span>
                                    <span className="font-medium">{stats.routes.efficiency.toFixed(1)} km/ruta</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-yellow-700">Cobertura:</span>
                                    <span className="font-medium">
                                        {stats.routes.total > 0 ? ((stats.routes.total / (stats.centers.total * 2)) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        Generar Reporte
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Exportar Datos
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                        Análisis Avanzado
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                        Comparar Períodos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapStatistics; 