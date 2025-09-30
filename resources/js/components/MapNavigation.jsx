import React from 'react';
import {
    Map,
    BarChart3,
    Edit3,
    Ruler,
    Layers,
    Search,
    Download,
    Settings,
    Users,
    Sprout,
    Building,
    Truck
} from 'lucide-react';

const MapNavigation = ({ activeModule, onModuleChange }) => {
    const modules = [
        {
            id: 'overview',
            name: 'Vista General',
            icon: Map,
            description: 'Mapa principal con todos los elementos'
        },
        {
            id: 'producers',
            name: 'Productores',
            icon: Users,
            description: 'Gestión de productores georreferenciados'
        },
        {
            id: 'crops',
            name: 'Cultivos',
            icon: Sprout,
            description: 'Gestión de cultivos y áreas cultivadas'
        },
        {
            id: 'centers',
            name: 'Centros de Acopio',
            icon: Building,
            description: 'Gestión de centros de acopio y distribución'
        },
        {
            id: 'routes',
            name: 'Rutas Logísticas',
            icon: Truck,
            description: 'Gestión de rutas y transporte'
        },
        {
            id: 'analysis',
            name: 'Análisis Geográfico',
            icon: BarChart3,
            description: 'Análisis espacial y estadísticas'
        },
        {
            id: 'drawing',
            name: 'Herramientas de Dibujo',
            icon: Edit3,
            description: 'Dibujar y editar elementos geográficos'
        },
        {
            id: 'measurement',
            name: 'Medición',
            icon: Ruler,
            description: 'Medir distancias y áreas'
        },
        {
            id: 'layers',
            name: 'Gestión de Capas',
            icon: Layers,
            description: 'Control de capas y visibilidad'
        },
        {
            id: 'search',
            name: 'Búsqueda',
            icon: Search,
            description: 'Búsqueda geográfica avanzada'
        },
        {
            id: 'reports',
            name: 'Reportes',
            icon: Download,
            description: 'Generar reportes geográficos'
        },
        {
            id: 'settings',
            name: 'Configuración',
            icon: Settings,
            description: 'Configuración del mapa'
        }
    ];

    return (
        <div className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                        <Map className="w-6 h-6 text-blue-600 mr-3" />
                        <h2 className="text-xl font-bold text-gray-900">Mapa Interactivo</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Módulo activo:</span>
                        <span className="text-sm font-medium text-blue-600">
                            {modules.find(m => m.id === activeModule)?.name || 'Vista General'}
                        </span>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex space-x-1 overflow-x-auto pb-2">
                    {modules.map((module) => (
                        <button
                            key={module.id}
                            onClick={() => onModuleChange(module.id)}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${activeModule === module.id
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            title={module.description}
                        >
                            <module.icon className="w-4 h-4 mr-2" />
                            {module.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapNavigation; 