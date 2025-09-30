import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapZoomControls from './MapZoomControls';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const FullWidthMap = ({
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
            mapInstanceRef.current.setView([10.4806, -66.9036], 12);
        }
    };

    // Exponer funciones de zoom al componente padre
    useEffect(() => {
        // Las funciones de zoom están disponibles para el componente padre
    }, []);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView([10.4806, -66.9036], 12);

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);

            // Initialize layers
            drawingLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
            measureLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
            editLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

            // Add map click handler
            mapInstanceRef.current.on('click', handleMapClick);

            // Add double click handler for finishing polygons/lines
            mapInstanceRef.current.on('dblclick', handleMapDoubleClick);
        }

        // Clear existing markers
        clearMarkers();
        clearDrawing();
        clearMeasurements();
        clearEditLayer();

        // Load data based on selected layer
        loadMapData();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.off('click', handleMapClick);
                mapInstanceRef.current.off('dblclick', handleMapDoubleClick);
            }
        };
    }, [selectedLayer, mode, editMode]);

    const clearMarkers = () => {
        markersRef.current.forEach(marker => {
            mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];
    };

    const clearDrawing = () => {
        if (drawingLayerRef.current) {
            drawingLayerRef.current.clearLayers();
        }
        setDrawingPoints([]);
        setIsDrawing(false);
    };

    const clearMeasurements = () => {
        if (measureLayerRef.current) {
            measureLayerRef.current.clearLayers();
        }
        setMeasurePoints([]);
    };

    const clearEditLayer = () => {
        if (editLayerRef.current) {
            editLayerRef.current.clearLayers();
        }
    };

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        console.log('FullWidthMap handleMapClick:', { lat, lng, mode, drawingMode, editMode });

        if (mode === 'add' && drawingMode) {
            console.log('FullWidthMap: Add mode detected, calling handleDrawingClick');
            handleDrawingClick(lat, lng);
        } else if (mode === 'measure' || drawingMode === 'measure') {
            console.log('FullWidthMap: Measure mode detected, calling handleMeasureClick');
            handleMeasureClick(lat, lng);
        } else if (editMode || mode === 'edit') {
            console.log('FullWidthMap: Edit mode detected, calling handleEditClick');
            handleEditClick(lat, lng);
        } else {
            console.log('FullWidthMap: Default map click behavior');
        }
    };

    const handleMapDoubleClick = (e) => {
        if (drawingMode === 'polygon' || drawingMode === 'line') {
            finishDrawing();
        }
    };

    const handleDrawingClick = (lat, lng) => {
        const point = { lat, lng };
        console.log('FullWidthMap handleDrawingClick:', { lat, lng, drawingMode });

        if (drawingMode === 'marker') {
            // Para marcadores, agregar temporalmente al mapa y abrir formulario
            console.log('FullWidthMap: Marker click detected, adding temporary marker');

            // Agregar marcador temporal al mapa
            const tempMarker = addMarker({
                lat: lat,
                lng: lng,
                name: 'Nuevo Elemento',
                description: 'Elemento temporal - Complete la información'
            }, 'custom');

            // Agregar a la lista de elementos dibujados temporalmente
            const tempElement = {
                type: 'marker',
                coordinates: { lat, lng },
                element: tempMarker,
                id: Date.now(),
                isTemporary: true
            };
            setDrawnElements(prev => [...prev, tempElement]);

            // Llamar a onMapClick para abrir el formulario
            if (onMapClick) {
                console.log('FullWidthMap: Calling onMapClick to open form');
                onMapClick(lat, lng);
            } else {
                console.log('FullWidthMap: onMapClick function is null or undefined');
            }
        } else if (drawingMode === 'polygon' || drawingMode === 'line') {
            setDrawingPoints(prev => [...prev, point]);
            addDrawingPoint(point);

            if (drawingMode === 'line' && drawingPoints.length >= 1) {
                const lastPoint = drawingPoints[drawingPoints.length - 1];
                addDrawingLine(lastPoint, point);
            }
        } else if (drawingMode === 'circle') {
            if (!isDrawing) {
                setIsDrawing(true);
                setDrawingPoints([point]);
            } else {
                const center = drawingPoints[0];
                const radius = calculateDistance(center, point);
                const circleElement = addDrawingCircle(center, radius);
                setIsDrawing(false);
                setDrawingPoints([]);

                if (onDrawingComplete) {
                    onDrawingComplete({
                        type: 'circle',
                        center: center,
                        radius: radius,
                        area: Math.PI * radius * radius,
                        element: circleElement,
                        id: Date.now()
                    });
                }
            }
        }
    };

    const handleMeasureClick = (lat, lng) => {
        const point = { lat, lng };
        setMeasurePoints(prev => [...prev, point]);
        addMeasurePoint(point);

        if (measurePoints.length >= 1) {
            const lastPoint = measurePoints[measurePoints.length - 1];
            const distance = calculateDistance(lastPoint, point);
            addMeasureLine(lastPoint, point, distance);

            if (onMeasureComplete) {
                onMeasureComplete({
                    type: 'distance',
                    points: [...measurePoints, point],
                    distance: distance
                });
            }
        }

        // Si es el primer punto, mostrar instrucciones
        if (measurePoints.length === 0) {
            console.log('Haz clic en otro punto para medir la distancia');
        }
    };

    const handleEditClick = (lat, lng) => {
        const clickedElement = findElementAtPosition(lat, lng);
        if (clickedElement) {
            setSelectedElement(clickedElement);
            if (onElementSelect) {
                onElementSelect(clickedElement);
            }
            highlightElement(clickedElement);
        }
    };

    const finishDrawing = () => {
        if (drawingMode === 'polygon' && drawingPoints.length >= 3) {
            const polygonElement = addDrawingPolygon(drawingPoints);
            const area = calculatePolygonArea(drawingPoints);
            const perimeter = calculatePolygonPerimeter(drawingPoints);

            // Add to drawn elements for tracking
            const elementData = {
                type: 'polygon',
                points: drawingPoints,
                area: area,
                perimeter: perimeter,
                element: polygonElement,
                id: Date.now()
            };
            setDrawnElements(prev => [...prev, elementData]);

            if (onDrawingComplete) {
                onDrawingComplete(elementData);
            }
        } else if (drawingMode === 'line' && drawingPoints.length >= 2) {
            const lineElement = addDrawingPolyline(drawingPoints);
            const distance = calculatePolylineDistance(drawingPoints);

            // Add to drawn elements for tracking
            const elementData = {
                type: 'line',
                points: drawingPoints,
                distance: distance,
                element: lineElement,
                id: Date.now()
            };
            setDrawnElements(prev => [...prev, elementData]);

            if (onDrawingComplete) {
                onDrawingComplete(elementData);
            }
        }

        setDrawingPoints([]);
        setIsDrawing(false);
    };

    const addMarker = (point, type = 'data') => {
        const getMarkerIcon = (type) => {
            const iconColors = {
                producers: '#3B82F6',
                crops: '#10B981',
                centers: '#EF4444',
                routes: '#F59E0B',
                custom: '#8B5CF6',
                temporary: '#FF6B6B'
            };

            const color = iconColors[type] || '#6B7280';
            const isTemporary = type === 'temporary' || type === 'custom';

            return L.divIcon({
                className: 'custom-marker',
                html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); ${isTemporary ? 'animation: pulse 2s infinite;' : ''}"></div>`,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
        };

        const marker = L.marker([point.lat, point.lng], {
            icon: getMarkerIcon(type),
            draggable: editMode || type === 'custom' || type === 'temporary'
        }).addTo(mapInstanceRef.current);

        // Add popup with more detailed information
        const popupContent = `
            <div class="p-3 min-w-[200px]">
                <h3 class="font-semibold text-gray-900 mb-2">${point.name || 'Nuevo Punto'}</h3>
                <div class="space-y-1 text-sm text-gray-600">
                    <p><strong>Tipo:</strong> ${type}</p>
                    <p><strong>Lat:</strong> ${point.lat.toFixed(6)}</p>
                    <p><strong>Lng:</strong> ${point.lng.toFixed(6)}</p>
                    ${point.description ? `<p><strong>Descripción:</strong> ${point.description}</p>` : ''}
                    ${type === 'temporary' ? '<p class="text-orange-600 font-medium">⚠️ Elemento temporal - Complete la información</p>' : ''}
                </div>
                ${editMode ? `
                    <div class="mt-3 pt-2 border-t border-gray-200">
                        <button class="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-1" onclick="editElement('${point.id || 'temp'}')">Editar</button>
                        <button class="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" onclick="deleteElement('${point.id || 'temp'}')">Eliminar</button>
                    </div>
                ` : ''}
            </div>
        `;

        marker.bindPopup(popupContent);

        // Add event handlers
        marker.on('click', () => {
            if (onMarkerClick) {
                onMarkerClick(type, point);
            }
        });

        marker.on('dragstart', () => {
            setIsDragging(true);
        });

        marker.on('dragend', (e) => {
            setIsDragging(false);
            const newPos = e.target.getLatLng();
            if (onElementMove) {
                onElementMove({ ...point, lat: newPos.lat, lng: newPos.lng });
            }
        });

        // Add double-click handler for editing
        marker.on('dblclick', () => {
            if (editMode && onElementSelect) {
                onElementSelect({ type: 'marker', coordinates: point, element: marker });
            }
        });

        markersRef.current.push(marker);
        return marker;
    };

    const addDrawingPoint = (point) => {
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 6,
            fillColor: '#3B82F6',
            color: '#1E40AF',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(drawingLayerRef.current);
        return marker;
    };

    const addDrawingLine = (point1, point2) => {
        const line = L.polyline([[point1.lat, point1.lng], [point2.lat, point2.lng]], {
            color: '#3B82F6',
            weight: 3,
            opacity: 0.8
        }).addTo(drawingLayerRef.current);
        return line;
    };

    const addDrawingPolyline = (points) => {
        const coordinates = points.map(p => [p.lat, p.lng]);
        const polyline = L.polyline(coordinates, {
            color: '#3B82F6',
            weight: 3,
            opacity: 0.8
        }).addTo(drawingLayerRef.current);

        // Make polyline draggable when in edit mode
        if (editMode) {
            polyline.dragging.enable();
            polyline.on('dragstart', () => {
                setIsDragging(true);
            });
            polyline.on('dragend', (e) => {
                setIsDragging(false);
                const newCoordinates = e.target.getLatLngs();
                if (onElementMove) {
                    onElementMove({
                        type: 'line',
                        coordinates: newCoordinates,
                        element: polyline
                    });
                }
            });
        }

        return polyline;
    };

    const addDrawingPolygon = (points) => {
        const coordinates = points.map(p => [p.lat, p.lng]);
        const polygon = L.polygon(coordinates, {
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.2,
            weight: 2
        }).addTo(drawingLayerRef.current);

        // Make polygon draggable when in edit mode
        if (editMode) {
            polygon.dragging.enable();
            polygon.on('dragstart', () => {
                setIsDragging(true);
            });
            polygon.on('dragend', (e) => {
                setIsDragging(false);
                const newCoordinates = e.target.getLatLngs();
                if (onElementMove) {
                    onElementMove({
                        type: 'polygon',
                        coordinates: newCoordinates,
                        element: polygon
                    });
                }
            });
        }

        return polygon;
    };

    const addDrawingCircle = (center, radius) => {
        const circle = L.circle([center.lat, center.lng], {
            radius: radius * 1000, // Convert km to meters
            color: '#3B82F6',
            fillColor: '#3B82F6',
            fillOpacity: 0.2,
            weight: 2
        }).addTo(drawingLayerRef.current);

        // Make circle draggable when in edit mode
        if (editMode) {
            circle.dragging.enable();
            circle.on('dragstart', () => {
                setIsDragging(true);
            });
            circle.on('dragend', (e) => {
                setIsDragging(false);
                const newCenter = e.target.getLatLng();
                if (onElementMove) {
                    onElementMove({
                        type: 'circle',
                        center: newCenter,
                        radius: radius,
                        element: circle
                    });
                }
            });
        }

        return circle;
    };

    const addMeasurePoint = (point) => {
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: 4,
            fillColor: '#F59E0B',
            color: '#D97706',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(measureLayerRef.current);
        return marker;
    };

    const addMeasureLine = (point1, point2, distance) => {
        const line = L.polyline([[point1.lat, point1.lng], [point2.lat, point2.lng]], {
            color: '#F59E0B',
            weight: 2,
            opacity: 0.8
        }).addTo(measureLayerRef.current);

        // Add distance label
        const midPoint = {
            lat: (point1.lat + point2.lat) / 2,
            lng: (point1.lng + point2.lng) / 2
        };

        const label = L.divIcon({
            className: 'measure-label',
            html: `<div style="background: white; padding: 2px 6px; border: 1px solid #F59E0B; border-radius: 3px; font-size: 12px; font-weight: bold;">${distance.toFixed(2)} km</div>`,
            iconSize: [100, 20],
            iconAnchor: [50, 10]
        });

        L.marker([midPoint.lat, midPoint.lng], { icon: label }).addTo(measureLayerRef.current);
        return line;
    };

    const calculateDistance = (point1, point2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (point2.lat - point1.lat) * Math.PI / 180;
        const dLng = (point2.lng - point1.lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const calculatePolygonArea = (points) => {
        let area = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            area += points[i].lng * points[j].lat;
            area -= points[j].lng * points[i].lat;
        }
        return Math.abs(area) * 111.32 * 111.32 / 2; // Convert to km²
    };

    const calculatePolygonPerimeter = (points) => {
        let perimeter = 0;
        for (let i = 0; i < points.length; i++) {
            const j = (i + 1) % points.length;
            perimeter += calculateDistance(points[i], points[j]);
        }
        return perimeter;
    };

    const calculatePolylineDistance = (points) => {
        let distance = 0;
        for (let i = 0; i < points.length - 1; i++) {
            distance += calculateDistance(points[i], points[i + 1]);
        }
        return distance;
    };

    const findElementAtPosition = (lat, lng) => {
        const tolerance = 0.001; // ~100 meters
        return drawnElements.find(element => {
            if (element.type === 'marker') {
                return Math.abs(element.coordinates.lat - lat) < tolerance &&
                    Math.abs(element.coordinates.lng - lng) < tolerance;
            }
            return false;
        });
    };

    const highlightElement = (element) => {
        clearEditLayer();
        if (element.element) {
            element.element.setStyle({
                color: '#FF0000',
                weight: 4,
                opacity: 1
            });
        }
    };

    const loadMapData = async () => {
        try {
            console.log('Loading map data for layer:', selectedLayer);
            // Load producers
            if (selectedLayer === 'all' || selectedLayer === 'producers') {
                const producersResponse = await fetch('/api/producers');
                const producersData = await producersResponse.json();
                const producers = producersData.data || producersData || [];

                console.log('Producers loaded:', producers.length);
                producers.forEach(producer => {
                    if (producer.location_lat && producer.location_lng) {
                        console.log('Adding producer marker:', producer.name, producer.location_lat, producer.location_lng);
                        addMarker({
                            lat: parseFloat(producer.location_lat),
                            lng: parseFloat(producer.location_lng),
                            name: producer.name,
                            description: `Productor: ${producer.email}`
                        }, 'producers');
                    }
                });
            }

            // Load crops
            if (selectedLayer === 'all' || selectedLayer === 'crops') {
                const cropsResponse = await fetch('/api/crops');
                const cropsData = await cropsResponse.json();
                const crops = cropsData.data || cropsData || [];

                console.log('Crops loaded:', crops.length);
                crops.forEach(crop => {
                    if (crop.area_center_lat && crop.area_center_lng) {
                        console.log('Adding crop marker:', crop.name, crop.area_center_lat, crop.area_center_lng);
                        addMarker({
                            lat: parseFloat(crop.area_center_lat),
                            lng: parseFloat(crop.area_center_lng),
                            name: crop.name,
                            description: `Cultivo: ${crop.area} hectáreas`
                        }, 'crops');
                    }
                });
            }

            // Load collection centers
            if (selectedLayer === 'all' || selectedLayer === 'centers') {
                const centersResponse = await fetch('/api/collection-centers');
                const centersData = await centersResponse.json();
                const centers = centersData.data || centersData || [];

                console.log('Centers loaded:', centers.length);
                centers.forEach(center => {
                    if (center.location_lat && center.location_lng) {
                        console.log('Adding center marker:', center.name, center.location_lat, center.location_lng);
                        addMarker({
                            lat: parseFloat(center.location_lat),
                            lng: parseFloat(center.location_lng),
                            name: center.name,
                            description: `${center.type}: ${center.storage_capacity} ton`
                        }, 'centers');
                    }
                });
            }

            // Load logistics routes
            if (selectedLayer === 'all' || selectedLayer === 'routes') {
                const routesResponse = await fetch('/api/logistics-routes');
                const routesData = await routesResponse.json();
                const routes = routesData.data || routesData || [];

                console.log('Routes loaded:', routes.length);
                routes.forEach(route => {
                    if (route.route_coordinates) {
                        try {
                            const coordinates = JSON.parse(route.route_coordinates);
                            if (coordinates.length >= 2) {
                                console.log('Adding route:', route.name, coordinates.length, 'points');
                                const polyline = L.polyline(coordinates.map(coord => [coord.lat, coord.lng]), {
                                    color: '#F59E0B',
                                    weight: 3,
                                    opacity: 0.8
                                }).addTo(mapInstanceRef.current);

                                polyline.bindPopup(`
                  <div class="p-2">
                    <h3 class="font-semibold text-gray-900">${route.name}</h3>
                    <p class="text-sm text-gray-600">Distancia: ${route.total_distance} km</p>
                    <p class="text-sm text-gray-600">Tiempo: ${route.estimated_time} min</p>
                  </div>
                `);
                            }
                        } catch (e) {
                            console.error('Error parsing route coordinates:', e);
                        }
                    }
                });
            }

            // Add commune boundaries (simulated with circles)
            const communes = [
                { name: 'Comuna 1', lat: 10.4806, lng: -66.9036, radius: 2000 },
                { name: 'Comuna 2', lat: 10.4900, lng: -66.8900, radius: 1500 },
                { name: 'Comuna 3', lat: 10.4700, lng: -66.9200, radius: 1800 }
            ];

            communes.forEach(commune => {
                const circle = L.circle([commune.lat, commune.lng], {
                    color: 'blue',
                    fillColor: '#3B82F6',
                    fillOpacity: 0.1,
                    radius: commune.radius
                }).addTo(mapInstanceRef.current);

                circle.bindTooltip(commune.name, { permanent: false });
            });

            // Fit map to show all markers
            if (markersRef.current.length > 0) {
                const group = new L.featureGroup(markersRef.current);
                mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
            }

        } catch (error) {
            console.error('Error loading map data:', error);
        }
    };

    return (
        <div className="relative w-full h-96 rounded-lg" style={{ minHeight: '600px' }}>
            <style>
                {`
                    @keyframes pulse {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.1);
                            opacity: 0.8;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                    
                    .custom-marker {
                        transition: all 0.3s ease;
                    }
                    
                    .custom-marker:hover {
                        transform: scale(1.2);
                        z-index: 1000 !important;
                    }
                `}
            </style>
            <div
                ref={mapRef}
                className="w-full h-full rounded-lg"
            />
            <MapZoomControls
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                onReset={resetView}
            />
        </div>
    );
};

export default FullWidthMap; 