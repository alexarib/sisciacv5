import React, { useState } from 'react';
import {
    BarChart3,
    TrendingUp,
    MapPin,
    Users,
    Sprout,
    Building,
    Truck,
    Download,
    RefreshCw,
    Filter,
    Eye,
    EyeOff
} from 'lucide-react';

const AnalysisPanel = ({
    analysisData,
    onRunAnalysis,
    onExportAnalysis,
    onRefreshAnalysis
}) => {
    const [activeTab, setActiveTab] = useState('density');
    const [showFilters, setShowFilters] = useState(false);

    const analysisTypes = [
        { id: 'density', label: 'Densidad', icon: TrendingUp, color: 'text-blue-600' },
        { id: 'coverage', label: 'Cobertura', icon: MapPin, color: 'text-green-600' },
        { id: 'efficiency', label: 'Eficiencia', icon: BarChart3, color: 'text-purple-600' },
        { id: 'comprehensive', label: 'Integral', icon: BarChart3, color: 'text-orange-600' }
    ];

    const renderDensityAnalysis = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {analysisData?.density?.total_producers || 0}
                            </p>
                            <p className="text-xs text-blue-600">Total Productores</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-green-900">
                                {analysisData?.density?.density_per_km2 || 0}
                            </p>
                            <p className="text-xs text-green-600">Densidad/km²</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Por Comuna</h4>
                <div className="space-y-2">
                    {analysisData?.density?.by_commune && Object.entries(analysisData.density.by_commune).map(([commune, count]) => (
                        <div key={commune} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{commune}</span>
                            <span className="text-sm font-medium text-gray-900">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderCoverageAnalysis = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <Sprout className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-green-900">
                                {analysisData?.coverage?.total_crops || 0}
                            </p>
                            <p className="text-xs text-green-600">Total Cultivos</p>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {analysisData?.coverage?.total_area_ha || 0} ha
                            </p>
                            <p className="text-xs text-blue-600">Área Total</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Por Tipo de Cultivo</h4>
                <div className="space-y-2">
                    {analysisData?.coverage?.by_type && Object.entries(analysisData.coverage.by_type).map(([type, data]) => (
                        <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{type}</span>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{data.count}</div>
                                <div className="text-xs text-gray-500">{data.total_area} ha</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderEfficiencyAnalysis = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <Truck className="w-5 h-5 text-purple-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-purple-900">
                                {analysisData?.efficiency?.total_routes || 0}
                            </p>
                            <p className="text-xs text-purple-600">Total Rutas</p>
                        </div>
                    </div>
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-orange-900">
                                {analysisData?.efficiency?.average_distance_km || 0} km
                            </p>
                            <p className="text-xs text-orange-600">Distancia Promedio</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Eficiencia por Tipo de Carga</h4>
                <div className="space-y-2">
                    {analysisData?.efficiency?.by_cargo_type && Object.entries(analysisData.efficiency.by_cargo_type).map(([type, data]) => (
                        <div key={type} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{type}</span>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{data.count}</div>
                                <div className="text-xs text-gray-500">{data.average_distance} km</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderComprehensiveAnalysis = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-blue-900">
                                {analysisData?.producers?.total || 0}
                            </p>
                            <p className="text-xs text-blue-600">Productores</p>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <Sprout className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-green-900">
                                {analysisData?.crops?.total || 0}
                            </p>
                            <p className="text-xs text-green-600">Cultivos</p>
                        </div>
                    </div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <Building className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-red-900">
                                {analysisData?.centers?.total || 0}
                            </p>
                            <p className="text-xs text-red-600">Centros</p>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center">
                        <Truck className="w-5 h-5 text-yellow-600 mr-2" />
                        <div>
                            <p className="text-sm font-medium text-yellow-900">
                                {analysisData?.routes?.total || 0}
                            </p>
                            <p className="text-xs text-yellow-600">Rutas</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Resumen General</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Área Total Cultivada:</span>
                        <span className="font-medium">{(analysisData?.crops?.total_area || 0).toFixed(2)} ha</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Capacidad Total de Almacenamiento:</span>
                        <span className="font-medium">{(analysisData?.centers?.total_capacity || 0).toFixed(2)} ton</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Distancia Total de Rutas:</span>
                        <span className="font-medium">{(analysisData?.routes?.total_distance || 0).toFixed(2)} km</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BarChart3 className="w-5 h-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Análisis Geográfico</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Filtros"
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onRefreshAnalysis}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Actualizar"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onExportAnalysis}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Exportar"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-4">
                    {analysisTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setActiveTab(type.id)}
                            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === type.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <type.icon className={`w-4 h-4 mr-2 ${type.color}`} />
                            {type.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Filters */}
                {showFilters && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Filtros de Análisis</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Comuna</label>
                                <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
                                    <option value="">Todas</option>
                                    <option value="comuna1">Comuna 1</option>
                                    <option value="comuna2">Comuna 2</option>
                                    <option value="comuna3">Comuna 3</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Período</label>
                                <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
                                    <option value="all">Todo el período</option>
                                    <option value="month">Último mes</option>
                                    <option value="quarter">Último trimestre</option>
                                    <option value="year">Último año</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={() => onRunAnalysis(activeTab)}
                            className="mt-3 w-full bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                        >
                            Ejecutar Análisis
                        </button>
                    </div>
                )}

                {/* Analysis Content */}
                <div className="min-h-[300px]">
                    {activeTab === 'density' && renderDensityAnalysis()}
                    {activeTab === 'coverage' && renderCoverageAnalysis()}
                    {activeTab === 'efficiency' && renderEfficiencyAnalysis()}
                    {activeTab === 'comprehensive' && renderComprehensiveAnalysis()}
                </div>

                {/* Quick Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onRunAnalysis(activeTab)}
                            className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                        >
                            Ejecutar Análisis
                        </button>
                        <button
                            onClick={onExportAnalysis}
                            className="flex-1 bg-green-600 text-white text-sm py-2 px-3 rounded hover:bg-green-700 transition-colors"
                        >
                            Exportar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPanel; 