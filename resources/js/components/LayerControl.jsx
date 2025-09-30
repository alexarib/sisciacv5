import React, { useState } from 'react';
import {
    Layers,
    Users,
    Sprout,
    Building,
    Truck,
    Eye,
    EyeOff,
    Settings,
    Filter
} from 'lucide-react';

const LayerControl = ({
    layers,
    onLayerToggle,
    onLayerOpacityChange,
    onLayerFilter,
    selectedLayer,
    onLayerSelect
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const defaultLayers = [
        {
            id: 'all',
            name: 'Todos',
            icon: Layers,
            color: 'text-gray-600',
            visible: true,
            opacity: 1
        },
        {
            id: 'producers',
            name: 'Productores',
            icon: Users,
            color: 'text-blue-600',
            visible: true,
            opacity: 1,
            count: 0
        },
        {
            id: 'crops',
            name: 'Cultivos',
            icon: Sprout,
            color: 'text-green-600',
            visible: true,
            opacity: 1,
            count: 0
        },
        {
            id: 'centers',
            name: 'Centros de Acopio',
            icon: Building,
            color: 'text-red-600',
            visible: true,
            opacity: 1,
            count: 0
        },
        {
            id: 'routes',
            name: 'Rutas Logísticas',
            icon: Truck,
            color: 'text-yellow-600',
            visible: true,
            opacity: 1,
            count: 0
        }
    ];

    const mergedLayers = defaultLayers.map(layer => {
        const existingLayer = layers.find(l => l.id === layer.id);
        return { ...layer, ...existingLayer };
    });

    return (
        <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Layers className="w-5 h-5 text-gray-600 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900">Capas del Mapa</h3>
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
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title={isOpen ? 'Colapsar' : 'Expandir'}
                        >
                            {isOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isOpen && (
                <div className="p-4">
                    {/* Layer List */}
                    <div className="space-y-3">
                        {mergedLayers.map((layer) => (
                            <div key={layer.id} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => onLayerToggle(layer.id)}
                                            className="mr-2"
                                        >
                                            {layer.visible ? (
                                                <Eye className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <EyeOff className="w-4 h-4 text-gray-400" />
                                            )}
                                        </button>
                                        <layer.icon className={`w-4 h-4 mr-2 ${layer.color}`} />
                                        <span className="text-sm font-medium text-gray-900">
                                            {layer.name}
                                        </span>
                                        {layer.count !== undefined && (
                                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                                {layer.count}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => onLayerSelect(layer.id)}
                                        className={`px-2 py-1 text-xs rounded ${selectedLayer === layer.id
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        Seleccionar
                                    </button>
                                </div>

                                {/* Opacity Control */}
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">Opacidad:</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={layer.opacity}
                                        onChange={(e) => onLayerOpacityChange(layer.id, parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <span className="text-xs text-gray-500 w-8">
                                        {Math.round(layer.opacity * 100)}%
                                    </span>
                                </div>

                                {/* Layer Settings */}
                                <div className="mt-2 flex items-center justify-between">
                                    <button
                                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                                        onClick={() => onLayerFilter(layer.id)}
                                    >
                                        <Settings className="w-3 h-3 mr-1" />
                                        Configurar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                <Filter className="w-4 h-4 mr-2" />
                                Filtros Avanzados
                            </h4>

                            <div className="space-y-3">
                                {/* Status Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
                                        <option value="">Todos</option>
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                        <option value="maintenance">Mantenimiento</option>
                                    </select>
                                </div>

                                {/* Commune Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Comuna
                                    </label>
                                    <select className="w-full text-xs border border-gray-300 rounded px-2 py-1">
                                        <option value="">Todas</option>
                                        <option value="comuna1">Comuna 1</option>
                                        <option value="comuna2">Comuna 2</option>
                                        <option value="comuna3">Comuna 3</option>
                                    </select>
                                </div>

                                {/* Date Range Filter */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                        Rango de Fechas
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="date"
                                            className="text-xs border border-gray-300 rounded px-2 py-1"
                                            placeholder="Desde"
                                        />
                                        <input
                                            type="date"
                                            className="text-xs border border-gray-300 rounded px-2 py-1"
                                            placeholder="Hasta"
                                        />
                                    </div>
                                </div>

                                {/* Apply Filters Button */}
                                <button className="w-full bg-blue-600 text-white text-xs py-2 px-3 rounded hover:bg-blue-700 transition-colors">
                                    Aplicar Filtros
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <button className="flex-1 text-xs bg-green-100 text-green-800 py-2 px-3 rounded hover:bg-green-200 transition-colors">
                                Mostrar Todo
                            </button>
                            <button className="flex-1 text-xs bg-red-100 text-red-800 py-2 px-3 rounded hover:bg-red-200 transition-colors">
                                Ocultar Todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LayerControl; 