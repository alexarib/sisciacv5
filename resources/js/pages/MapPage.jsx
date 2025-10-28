import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Map,
  Users,
  Sprout,
  Truck,
  Building,
  Filter,
  Layers,
  Info,
  ArrowLeft,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Ruler,
  BarChart3,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import FullWidthMap from '../components/FullWidthMap';
import EnhancedFullWidthMap from '../components/EnhancedFullWidthMap';
import EnhancedLocationForm from '../components/EnhancedLocationForm';
import MapNavigation from '../components/MapNavigation';
import MapToolbar from '../components/MapToolbar';
import LayerControl from '../components/LayerControl';
import DrawingTools from '../components/DrawingTools';
import EnhancedDrawingTools from '../components/EnhancedDrawingTools';
import AnalysisPanel from '../components/AnalysisPanel';
import MapStatistics from '../components/MapStatistics';
import MapElementForm from '../components/MapElementForm';
import MeasurementInstructions from '../components/MeasurementInstructions';
import TestAddElement from '../components/TestAddElement';
import TestMapClick from '../components/TestMapClick';
import DirectFormTest from '../components/DirectFormTest';
import AutoTest from '../components/AutoTest';
import SimpleFormTest from '../components/SimpleFormTest';
import SimpleFormButton from '../components/SimpleFormButton';
import { showMapNotification } from '../components/ui/Toaster';

const MapPage = () => {
  const navigate = useNavigate();

  // State for map functionality
  const [activeModule, setActiveModule] = useState('overview');
  const [mode, setMode] = useState('view'); // view, edit, add, measure
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [drawingMode, setDrawingMode] = useState(null);
  const [showLegend, setShowLegend] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingData, setDrawingData] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);

  // State for panels
  const [showLayerControl, setShowLayerControl] = useState(true);
  const [showDrawingTools, setShowDrawingTools] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);

  // State for element form
  const [showElementForm, setShowElementForm] = useState(false);
  const [elementFormData, setElementFormData] = useState(null);

  // State for simple form test
  const [showSimpleForm, setShowSimpleForm] = useState(false);

  // State for measurement
  const [showMeasurementInstructions, setShowMeasurementInstructions] = useState(false);
  const [measurementData, setMeasurementData] = useState(null);

  // Debug useEffect for form state
  useEffect(() => {
    console.log('showElementForm changed:', showElementForm);
    console.log('elementFormData:', elementFormData);
  }, [showElementForm, elementFormData]);

  // Debug useEffect for mode and drawingMode
  useEffect(() => {
    console.log('Mode/DrawingMode changed:', { mode, drawingMode, isDrawing });
  }, [mode, drawingMode, isDrawing]);

  // Debug useEffect for initial state
  useEffect(() => {
    console.log('Initial state:', {
      showElementForm,
      elementFormData,
      showSimpleForm,
      mode,
      drawingMode,
      isDrawing
    });
  }, []);

  // Debug useEffect for simple form state
  useEffect(() => {
    console.log('Simple form state changed:', { showSimpleForm });
  }, [showSimpleForm]);

  const layers = [
    { id: 'all', name: 'Todos', icon: Layers, color: 'text-gray-600' },
    { id: 'producers', name: 'Productores', icon: Users, color: 'text-blue-600' },
    { id: 'crops', name: 'Cultivos', icon: Sprout, color: 'text-green-600' },
    { id: 'centers', name: 'Centros', icon: Building, color: 'text-red-600' },
    { id: 'routes', name: 'Rutas', icon: Truck, color: 'text-yellow-600' }
  ];

  const legendItems = [
    { icon: '👤', label: 'Productores', color: 'bg-blue-500' },
    { icon: '🌱', label: 'Cultivos', color: 'bg-green-500' },
    { icon: '🏢', label: 'Centros', color: 'bg-red-500' },
    { icon: '🚛', label: 'Rutas', color: 'bg-yellow-500' }
  ];

  // Handle module changes
  const handleModuleChange = (moduleId) => {
    setActiveModule(moduleId);

    // Auto-show relevant panels based on module
    switch (moduleId) {
      case 'drawing':
        setShowDrawingTools(true);
        setShowLayerControl(false);
        setShowAnalysisPanel(false);
        break;
      case 'analysis':
        setShowAnalysisPanel(true);
        setShowDrawingTools(false);
        setShowLayerControl(false);
        break;
      case 'layers':
        setShowLayerControl(true);
        setShowDrawingTools(false);
        setShowAnalysisPanel(false);
        break;
      default:
        setShowLayerControl(true);
        setShowDrawingTools(false);
        setShowAnalysisPanel(false);
    }
  };

  const handleMarkerClick = (type, item) => {
    setSelectedItem({ type, ...item });
    showMapNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} seleccionado: ${item.name}`, 'success');
  };

  const handleMapClick = (lat, lng) => {
    console.log('MapPage handleMapClick called:', { lat, lng, mode, drawingMode });

    if (mode === 'add' && drawingMode) {
      console.log('Add mode detected, drawingMode:', drawingMode);
      // Handle drawing mode clicks
      if (drawingMode === 'marker') {
        console.log('Opening form for marker at:', lat, lng);
        // For markers, open form immediately
        setElementFormData({
          coordinates: { lat, lng },
          elementType: 'marker',
          elementData: null
        });
        setShowElementForm(true);
        console.log('Form should be open now - showElementForm set to true');
      } else {
        // For other drawing modes, continue with drawing
        showMapNotification(`Ubicación seleccionada: Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`, 'info');
      }
    } else {
      // Default map click behavior
      console.log('Default map click behavior');
    }
  };

  const handleDrawingComplete = (data) => {
    setDrawingData(data);
    setIsDrawing(false);

    // Open form for completed drawings
    setElementFormData({
      coordinates: data.center || data.points?.[0] || { lat: 0, lng: 0 },
      elementType: data.type,
      elementData: data
    });
    setShowElementForm(true);

    showMapNotification(`${data.type} creado exitosamente. Completa la información del elemento.`, 'success');
  };

  const handleMeasureComplete = (data) => {
    setMeasurementData(data);
    showMapNotification(`Medición completada: Distancia: ${data.distance.toFixed(2)} km`, 'success');
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'add') {
      setShowDrawingTools(true);
    } else if (newMode === 'measure') {
      setDrawingMode('measure');
      setIsDrawing(true);
    } else {
      setShowDrawingTools(false);
      setDrawingMode(null);
      setIsDrawing(false);
    }
  };

  const handleDrawingModeChange = (newDrawingMode) => {
    setDrawingMode(newDrawingMode);
    setIsDrawing(true);
    setMode('add'); // Automatically switch to add mode

    showMapNotification(`Herramienta ${newDrawingMode} activada. Haz clic en el mapa para comenzar.`, 'info');
  };

  const handleClearDrawing = () => {
    setDrawingData(null);
    setIsDrawing(false);
    setDrawingMode(null);
    setMode('view');
    showMapNotification('Se han eliminado todos los elementos dibujados', 'info');
  };

  const handleSaveDrawing = () => {
    if (drawingData) {
      showMapNotification('El dibujo ha sido guardado exitosamente', 'success');
      setDrawingData(null);
      setIsDrawing(false);
      setDrawingMode(null);
      setMode('view');
    } else {
      showMapNotification('No hay dibujo para guardar. Primero debes crear un dibujo', 'warning');
    }
  };

  const handleCancelDrawing = () => {
    setDrawingData(null);
    setIsDrawing(false);
    setDrawingMode(null);
    setMode('view');
    setShowMeasurementInstructions(false);
    setMeasurementData(null);
    showMapNotification('Se ha cancelado la operación de dibujo', 'info');
  };

  const handleEditMode = (isEditMode) => {
    setEditMode(isEditMode);
    if (isEditMode) {
      setMode('edit');
    } else {
      setMode('view');
    }
  };

  const handleElementSelect = (element) => {
    setSelectedElement(element);
    showMapNotification('Elemento seleccionado. Elemento listo para edición', 'info');
  };

  const handleElementDelete = (element) => {
    setSelectedElement(null);
    showMapNotification('El elemento ha sido eliminado exitosamente', 'success');
  };

  const handleElementDuplicate = (element) => {
    showMapNotification('El elemento ha sido duplicado exitosamente', 'success');
  };

  const handleElementMove = (element) => {
    showMapNotification('El elemento ha sido movido exitosamente', 'success');
  };

  const handleElementFormSave = async (elementInfo) => {
    try {
      console.log('Saving element:', elementInfo);

      // Determinar el tipo de elemento y la API correspondiente
      let apiEndpoint = '';
      let requestData = {};

      switch (elementInfo.type) {
        case 'producer':
          apiEndpoint = '/api/producers';
          requestData = {
            name: elementInfo.name,
            email: elementInfo.contact_email || '',
            phone: elementInfo.contact_phone || '',
            document_number: '',
            document_type: 'V',
            address: elementInfo.commune || '',
            total_area: elementInfo.area || '',
            notes: elementInfo.description || '',
            location_lat: elementInfo.lat,
            location_lng: elementInfo.lng,
            status: elementInfo.status || 'active'
          };
          break;

        case 'crop':
          apiEndpoint = '/api/crops';
          requestData = {
            producer_id: 1, // Default producer ID
            name: elementInfo.name,
            description: elementInfo.description || '',
            area: elementInfo.area || 0,
            status: elementInfo.status || 'active',
            planting_date: new Date().toISOString().split('T')[0],
            expected_harvest_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            area_center_lat: elementInfo.lat,
            area_center_lng: elementInfo.lng
          };
          break;

        case 'center':
          apiEndpoint = '/api/collection-centers';
          requestData = {
            name: elementInfo.name,
            type: 'acopio',
            location: elementInfo.commune || '',
            storage_capacity: elementInfo.capacity || 0,
            contact_person: elementInfo.contact_person || '',
            contact_phone: elementInfo.contact_phone || '',
            contact_email: elementInfo.contact_email || '',
            status: elementInfo.status || 'active',
            location_lat: elementInfo.lat,
            location_lng: elementInfo.lng
          };
          break;

        case 'logistics':
          apiEndpoint = '/api/logistics-routes';
          requestData = {
            name: elementInfo.name,
            description: elementInfo.description || '',
            cargo_type: 'general',
            total_distance: 0,
            estimated_time: 0,
            status: elementInfo.status || 'active',
            route_coordinates: JSON.stringify([{ lat: elementInfo.lat, lng: elementInfo.lng }])
          };
          break;

        default:
          throw new Error('Tipo de elemento no válido');
      }

      // Realizar la petición POST al servidor
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sisciac_token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el elemento');
      }

      const savedElement = await response.json();

      showMapNotification(`${elementInfo.name} ha sido guardado exitosamente como ${elementInfo.type}`, 'success');

      // Reset drawing state
      setDrawingData(null);
      setIsDrawing(false);
      setDrawingMode(null);
      setMode('view');
      setShowElementForm(false);
      setElementFormData(null);

      // Forzar recarga del mapa para mostrar el nuevo elemento
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      // Retornar resultado exitoso
      return { success: true, data: savedElement };

    } catch (error) {
      console.error('Error saving element:', error);
      showMapNotification('No se pudo guardar el elemento. Inténtalo de nuevo.', 'error');

      // Retornar resultado de error
      return { success: false, message: error.message };
    }
  };

  const handleElementFormClose = () => {
    setShowElementForm(false);
    setElementFormData(null);

    // Reset drawing state if canceling
    if (isDrawing) {
      setDrawingData(null);
      setIsDrawing(false);
      setDrawingMode(null);
      setMode('view');
    }
  };

  // Funciones de zoom y navegación
  const handleZoomIn = () => {
    // Esta función se conectará con el componente del mapa
    showMapNotification('Acercando el mapa', 'info');
  };

  const handleZoomOut = () => {
    // Esta función se conectará con el componente del mapa
    showMapNotification('Alejando el mapa', 'info');
  };

  const handleReset = () => {
    // Esta función se conectará con el componente del mapa
    showMapNotification('Mapa reseteado a la vista inicial', 'info');
  };

  // Función para agregar elementos desde el toolbar
  const handleAddElement = (type) => {
    console.log('handleAddElement called with type:', type);
    setDrawingMode('marker');
    setIsDrawing(true);
    setMode('add');

    console.log('State updated - drawingMode: marker, mode: add, isDrawing: true');

    showMapNotification(`Haz clic en el mapa para agregar un ${type}`, 'info');
  };

  const handleOpenFormDirectly = (formData) => {
    console.log('handleOpenFormDirectly called with:', formData);
    setElementFormData(formData);
    setShowElementForm(true);
    console.log('Form opened directly - showElementForm set to true');
  };

  const handleOpenSimpleForm = () => {
    console.log('handleOpenSimpleForm called');
    setShowSimpleForm(true);
    console.log('Simple form opened - showSimpleForm set to true');
  };

  const handleCloseSimpleForm = () => {
    console.log('handleCloseSimpleForm called');
    setShowSimpleForm(false);
    console.log('Simple form closed - showSimpleForm set to false');
  };

  // Función para activar medición
  const handleMeasure = () => {
    setMode('measure');
    setDrawingMode('measure');
    setIsDrawing(true);
    setShowMeasurementInstructions(true);

    showMapNotification('Haz clic en el mapa para medir distancias y áreas', 'info');
  };

  const handleRunAnalysis = async (analysisType) => {
    try {
      const response = await fetch(`/api/geographic-analysis/${analysisType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commune: null,
          include_heatmap: true
        })
      });

      const data = await response.json();
      setAnalysisData(data.analysis || data);

      showMapNotification('El análisis geográfico se ha ejecutado exitosamente', 'success');
    } catch (error) {
      showMapNotification('No se pudo ejecutar el análisis geográfico', 'error');
    }
  };

  const handleExportAnalysis = () => {
    if (analysisData) {
      showMapNotification('El análisis ha sido exportado exitosamente', 'success');
    }
  };

  const handleRefreshAnalysis = () => {
    setAnalysisData(null);
    showMapNotification('Se han actualizado los datos del análisis', 'info');
  };

  const handleBackClick = () => {
    navigate('/admin');
  };

  return (
    <>
      <Helmet>
        <title>Mapa Interactivo - SCIAC</title>
        <meta name="description" content="Mapa interactivo de georreferenciación del Sistema de Control de Procesos Agrícolas" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <button
                  onClick={handleBackClick}
                  className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mapa Interactivo</h1>
                  <p className="text-gray-600">Georreferenciación y gestión de procesos agrícolas</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAnalysisPanel(!showAnalysisPanel)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Análisis
                </button>
                <button
                  onClick={() => setShowLegend(!showLegend)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {showLegend ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showLegend ? 'Ocultar' : 'Mostrar'} Leyenda
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <MapNavigation
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
        />

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 space-y-6">

            {/* Section 1: Statistics - Full Width */}
            <section className="w-full">
              <MapStatistics selectedLayer={selectedLayer} />
            </section>

            {/* Section 2: Controls and Tools - Full Width */}
            <section className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Sidebar Controls */}
                <div className="lg:col-span-1 space-y-6">

                  {/* Map Toolbar */}
                  <MapToolbar
                    mode={mode}
                    onModeChange={handleModeChange}
                    onAddElement={handleAddElement}
                    onMeasure={handleMeasure}
                    onSearch={() => showMapNotification('Función de búsqueda', 'info')}
                    onLayers={() => setShowLayerControl(!showLayerControl)}
                    onAnalysis={() => setShowAnalysisPanel(!showAnalysisPanel)}
                    onSave={handleSaveDrawing}
                    onCancel={handleCancelDrawing}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onReset={handleReset}
                    showLegend={showLegend}
                    onToggleLegend={() => setShowLegend(!showLegend)}
                  />

                  {/* Layer Control */}
                  {showLayerControl && (
                    <LayerControl
                      layers={layers}
                      onLayerToggle={(layerId) => setSelectedLayer(layerId)}
                      onLayerOpacityChange={(layerId, opacity) => {
                        showMapNotification(`Capa ${layerId}: ${opacity * 100}%`, 'info');
                      }}
                      onLayerFilter={(layerId) => {
                        showMapNotification(`Filtros para ${layerId}`, 'info');
                      }}
                      selectedLayer={selectedLayer}
                      onLayerSelect={setSelectedLayer}
                    />
                  )}

                  {/* Analysis Panel */}
                  {showAnalysisPanel && (
                    <AnalysisPanel
                      analysisData={analysisData}
                      onRunAnalysis={handleRunAnalysis}
                      onExportAnalysis={handleExportAnalysis}
                      onRefreshAnalysis={handleRefreshAnalysis}
                    />
                  )}

                  {/* Selected Item Info */}
                  {selectedItem && (
                    <div className="bg-white rounded-lg shadow p-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">
                        Información Seleccionada
                      </h4>
                      <div className="bg-gray-50 rounded-md p-3">
                        <h5 className="font-medium text-gray-900">{selectedItem.name}</h5>
                        <p className="text-sm text-gray-600 capitalize">
                          Tipo: {selectedItem.type}
                        </p>
                        {selectedItem.commune && (
                          <p className="text-sm text-gray-600">
                            Comuna: {selectedItem.commune}
                          </p>
                        )}
                        {selectedItem.status && (
                          <p className="text-sm text-gray-600">
                            Estado: {selectedItem.status}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                     {/* Right Side - Drawing Tools or Empty Space */}
                     <div className="lg:col-span-3">
                       {(activeModule === 'drawing' || showDrawingTools) && (
                         <EnhancedDrawingTools
                           drawingMode={drawingMode}
                           onDrawingModeChange={handleDrawingModeChange}
                           onClearDrawing={handleClearDrawing}
                           onSaveDrawing={handleSaveDrawing}
                           onCancelDrawing={handleCancelDrawing}
                           isDrawing={isDrawing}
                           drawingData={drawingData}
                           onEditMode={handleEditMode}
                           onDeleteElement={handleElementDelete}
                           onDuplicateElement={handleElementDuplicate}
                           onMoveElement={handleElementMove}
                           onElementSelect={handleElementSelect}
                           selectedElement={selectedElement}
                         />
                       )}
                     </div>
              </div>
            </section>

            {/* Section 3: Map - Full Width Independent Section */}
            <section className="w-full">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Map className="w-5 h-5 mr-2" />
                    Mapa del Municipio Simón Bolívar
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Visualiza y gestiona productores, cultivos, centros de acopio y rutas logísticas
                  </p>
                </div>

                     <div className="p-4">
                       <EnhancedFullWidthMap
                         selectedLayer={selectedLayer}
                         onMarkerClick={handleMarkerClick}
                         mode={mode}
                         onMapClick={handleMapClick}
                         drawingMode={drawingMode}
                         onDrawingComplete={handleDrawingComplete}
                         onMeasureComplete={handleMeasureComplete}
                         editMode={editMode}
                         onElementSelect={handleElementSelect}
                         onElementDelete={handleElementDelete}
                         onElementDuplicate={handleElementDuplicate}
                         onElementMove={handleElementMove}
                       />
                     </div>
              </div>
            </section>
          </div>
        </div>

             {/* Element Form Modal */}
             <MapElementForm
               isOpen={showElementForm}
               onClose={handleElementFormClose}
               onSave={handleElementFormSave}
               elementType={elementFormData?.elementType}
               coordinates={elementFormData?.coordinates}
               elementData={elementFormData?.elementData}
             />

             {/* Enhanced Location Form Modal */}
             <EnhancedLocationForm
               isOpen={showElementForm && elementFormData?.elementType === 'location'}
               onClose={handleElementFormClose}
               onSave={handleElementFormSave}
               coordinates={elementFormData?.coordinates}
               locationData={elementFormData?.elementData}
             />

        {/* Measurement Instructions */}
        <MeasurementInstructions
          isVisible={showMeasurementInstructions}
          onClose={() => setShowMeasurementInstructions(false)}
          measurementData={measurementData}
        />

        {/* Test Component */}
        <TestAddElement onTestAdd={handleAddElement} />
        <TestMapClick onTestMapClick={handleMapClick} />
        <DirectFormTest onOpenForm={handleOpenFormDirectly} />
        <AutoTest
          onTestAdd={handleAddElement}
          onTestMapClick={handleMapClick}
          onOpenForm={handleOpenFormDirectly}
        />
        <SimpleFormButton onOpenSimpleForm={handleOpenSimpleForm} />

        {/* Simple Form Test */}
        <SimpleFormTest
          isOpen={showSimpleForm}
          onClose={handleCloseSimpleForm}
        />
      </div>
    </>
  );
};

export default MapPage;
