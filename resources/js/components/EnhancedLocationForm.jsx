import React, { useState, useEffect } from 'react';
import { X, MapPin, Save, AlertCircle } from 'lucide-react';
import locationService from '../services/locationService';
import { showMapNotification } from './ui/Toaster';

const EnhancedLocationForm = ({
    isOpen,
    onClose,
    onSave,
    coordinates = null,
    locationData = null,
    editingLocation = null
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'field',
        latitude: '',
        longitude: '',
        area_hectares: '',
        address: '',
        municipality: '',
        state: 'Miranda',
        country: 'Venezuela',
        postal_code: '',
        status: 'active',
        producer_id: '',
        crop_id: ''
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [producers, setProducers] = useState([]);
    const [crops, setCrops] = useState([]);

    // Tipos de ubicación disponibles
    const locationTypes = [
        { value: 'farm', label: 'Finca', icon: '🏡' },
        { value: 'plot', label: 'Parcela', icon: '🌾' },
        { value: 'field', label: 'Campo', icon: '🌱' },
        { value: 'greenhouse', label: 'Invernadero', icon: '🏭' },
        { value: 'storage', label: 'Almacén', icon: '🏪' }
    ];

    // Estados disponibles
    const statusOptions = [
        { value: 'active', label: 'Activo', color: 'text-green-600' },
        { value: 'inactive', label: 'Inactivo', color: 'text-red-600' },
        { value: 'planned', label: 'Planificado', color: 'text-yellow-600' }
    ];

    // Cargar productores y cultivos
    useEffect(() => {
        if (isOpen) {
            loadProducers();
            loadCrops();
        }
    }, [isOpen]);

    // Cargar datos de productores
    const loadProducers = async () => {
        try {
            const response = await fetch('/api/producers');
            const data = await response.json();
            if (data.success) {
                setProducers(data.data || []);
            }
        } catch (error) {
            console.error('Error loading producers:', error);
        }
    };

    // Cargar datos de cultivos
    const loadCrops = async () => {
        try {
            const response = await fetch('/api/crops');
            const data = await response.json();
            if (data.success) {
                setCrops(data.data || []);
            }
        } catch (error) {
            console.error('Error loading crops:', error);
        }
    };

    // Inicializar formulario
    useEffect(() => {
        if (isOpen) {
            if (editingLocation) {
                // Modo edición
                setFormData({
                    name: editingLocation.name || '',
                    description: editingLocation.description || '',
                    type: editingLocation.type || 'field',
                    latitude: editingLocation.latitude || '',
                    longitude: editingLocation.longitude || '',
                    area_hectares: editingLocation.area_hectares || '',
                    address: editingLocation.address || '',
                    municipality: editingLocation.municipality || '',
                    state: editingLocation.state || 'Miranda',
                    country: editingLocation.country || 'Venezuela',
                    postal_code: editingLocation.postal_code || '',
                    status: editingLocation.status || 'active',
                    producer_id: editingLocation.producer_id || '',
                    crop_id: editingLocation.crop_id || ''
                });
            } else if (coordinates) {
                // Modo creación con coordenadas
                setFormData(prev => ({
                    ...prev,
                    latitude: coordinates.lat || coordinates.latitude || '',
                    longitude: coordinates.lng || coordinates.longitude || ''
                }));
            } else {
                // Modo creación sin coordenadas
                setFormData({
                    name: '',
                    description: '',
                    type: 'field',
                    latitude: '',
                    longitude: '',
                    area_hectares: '',
                    address: '',
                    municipality: '',
                    state: 'Miranda',
                    country: 'Venezuela',
                    postal_code: '',
                    status: 'active',
                    producer_id: '',
                    crop_id: ''
                });
            }
            setErrors({});
        }
    }, [isOpen, coordinates, editingLocation]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo modificado
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.type) {
            newErrors.type = 'El tipo es requerido';
        }

        if (!formData.latitude || isNaN(parseFloat(formData.latitude))) {
            newErrors.latitude = 'La latitud debe ser un número válido';
        } else {
            const lat = parseFloat(formData.latitude);
            if (lat < -90 || lat > 90) {
                newErrors.latitude = 'La latitud debe estar entre -90 y 90';
            }
        }

        if (!formData.longitude || isNaN(parseFloat(formData.longitude))) {
            newErrors.longitude = 'La longitud debe ser un número válido';
        } else {
            const lng = parseFloat(formData.longitude);
            if (lng < -180 || lng > 180) {
                newErrors.longitude = 'La longitud debe estar entre -180 y 180';
            }
        }

        if (formData.area_hectares && (isNaN(parseFloat(formData.area_hectares)) || parseFloat(formData.area_hectares) < 0)) {
            newErrors.area_hectares = 'El área debe ser un número positivo';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showMapNotification('Por favor corrige los errores en el formulario', 'error');
            return;
        }

        setLoading(true);

        try {
            let response;

            if (editingLocation) {
                // Actualizar ubicación existente
                response = await locationService.updateLocation(editingLocation.id, formData);
            } else {
                // Crear nueva ubicación
                response = await locationService.createLocation(formData);
            }

            if (response.success) {
                showMapNotification(
                    editingLocation ? 'Ubicación actualizada exitosamente' : 'Ubicación creada exitosamente',
                    'success'
                );

                if (onSave) {
                    onSave(response.data);
                }

                onClose();
            } else {
                showMapNotification(response.error || 'Error al guardar la ubicación', 'error');
            }
        } catch (error) {
            console.error('Error saving location:', error);
            showMapNotification('Error al guardar la ubicación', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Obtener coordenadas actuales del navegador
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toFixed(6),
                        longitude: position.coords.longitude.toFixed(6)
                    }));
                    showMapNotification('Coordenadas actuales obtenidas', 'success');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    showMapNotification('No se pudieron obtener las coordenadas actuales', 'error');
                }
            );
        } else {
            showMapNotification('La geolocalización no está disponible', 'error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {editingLocation ? 'Editar Ubicación' : 'Nueva Ubicación'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nombre de la ubicación"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.type ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                                {locationTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.type}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Descripción de la ubicación"
                        />
                    </div>

                    {/* Coordenadas */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">Coordenadas GPS</h4>
                            <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                            >
                                Obtener ubicación actual
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitud *
                                </label>
                                <input
                                    type="number"
                                    name="latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    step="0.000001"
                                    min="-90"
                                    max="90"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.latitude ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: 6.423750"
                                />
                                {errors.latitude && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {errors.latitude}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitud *
                                </label>
                                <input
                                    type="number"
                                    name="longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    step="0.000001"
                                    min="-180"
                                    max="180"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        errors.longitude ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Ej: -66.589730"
                                />
                                {errors.longitude && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        {errors.longitude}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Área y estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Área (hectáreas)
                            </label>
                            <input
                                type="number"
                                name="area_hectares"
                                value={formData.area_hectares}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.area_hectares ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                            />
                            {errors.area_hectares && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    {errors.area_hectares}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado *
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {statusOptions.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dirección
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Dirección física"
                        />
                    </div>

                    {/* Ubicación geográfica */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Municipio
                            </label>
                            <input
                                type="text"
                                name="municipality"
                                value={formData.municipality}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Simón Bolívar"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Miranda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                País
                            </label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Venezuela"
                            />
                        </div>
                    </div>

                    {/* Relaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Productor
                            </label>
                            <select
                                name="producer_id"
                                value={formData.producer_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar productor</option>
                                {producers.map(producer => (
                                    <option key={producer.id} value={producer.id}>
                                        {producer.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Cultivo
                            </label>
                            <select
                                name="crop_id"
                                value={formData.crop_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar cultivo</option>
                                {crops.map(crop => (
                                    <option key={crop.id} value={crop.id}>
                                        {crop.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {editingLocation ? 'Actualizar' : 'Crear'} Ubicación
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnhancedLocationForm;
