import React, { useState, useEffect } from 'react';
import {
    Pencil,
    Square,
    Circle,
    Triangle,
    Ruler,
    MapPin,
    Save,
    Trash2,
    Edit3,
    Copy,
    Move,
    RotateCcw
} from 'lucide-react';
import locationService from '../services/locationService';
import { showMapNotification } from './ui/Toaster';

const EnhancedDrawingTools = ({
    drawingMode,
    onDrawingModeChange,
    onClearDrawing,
    onSaveDrawing,
    onCancelDrawing,
    isDrawing,
    drawingData,
    onEditMode,
    onDeleteElement,
    onDuplicateElement,
    onMoveElement,
    onElementSelect,
    selectedElement
}) => {
    const [savedElements, setSavedElements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSavedElements, setShowSavedElements] = useState(false);

    // Cargar elementos guardados al montar el componente
    useEffect(() => {
        loadSavedElements();
    }, []);

    // Cargar elementos guardados desde la API
    const loadSavedElements = async () => {
        try {
            setLoading(true);
            const response = await locationService.getLocations({
                status: 'active'
            });

            if (response.success) {
                setSavedElements(response.data.data || []);
            }
        } catch (error) {
            console.error('Error loading saved elements:', error);
            showMapNotification('Error al cargar elementos guardados', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Herramientas de dibujo disponibles
    const drawingTools = [
        {
            id: 'marker',
            name: 'Marcador',
            icon: MapPin,
            description: 'Agregar punto en el mapa',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 hover:bg-blue-200'
        },
        {
            id: 'polygon',
            name: 'Polígono',
            icon: Pencil,
            description: 'Dibujar área cerrada',
            color: 'text-green-600',
            bgColor: 'bg-green-100 hover:bg-green-200'
        },
        {
            id: 'rectangle',
            name: 'Rectángulo',
            icon: Square,
            description: 'Dibujar rectángulo',
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 hover:bg-purple-200'
        },
        {
            id: 'circle',
            name: 'Círculo',
            icon: Circle,
            description: 'Dibujar círculo',
            color: 'text-orange-600',
            bgColor: 'bg-orange-100 hover:bg-orange-200'
        },
        {
            id: 'measure',
            name: 'Medir',
            icon: Ruler,
            description: 'Medir distancias y áreas',
            color: 'text-red-600',
            bgColor: 'bg-red-100 hover:bg-red-200'
        }
    ];

    // Manejar selección de herramienta
    const handleToolSelect = (toolId) => {
        if (onDrawingModeChange) {
            onDrawingModeChange(toolId);
        }
        showMapNotification(`Herramienta ${toolId} seleccionada`, 'info');
    };

    // Guardar elemento dibujado
    const handleSaveElement = async (elementData) => {
        try {
            setLoading(true);

            // Determinar el tipo de ubicación basado en la herramienta
            let locationType = 'field';
            switch (drawingMode) {
                case 'marker':
                    locationType = 'field';
                    break;
                case 'polygon':
                    locationType = 'plot';
                    break;
                case 'rectangle':
                case 'circle':
                    locationType = 'field';
                    break;
                default:
                    locationType = 'field';
            }

            // Preparar datos para la API
            const locationData = {
                name: elementData.name || `Elemento ${new Date().toLocaleString()}`,
                description: `Elemento creado con herramienta ${drawingMode}`,
                type: locationType,
                latitude: elementData.center?.lat || elementData.points?.[0]?.lat || 0,
                longitude: elementData.center?.lng || elementData.points?.[0]?.lng || 0,
                area_hectares: elementData.area || 0,
                status: 'active',
                boundaries: elementData.points ? JSON.stringify(elementData.points) : null,
                center_point: elementData.center ? JSON.stringify(elementData.center) : null
            };

            const response = await locationService.createLocation(locationData);

            if (response.success) {
                showMapNotification('Elemento guardado exitosamente', 'success');
                await loadSavedElements(); // Recargar elementos
                if (onSaveDrawing) {
                    onSaveDrawing(response.data);
                }
            } else {
                showMapNotification('Error al guardar elemento', 'error');
            }
        } catch (error) {
            console.error('Error saving element:', error);
            showMapNotification('Error al guardar elemento', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Eliminar elemento
    const handleDeleteElement = async (elementId) => {
        try {
            setLoading(true);
            const response = await locationService.deleteLocation(elementId);

            if (response.success) {
                showMapNotification('Elemento eliminado exitosamente', 'success');
                await loadSavedElements(); // Recargar elementos
                if (onDeleteElement) {
                    onDeleteElement(elementId);
                }
            } else {
                showMapNotification('Error al eliminar elemento', 'error');
            }
        } catch (error) {
            console.error('Error deleting element:', error);
            showMapNotification('Error al eliminar elemento', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Duplicar elemento
    const handleDuplicateElement = async (element) => {
        try {
            setLoading(true);

            const duplicatedData = {
                ...element,
                name: `${element.name} (Copia)`,
                id: undefined // Para crear nuevo elemento
            };

            delete duplicatedData.id;
            delete duplicatedData.created_at;
            delete duplicatedData.updated_at;

            const response = await locationService.createLocation(duplicatedData);

            if (response.success) {
                showMapNotification('Elemento duplicado exitosamente', 'success');
                await loadSavedElements(); // Recargar elementos
                if (onDuplicateElement) {
                    onDuplicateElement(response.data);
                }
            } else {
                showMapNotification('Error al duplicar elemento', 'error');
            }
        } catch (error) {
            console.error('Error duplicating element:', error);
            showMapNotification('Error al duplicar elemento', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Seleccionar elemento
    const handleSelectElement = (element) => {
        if (onElementSelect) {
            onElementSelect(element);
        }
        showMapNotification(`Elemento "${element.name}" seleccionado`, 'info');
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Pencil className="w-5 h-5 mr-2 text-blue-600" />
                    Herramientas de Dibujo
                </h3>
                <button
                    onClick={() => setShowSavedElements(!showSavedElements)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                    {showSavedElements ? 'Ocultar' : 'Mostrar'} Guardados
                </button>
            </div>

            {/* Herramientas de dibujo */}
            <div className="grid grid-cols-2 gap-3">
                {drawingTools.map((tool) => {
                    const IconComponent = tool.icon;
                    const isActive = drawingMode === tool.id;

                    return (
                        <button
                            key={tool.id}
                            onClick={() => handleToolSelect(tool.id)}
                            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                isActive
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            } ${tool.bgColor}`}
                            title={tool.description}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <IconComponent className={`w-6 h-6 ${tool.color}`} />
                                <span className="text-sm font-medium text-gray-700">
                                    {tool.name}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Estado de dibujo */}
            {isDrawing && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-yellow-800">
                            Modo dibujo activo: {drawingMode}
                        </span>
                    </div>
                    <p className="text-xs text-yellow-700 mt-1">
                        Haz clic en el mapa para comenzar a dibujar
                    </p>
                </div>
            )}

            {/* Datos de dibujo actual */}
            {drawingData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">
                        Elemento Dibujado
                    </h4>
                    <div className="space-y-2">
                        <p className="text-xs text-green-700">
                            <strong>Tipo:</strong> {drawingData.type}
                        </p>
                        {drawingData.area && (
                            <p className="text-xs text-green-700">
                                <strong>Área:</strong> {drawingData.area.toFixed(2)} ha
                            </p>
                        )}
                        {drawingData.points && (
                            <p className="text-xs text-green-700">
                                <strong>Puntos:</strong> {drawingData.points.length}
                            </p>
                        )}
                    </div>
                    <div className="flex space-x-2 mt-3">
                        <button
                            onClick={() => handleSaveElement(drawingData)}
                            disabled={loading}
                            className="flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            <Save className="w-3 h-3 mr-1" />
                            Guardar
                        </button>
                        <button
                            onClick={onCancelDrawing}
                            className="flex items-center px-3 py-1 bg-gray-500 text-white text-xs rounded-md hover:bg-gray-600"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Elementos guardados */}
            {showSavedElements && (
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Elementos Guardados ({savedElements.length})
                    </h4>

                    {loading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-xs text-gray-500 mt-2">Cargando...</p>
                        </div>
                    ) : savedElements.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {savedElements.map((element) => (
                                <div
                                    key={element.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                        selectedElement?.id === element.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => handleSelectElement(element)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {element.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {element.type} • {element.municipality || 'Sin ubicación'}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-1 ml-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDuplicateElement(element);
                                                }}
                                                className="p-1 text-gray-400 hover:text-blue-600"
                                                title="Duplicar"
                                            >
                                                <Copy className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteElement(element.id);
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-600"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-500">No hay elementos guardados</p>
                        </div>
                    )}
                </div>
            )}

            {/* Controles de acción */}
            <div className="flex space-x-2 pt-4 border-t">
                <button
                    onClick={onClearDrawing}
                    className="flex items-center px-3 py-2 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Limpiar
                </button>
                <button
                    onClick={() => onEditMode && onEditMode(!editMode)}
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                        editMode
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {editMode ? 'Salir Edición' : 'Editar'}
                </button>
            </div>
        </div>
    );
};

export default EnhancedDrawingTools;
