import React from 'react';
import {
    Map,
    Edit,
    Plus,
    Ruler,
    Search,
    Layers,
    BarChart3,
    Save,
    X,
    Eye,
    EyeOff,
    ZoomIn,
    ZoomOut,
    RotateCcw
} from 'lucide-react';

const MapToolbar = ({
    mode,
    onModeChange,
    onAddElement,
    onMeasure,
    onSearch,
    onLayers,
    onAnalysis,
    onSave,
    onCancel,
    onZoomIn,
    onZoomOut,
    onReset,
    showLegend,
    onToggleLegend
}) => {
    const modes = [
        { id: 'view', label: 'Ver', icon: Eye, color: 'text-blue-600' },
        { id: 'edit', label: 'Editar', icon: Edit, color: 'text-green-600' },
        { id: 'add', label: 'Agregar', icon: Plus, color: 'text-purple-600' },
        { id: 'measure', label: 'Medir', icon: Ruler, color: 'text-orange-600' }
    ];

    const tools = [
        { id: 'search', label: 'Buscar', icon: Search, action: onSearch },
        { id: 'layers', label: 'Capas', icon: Layers, action: onLayers },
        { id: 'analysis', label: 'Análisis', icon: BarChart3, action: onAnalysis },
        { id: 'zoom-in', label: 'Zoom +', icon: ZoomIn, action: onZoomIn },
        { id: 'zoom-out', label: 'Zoom -', icon: ZoomOut, action: onZoomOut },
        { id: 'reset', label: 'Reset', icon: RotateCcw, action: onReset }
    ];

    const handleAddElement = (type) => {
        console.log('MapToolbar: handleAddElement called with type:', type);

        // Activar modo de edición
        setIsEditMode(true);

        // Configurar el tipo de elemento a agregar
        setSelectedElementType(type);

        // Activar modo de dibujo para marcadores
        if (onDrawingModeChange) {
            onDrawingModeChange('marker');
        }

        // Mostrar notificación
        if (onShowNotification) {
            onShowNotification(`Modo de edición activado. Haga clic en el mapa para agregar un ${type.name.toLowerCase()}`);
        }

        console.log('MapToolbar: Edit mode activated for', type.name);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between">
                {/* Modos de Operación */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 mr-3">Modo:</span>
                    {modes.map((modeOption) => (
                        <button
                            key={modeOption.id}
                            onClick={() => onModeChange(modeOption.id)}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${mode === modeOption.id
                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                        >
                            <modeOption.icon className={`w-4 h-4 mr-2 ${modeOption.color}`} />
                            {modeOption.label}
                        </button>
                    ))}
                </div>

                {/* Herramientas */}
                <div className="flex items-center space-x-2">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            onClick={tool.action}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            title={tool.label}
                        >
                            <tool.icon className="w-4 h-4" />
                            <span className="ml-2 hidden sm:inline">{tool.label}</span>
                        </button>
                    ))}

                    {/* Leyenda Toggle */}
                    <button
                        onClick={onToggleLegend}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                        title={showLegend ? 'Ocultar Leyenda' : 'Mostrar Leyenda'}
                    >
                        {showLegend ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        <span className="ml-2 hidden sm:inline">Leyenda</span>
                    </button>
                </div>

                {/* Acciones de Edición */}
                {mode === 'edit' && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onSave}
                            className="flex items-center px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex items-center px-3 py-2 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </button>
                    </div>
                )}

                {/* Acciones de Agregar */}
                {mode === 'add' && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Haz clic en el mapa para agregar:</span>
                        <div className="flex space-x-1">
                            <button
                                onClick={() => onAddElement('producer')}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                            >
                                Productor
                            </button>
                            <button
                                onClick={() => onAddElement('crop')}
                                className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                            >
                                Cultivo
                            </button>
                            <button
                                onClick={() => onAddElement('center')}
                                className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                            >
                                Centro
                            </button>
                            <button
                                onClick={() => onAddElement('route')}
                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                            >
                                Ruta
                            </button>
                        </div>
                    </div>
                )}

                {/* Acciones de Medición */}
                {mode === 'measure' && (
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Haz clic para medir distancias y áreas</span>
                        <button
                            onClick={onCancel}
                            className="flex items-center px-2 py-1 text-xs font-medium bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            <X className="w-3 h-3 mr-1" />
                            Salir
                        </button>
                    </div>
                )}
            </div>

            {/* Indicador de Modo */}
            <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                    <Map className="w-4 h-4 mr-2" />
                    <span>
                        Modo actual: <span className="font-medium capitalize">{mode}</span>
                        {mode === 'add' && ' - Selecciona el tipo de elemento a agregar'}
                        {mode === 'edit' && ' - Haz clic en un elemento para editarlo'}
                        {mode === 'measure' && ' - Haz clic para medir distancias y áreas'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MapToolbar; 