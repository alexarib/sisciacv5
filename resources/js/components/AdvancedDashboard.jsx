import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Sprout,
    Truck,
    MapPin,
    Calendar,
    DollarSign,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock,
    RefreshCw,
    Download,
    Eye,
    EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdvancedDashboard = () => {
    const [stats, setStats] = useState({
        producers: { total: 0, active: 0, area: 0, growth: 0 },
        crops: { total: 0, area: 0, types: 0, yield: 0 },
        logistics: { total: 0, delivered: 0, pending: 0, value: 0 },
        locations: { total: 0, farms: 0, plots: 0, fields: 0 }
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Load all data in parallel
            const [producersRes, cropsRes, logisticsRes, locationsRes] = await Promise.all([
                fetch('/api/producers'),
                fetch('/api/crops'),
                fetch('/api/logistics'),
                fetch('/api/locations')
            ]);

            const producersData = await producersRes.json();
            const cropsData = await cropsRes.json();
            const logisticsData = await logisticsRes.json();
            const locationsData = await locationsRes.json();

            const producers = producersData.data || producersData || [];
            const crops = cropsData.data || cropsData || [];
            const logistics = logisticsData.data || logisticsData || [];
            const locations = locationsData.data || locationsData || [];

            // Calculate statistics
            const totalArea = producers.reduce((sum, p) => sum + (p.total_area || 0), 0);
            const activeProducers = producers.filter(p => p.status === 'active').length;
            const cropArea = crops.reduce((sum, c) => sum + (c.area || 0), 0);
            const deliveredLogistics = logistics.filter(l => l.status === 'delivered').length;
            const totalLogisticsValue = logistics.reduce((sum, l) => sum + (l.total_price || 0), 0);

            setStats({
                producers: {
                    total: producers.length,
                    active: activeProducers,
                    area: totalArea,
                    growth: producers.length > 0 ? ((activeProducers / producers.length) * 100) : 0
                },
                crops: {
                    total: crops.length,
                    area: cropArea,
                    types: new Set(crops.map(c => c.name)).size,
                    yield: crops.length > 0 ? crops.reduce((sum, c) => sum + (c.yield || 0), 0) / crops.length : 0
                },
                logistics: {
                    total: logistics.length,
                    delivered: deliveredLogistics,
                    pending: logistics.length - deliveredLogistics,
                    value: totalLogisticsValue
                },
                locations: {
                    total: locations.length,
                    farms: locations.filter(l => l.type === 'farm').length,
                    plots: locations.filter(l => l.type === 'plot').length,
                    fields: locations.filter(l => l.type === 'field').length
                }
            });

            // Generate recent activities
            setRecentActivities([
                {
                    id: 1,
                    type: 'producer',
                    action: 'Nuevo productor registrado',
                    details: 'Juan Pérez se registró en el sistema',
                    timestamp: new Date().toISOString(),
                    icon: Users,
                    color: 'text-blue-600'
                },
                {
                    id: 2,
                    type: 'crop',
                    action: 'Cultivo actualizado',
                    details: 'Maíz - Estado cambiado a "En crecimiento"',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    icon: Sprout,
                    color: 'text-green-600'
                },
                {
                    id: 3,
                    type: 'logistics',
                    action: 'Entrega completada',
                    details: 'Fertilizante NPK entregado a Finca La Esperanza',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    icon: Truck,
                    color: 'text-yellow-600'
                },
                {
                    id: 4,
                    type: 'location',
                    action: 'Nueva ubicación agregada',
                    details: 'Parcela Los Pinos registrada en el mapa',
                    timestamp: new Date(Date.now() - 10800000).toISOString(),
                    icon: MapPin,
                    color: 'text-purple-600'
                }
            ]);

            // Generate alerts
            setAlerts([
                {
                    id: 1,
                    type: 'warning',
                    title: 'Cultivo próximo a cosecha',
                    message: '3 cultivos de maíz están listos para cosecha',
                    timestamp: new Date().toISOString(),
                    icon: AlertCircle,
                    color: 'text-yellow-600'
                },
                {
                    id: 2,
                    type: 'success',
                    title: 'Entrega exitosa',
                    message: 'Todas las entregas programadas se completaron',
                    timestamp: new Date(Date.now() - 1800000).toISOString(),
                    icon: CheckCircle,
                    color: 'text-green-600'
                },
                {
                    id: 3,
                    type: 'info',
                    title: 'Nueva capacitación disponible',
                    message: 'Curso de riego por goteo programado para mañana',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    icon: Clock,
                    color: 'text-blue-600'
                }
            ]);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, trendValue }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    {trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {trendValue}%
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs mes anterior</span>
                </div>
            )}
        </motion.div>
    );

    const ActivityItem = ({ activity }) => {
        const Icon = activity.icon;
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
                <div className={`p-2 rounded-full ${activity.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.details}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                    </p>
                </div>
            </motion.div>
        );
    };

    const AlertItem = ({ alert }) => {
        const Icon = alert.icon;
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start space-x-3 p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                    alert.type === 'success' ? 'border-green-400 bg-green-50' :
                    'border-blue-400 bg-blue-50'
                }`}
            >
                <Icon className={`w-5 h-5 ${alert.color} mt-0.5`} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                    </p>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Avanzado</h1>
                    <p className="text-gray-600">Resumen completo del sistema SISCIAC</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={loadDashboardData}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Actualizar
                    </button>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        {showDetails ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showDetails ? 'Ocultar' : 'Mostrar'} Detalles
                    </button>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Productores"
                    value={stats.producers.total}
                    subtitle={`${stats.producers.active} activos`}
                    icon={Users}
                    color="text-blue-600"
                    trend="up"
                    trendValue="12"
                />
                <StatCard
                    title="Cultivos"
                    value={stats.crops.total}
                    subtitle={`${stats.crops.area.toFixed(1)} ha totales`}
                    icon={Sprout}
                    color="text-green-600"
                    trend="up"
                    trendValue="8"
                />
                <StatCard
                    title="Logística"
                    value={stats.logistics.total}
                    subtitle={`${stats.logistics.delivered} entregados`}
                    icon={Truck}
                    color="text-yellow-600"
                    trend="down"
                    trendValue="3"
                />
                <StatCard
                    title="Ubicaciones"
                    value={stats.locations.total}
                    subtitle={`${stats.locations.farms} fincas`}
                    icon={MapPin}
                    color="text-purple-600"
                    trend="up"
                    trendValue="15"
                />
            </div>

            {/* Additional Stats */}
            {showDetails && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Área Total"
                        value={`${stats.producers.area.toFixed(1)} ha`}
                        subtitle="Superficie cultivada"
                        icon={BarChart3}
                        color="text-indigo-600"
                    />
                    <StatCard
                        title="Rendimiento Promedio"
                        value={`${stats.crops.yield.toFixed(1)} t/ha`}
                        subtitle="Por cultivo"
                        icon={TrendingUp}
                        color="text-emerald-600"
                    />
                    <StatCard
                        title="Valor Logístico"
                        value={`$${stats.logistics.value.toLocaleString()}`}
                        subtitle="Total en movimientos"
                        icon={DollarSign}
                        color="text-orange-600"
                    />
                </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-blue-600" />
                            Actividad Reciente
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <ActivityItem key={activity.id} activity={activity} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                            Alertas y Notificaciones
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {alerts.map((alert) => (
                                <AlertItem key={alert.id} alert={alert} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Users className="w-8 h-8 text-blue-600 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Nuevo Productor</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Sprout className="w-8 h-8 text-green-600 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Registrar Cultivo</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <Truck className="w-8 h-8 text-yellow-600 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Nueva Entrega</span>
                        </button>
                        <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                            <MapPin className="w-8 h-8 text-purple-600 mb-2" />
                            <span className="text-sm font-medium text-gray-900">Agregar Ubicación</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedDashboard;
