import React, { useState } from 'react';
import {
    MousePointer,
    Square,
    Circle,
    MapPin,
    Navigation,
    Ruler,
    X,
    RotateCcw,
    Save,
    Trash2,
    Move,
    Edit,
    Copy,
    Scissors,
    Users,
    Sprout,
    Building,
    Truck
} from 'lucide-react';

const DrawingTools = ({
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
    onMoveElement
}) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);

    const drawingModes = [
        { id: 'select', label: 'Seleccionar', icon: MousePointer, color: 'text-blue-600', description: 'Seleccionar elementos existentes' },
        { id: 'marker', label: 'Marcador', icon: MapPin, color: 'text-red-600', description: 'Crear punto de referencia' },
        { id: 'polygon', label: 'Polígono', icon: Square, color: 'text-green-600', description: 'Dibujar área poligonal' },
        { id: 'circle', label: 'Círculo', icon: Circle, color: 'text-purple-600', description: 'Dibujar área circular' },
        { id: 'line', label: 'Línea', icon: Navigation, color: 'text-yellow-600', description: 'Dibujar línea o ruta' },
        { id: 'measure', label: 'Medir', icon: Ruler, color: 'text-orange-600', description: 'Medir distancias y áreas' }
    ];

    const elementTypes = [
        { id: 'producer', label: 'Productor', icon: Users, color: 'text-blue-600' },
        { id: 'crop', label: 'Cultivo', icon: Sprout, color: 'text-green-600' },
        { id: 'center', label: 'Centro', icon: Building, color: 'text-red-600' },
        { id: 'logistics', label: 'Logística', icon: Truck, color: 'text-yellow-600' }
    ];

    const getDrawingInstructions = () => {
        switch (drawingMode) {
            case 'marker':
                return 'Haz clic en el mapa para agregar un marcador. Se abrirá un formulario para especificar el tipo de elemento (Productor, Cultivo, Centro, Logística).';
            case 'polygon':
                return 'Haz clic para agregar puntos del polígono. Doble clic para finalizar. Se abrirá un formulario para especificar el tipo de área.';
            case 'circle':
                return 'Haz clic y arrastra para dibujar un círculo. Se abrirá un formulario para especificar el tipo de área.';
            case 'line':
                return 'Haz clic para agregar puntos de la línea. Doble clic para finalizar. Se abrirá un formulario para especificar el tipo de ruta.';
            case 'measure':
                return 'Haz clic para medir distancias y áreas. Los elementos se pueden arrastrar.';
            case 'select':
                return 'Haz clic en un elemento para seleccionarlo. Puedes arrastrarlo para moverlo.';
            default:
                return 'Selecciona una herramienta de dibujo para comenzar';
        }
    };

    const handleToolSelect = (tool) => {
        console.log('DrawingTools: handleToolSelect called with tool:', tool);

        // Si ya está seleccionada, deseleccionar
        if (selectedTool === tool) {
            setSelectedTool(null);
            if (onToolChange) {
                onToolChange(null);
            }
            console.log('DrawingTools: Tool deselected');
            return;
        }

        // Seleccionar nueva herramienta
        setSelectedTool(tool);

        if (onToolChange) {
            onToolChange(tool);
        }

        // Mostrar notificación según la herramienta
        let message = '';
        switch (tool) {
            case 'marker':
                message = 'Modo marcador activado. Haga clic en el mapa para agregar un marcador.';
                break;
            case 'polygon':
                message = 'Modo polígono activado. Haga clic para crear vértices, doble clic para finalizar.';
                break;
            case 'line':
                message = 'Modo línea activado. Haga clic para crear puntos, doble clic para finalizar.';
                break;
            case 'circle':
                message = 'Modo círculo activado. Haga clic y arrastre para dibujar un círculo.';
                break;
            default:
                message = `Herramienta ${tool} activada.`;
        }

        if (onShowNotification) {
            onShowNotification(message);
        }

        console.log('DrawingTools: Tool selected:', tool);
    };

    const handleEditMode = () => {
        setEditMode(!editMode);
        if (onEditMode) {
            onEditMode(!editMode);
        }
    };

    const handleDeleteElement = () => {
        if (selectedElement && onDeleteElement) {
            onDeleteElement(selectedElement);
            setSelectedElement(null);
        }
    };

    const handleDuplicateElement = () => {
        if (selectedElement && onDuplicateElement) {
            onDuplicateElement(selectedElement);
        }
    };

    const handleMoveElement = () => {
        if (selectedElement && onMoveElement) {
            onMoveElement(selectedElement);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Herramientas de Dibujo</h3>
                <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm text-gray-600 hover:text-gray-900"
                >
                    {showAdvanced ? 'Ocultar' : 'Avanzado'}
                </button>
            </div>

            {/* Drawing Mode Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {drawingModes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => handleToolSelect(mode.id)}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${drawingMode === mode.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        title={mode.description}
                    >
                        <mode.icon className={`w-5 h-5 mb-1 ${mode.color}`} />
                        <span className="text-xs font-medium text-gray-700">{mode.label}</span>
                    </button>
                ))}
            </div>

            {/* Active Tool Indicator */}
            {drawingMode && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-blue-800">
                            Herramienta Activa: {drawingModes.find(m => m.id === drawingMode)?.label}
                        </span>
                    </div>
                    <p className="text-sm text-blue-700">{getDrawingInstructions()}</p>
                </div>
            )}

            {/* Element Types Preview */}
            {drawingMode && drawingMode !== 'select' && drawingMode !== 'measure' && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Tipos de Elementos Disponibles:</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {elementTypes.map((type) => (
                            <div key={type.id} className="flex items-center p-2 bg-gray-50 rounded-md">
                                <type.icon className={`w-4 h-4 mr-2 ${type.color}`} />
                                <span className="text-xs text-gray-700">{type.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edit Controls */}
            <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Controles de Edición</h4>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleEditMode}
                        className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${editMode
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <Edit className="w-4 h-4 mr-2" />
                        {editMode ? 'Edición Activa' : 'Activar Edición'}
                    </button>
                    <button
                        onClick={handleMoveElement}
                        className="flex items-center justify-center px-3 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                    >
                        <Move className="w-4 h-4 mr-2" />
                        Mover
                    </button>
                    <button
                        onClick={handleDuplicateElement}
                        className="flex items-center justify-center px-3 py-2 text-sm font-medium bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                    </button>
                    <button
                        onClick={handleDeleteElement}
                        className="flex items-center justify-center px-3 py-2 text-sm font-medium bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar
                    </button>
                </div>
            </div>

            {/* Drawing Actions */}
            {isDrawing && (
                <div className="flex space-x-2 mb-4">
                    <button
                        onClick={onSaveDrawing}
                        className="flex items-center px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                    </button>
                    <button
                        onClick={onCancelDrawing}
                        className="flex items-center px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                    </button>
                    <button
                        onClick={onClearDrawing}
                        className="flex items-center px-3 py-2 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpiar
                    </button>
                </div>
            )}

            {/* Drawing Data Display */}
            {drawingData && Object.keys(drawingData).length > 0 && (
                <div className="border border-gray-200 rounded-lg p-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Datos del Dibujo</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                        {drawingData.area && (
                            <div>Área: {drawingData.area.toFixed(2)} km²</div>
                        )}
                        {drawingData.perimeter && (
                            <div>Perímetro: {drawingData.perimeter.toFixed(2)} km</div>
                        )}
                        {drawingData.distance && (
                            <div>Distancia: {drawingData.distance.toFixed(2)} km</div>
                        )}
                        {drawingData.points && (
                            <div>Puntos: {drawingData.points.length}</div>
                        )}
                        {drawingData.radius && (
                            <div>Radio: {drawingData.radius.toFixed(2)} km</div>
                        )}
                    </div>
                </div>
            )}

            {/* Advanced Options */}
            {showAdvanced && (
                <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Opciones Avanzadas</h4>

                    <div className="space-y-3">
                        {/* Line Style */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Estilo de Línea
                            </label>
                            <select className="w-full text-sm border border-gray-300 rounded px-2 py-1">
                                <option value="solid">Sólida</option>
                                <option value="dashed">Punteada</option>
                                <option value="dotted">Puntos</option>
                            </select>
                        </div>

                        {/* Line Width */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Grosor de Línea
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                defaultValue="3"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Fill Color */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Color de Relleno
                            </label>
                            <div className="flex space-x-2">
                                {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'].map((color) => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Border Color */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Color de Borde
                            </label>
                            <div className="flex space-x-2">
                                {['#1E40AF', '#059669', '#D97706', '#DC2626', '#7C3AED', '#EA580C'].map((color) => (
                                    <button
                                        key={color}
                                        className="w-6 h-6 rounded border-2 border-gray-300 hover:border-gray-400"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Opacity */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Opacidad
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                defaultValue="0.7"
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Snap to Grid */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="snapToGrid"
                                className="mr-2"
                            />
                            <label htmlFor="snapToGrid" className="text-xs text-gray-700">
                                Ajustar a cuadrícula
                            </label>
                        </div>

                        {/* Show Coordinates */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="showCoordinates"
                                className="mr-2"
                            />
                            <label htmlFor="showCoordinates" className="text-xs text-gray-700">
                                Mostrar coordenadas
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="border-t border-gray-200 pt-4">
                <div className="flex space-x-2">
                    <button className="flex-1 text-xs bg-blue-100 text-blue-800 py-2 px-3 rounded hover:bg-blue-200 transition-colors">
                        Exportar Dibujo
                    </button>
                    <button className="flex-1 text-xs bg-gray-100 text-gray-800 py-2 px-3 rounded hover:bg-gray-200 transition-colors">
                        Importar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DrawingTools; 