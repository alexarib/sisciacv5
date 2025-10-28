import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapZoomControls from './MapZoomControls';
import locationService from '../services/locationService';
import { showMapNotification } from './ui/Toaster';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const EnhancedFullWidthMap = ({
    selectedLayer = 'all',
    onMarkerClick,
    mode = 'view',
    onMapClick,
    drawingMode = null,
    onDrawingComplete,
    onMeasureComplete,
    editMode = false,
    onElementSelect,
    onElementDelete,
    onElementDuplicate,
    onElementMove
}) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const drawingLayerRef = useRef(null);
    const measureLayerRef = useRef(null);
    const editLayerRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawingPoints, setDrawingPoints] = useState([]);
    const [measurePoints, setMeasurePoints] = useState([]);
    const [drawnElements, setDrawnElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mapBounds, setMapBounds] = useState(null);

    // Funciones de zoom y navegación
    const zoomIn = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomIn();
        }
    };

    const zoomOut = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.zoomOut();
        }
    };

    const resetView = () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([6.42375, -66.58973], 6);
        }
    };

    // Cargar ubicaciones desde la API
    const loadLocations = async () => {
        try {
            setLoading(true);
            const response = await locationService.getLocations({
                status: 'active'
            });

            if (response.success) {
                setLocations(response.data.data || []);
                showMapNotification(`${response.data.data?.length || 0} ubicaciones cargadas`, 'success');
            } else {
                console.error('Error loading locations:', response.error);
                showMapNotification('Error al cargar ubicaciones', 'error');
            }
        } catch (error) {
            console.error('Error loading locations:', error);
            showMapNotification('Error al cargar ubicaciones', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Cargar ubicaciones por tipo
    const loadLocationsByType = async (type) => {
        try {
            setLoading(true);
            const response = await locationService.getByType(type);

            if (response.success) {
                setLocations(response.data || []);
                showMapNotification(`${response.data?.length || 0} ubicaciones de tipo ${type} cargadas`, 'success');
            }
        } catch (error) {
            console.error('Error loading locations by type:', error);
            showMapNotification('Error al cargar ubicaciones por tipo', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Cargar ubicaciones por productor
    const loadLocationsByProducer = async (producerId) => {
        try {
            setLoading(true);
            const response = await locationService.getByProducer(producerId);

            if (response.success) {
                setLocations(response.data || []);
                showMapNotification(`${response.data?.length || 0} ubicaciones del productor cargadas`, 'success');
            }
        } catch (error) {
            console.error('Error loading locations by producer:', error);
            showMapNotification('Error al cargar ubicaciones del productor', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Crear marcador personalizado según el tipo
    const createCustomMarker = (location) => {
        const { type, status } = location;

        let iconColor = '#3388ff'; // Azul por defecto
        let iconSymbol = '📍';

        switch (type) {
            case 'farm':
                iconColor = '#28a745'; // Verde
                iconSymbol = '🏡';
                break;
            case 'plot':
                iconColor = '#ffc107'; // Amarillo
                iconSymbol = '🌾';
                break;
            case 'field':
                iconColor = '#17a2b8'; // Cian
                iconSymbol = '🌱';
                break;
            case 'greenhouse':
                iconColor = '#6f42c1'; // Púrpura
                iconSymbol = '🏭';
                break;
            case 'storage':
                iconColor = '#fd7e14'; // Naranja
                iconSymbol = '🏪';
                break;
            default:
                iconColor = '#6c757d'; // Gris
                iconSymbol = '📍';
        }

        // Si está inactivo, hacer más transparente
        if (status === 'inactive') {
            iconColor += '80'; // Agregar transparencia
        }

        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background-color: ${iconColor};
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 2px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ${status === 'inactive' ? 'opacity: 0.6;' : ''}
                ">
                    ${iconSymbol}
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
        });
    };

    // Crear marcador en el mapa
    const createMarker = (location) => {
        const marker = L.marker([location.latitude, location.longitude], {
            icon: createCustomMarker(location)
        });

        // Popup con información de la ubicación
        const popupContent = `
            <div style="min-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">${location.name}</h4>
                <p style="margin: 4px 0; color: #666; font-size: 12px;">
                    <strong>Tipo:</strong> ${location.type}
                </p>
                <p style="margin: 4px 0; color: #666; font-size: 12px;">
                    <strong>Estado:</strong> ${location.status}
                </p>
                ${location.area_hectares ? `
                    <p style="margin: 4px 0; color: #666; font-size: 12px;">
                        <strong>Área:</strong> ${location.area_hectares} ha
                    </p>
                ` : ''}
                ${location.municipality ? `
                    <p style="margin: 4px 0; color: #666; font-size: 12px;">
                        <strong>Ubicación:</strong> ${location.municipality}
                    </p>
                ` : ''}
                ${location.producer ? `
                    <p style="margin: 4px 0; color: #666; font-size: 12px;">
                        <strong>Productor:</strong> ${location.producer.name}
                    </p>
                ` : ''}
                <div style="margin-top: 8px;">
                    <button onclick="window.selectLocation(${location.id})"
                            style="background: #007bff; color: white; border: none; padding: 4px 8px; border-radius: 3px; font-size: 11px; cursor: pointer;">
                        Seleccionar
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);

        // Evento de clic
        marker.on('click', () => {
            if (onMarkerClick) {
                onMarkerClick('location', location);
            }
        });

        return marker;
    };

    // Actualizar marcadores en el mapa
    const updateMarkers = () => {
        // Limpiar marcadores existentes
        markersRef.current.forEach(marker => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.removeLayer(marker);
            }
        });
        markersRef.current = [];

        // Agregar nuevos marcadores
        locations.forEach(location => {
            const marker = createMarker(location);
            if (mapInstanceRef.current) {
                marker.addTo(mapInstanceRef.current);
                markersRef.current.push(marker);
            }
        });
    };

    // Inicializar mapa
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView([6.42375, -66.58973], 6);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Evento de clic en el mapa
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;

            if (onMapClick) {
                onMapClick(lat, lng);
            }
        });

        // Evento de cambio de vista para actualizar bounds
        map.on('moveend', () => {
            const bounds = map.getBounds();
            setMapBounds({
                minLat: bounds.getSouth(),
                maxLat: bounds.getNorth(),
                minLng: bounds.getWest(),
                maxLng: bounds.getEast()
            });
        });

        // Cargar ubicaciones iniciales
        loadLocations();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Actualizar marcadores cuando cambien las ubicaciones
    useEffect(() => {
        if (mapInstanceRef.current && locations.length > 0) {
            updateMarkers();
        }
    }, [locations]);

    // Cargar ubicaciones cuando cambie el layer seleccionado
    useEffect(() => {
        if (selectedLayer === 'all') {
            loadLocations();
        } else if (selectedLayer === 'producers') {
            // Cargar todas las ubicaciones para mostrar en el mapa
            loadLocations();
        } else {
            // Cargar por tipo específico
            loadLocationsByType(selectedLayer);
        }
    }, [selectedLayer]);

    // Función global para seleccionar ubicación (usada en popup)
    useEffect(() => {
        window.selectLocation = (locationId) => {
            const location = locations.find(l => l.id === locationId);
            if (location && onMarkerClick) {
                onMarkerClick('location', location);
            }
        };

        return () => {
            delete window.selectLocation;
        };
    }, [locations, onMarkerClick]);

    return (
        <div className="relative w-full h-full">
            {/* Loading indicator */}
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando ubicaciones...</p>
                    </div>
                </div>
            )}

            {/* Mapa */}
            <div ref={mapRef} className="w-full h-full rounded-lg" />

            {/* Controles de zoom */}
            <MapZoomControls
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onReset={resetView}
            />

            {/* Información de ubicaciones cargadas */}
            {locations.length > 0 && (
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">
                            {locations.length} ubicaciones cargadas
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnhancedFullWidthMap;
