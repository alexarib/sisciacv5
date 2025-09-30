import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Users, Sprout, Building, Truck } from 'lucide-react';
import { toast } from 'react-toastify';

const MapElementForm = ({
    isOpen,
    onClose,
    onSave,
    elementType,
    coordinates,
    elementData
}) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'producer', // producer, crop, center, logistics
        description: '',
        status: 'active',
        commune: '',
        area: '',
        capacity: '',
        contact_person: '',
        contact_phone: '',
        contact_email: '',
        lat: '', // Added for coordinates
        lng: ''  // Added for coordinates
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Initialize coordinates when form opens
    useEffect(() => {
        if (isOpen && coordinates) {
            console.log('MapElementForm: Initializing coordinates:', coordinates);
            setFormData(prev => ({
                ...prev,
                lat: coordinates.lat?.toString() || '',
                lng: coordinates.lng?.toString() || ''
            }));
        }
    }, [isOpen, coordinates]);

    // Initialize form data when elementData is provided (for editing)
    useEffect(() => {
        if (isOpen && elementData) {
            console.log('MapElementForm: Initializing form data from elementData:', elementData);
            setFormData(prev => ({
                ...prev,
                ...elementData,
                lat: elementData.lat?.toString() || coordinates?.lat?.toString() || '',
                lng: elementData.lng?.toString() || coordinates?.lng?.toString() || ''
            }));
        }
    }, [isOpen, elementData, coordinates]);

    const elementTypes = [
        {
            id: 'producer',
            name: 'Productor',
            icon: Users,
            color: 'text-blue-600',
            fields: ['name', 'description', 'status', 'commune', 'area', 'contact_person', 'contact_phone', 'contact_email']
        },
        {
            id: 'crop',
            name: 'Cultivo',
            icon: Sprout,
            color: 'text-green-600',
            fields: ['name', 'description', 'status', 'commune', 'area']
        },
        {
            id: 'center',
            name: 'Centro de Acopio',
            icon: Building,
            color: 'text-red-600',
            fields: ['name', 'description', 'status', 'commune', 'capacity', 'contact_person', 'contact_phone', 'contact_email']
        },
        {
            id: 'logistics',
            name: 'Punto Logístico',
            icon: Truck,
            color: 'text-yellow-600',
            fields: ['name', 'description', 'status', 'commune', 'capacity']
        }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            console.log('MapElementForm: Submitting form with data:', formData);

            // Validar datos requeridos
            if (!formData.name || !formData.name.trim()) {
                throw new Error('El nombre es requerido');
            }

            if (!formData.lat || !formData.lng) {
                throw new Error('Las coordenadas son requeridas');
            }

            // Preparar datos para el servidor
            const elementData = {
                ...formData,
                name: formData.name.trim(),
                description: formData.description?.trim() || '',
                contact_email: formData.contact_email?.trim() || '',
                contact_phone: formData.contact_phone?.trim() || '',
                commune: formData.commune?.trim() || '',
                area: formData.area ? parseFloat(formData.area) : null,
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng)
            };

            console.log('MapElementForm: Prepared data for server:', elementData);

            // Llamar a la función de guardado del componente padre
            if (onSave) {
                const result = await onSave(elementData);
                console.log('MapElementForm: Save result:', result);

                if (result && result.success) {
                    toast.success('Elemento guardado exitosamente');
                    onClose();
                } else {
                    throw new Error(result?.message || 'Error al guardar el elemento');
                }
            } else {
                console.warn('MapElementForm: No onSave function provided');
                toast.success('Elemento preparado para guardar');
                onClose();
            }

        } catch (error) {
            console.error('MapElementForm: Error submitting form:', error);
            setError(error.message || 'Error al guardar el elemento');
            toast.error(error.message || 'Error al guardar el elemento');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedType = () => {
        return elementTypes.find(type => type.id === formData.type);
    };

    const selectedType = getSelectedType();

    console.log('MapElementForm render:', { isOpen, elementType, coordinates, elementData });

    if (!isOpen) {
        console.log('MapElementForm: Not rendering because isOpen is false');
        return null;
    }

    console.log('MapElementForm: Rendering form');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Crear {selectedType?.name}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Element Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Tipo de Elemento
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {elementTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => handleInputChange('type', type.id)}
                                    className={`flex items-center p-3 rounded-lg border-2 transition-colors ${formData.type === type.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <type.icon className={`w-5 h-5 mr-2 ${type.color}`} />
                                    <span className="text-sm font-medium">{type.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={`Nombre del ${selectedType?.name.toLowerCase()}`}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                placeholder="Descripción del elemento"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Estado
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="maintenance">En Mantenimiento</option>
                            </select>
                        </div>

                        {/* Commune */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Comuna
                            </label>
                            <input
                                type="text"
                                value={formData.commune}
                                onChange={(e) => handleInputChange('commune', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Comuna"
                            />
                        </div>

                        {/* Area (for producers and crops) */}
                        {(formData.type === 'producer' || formData.type === 'crop') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Área (hectáreas)
                                </label>
                                <input
                                    type="number"
                                    value={formData.area}
                                    onChange={(e) => handleInputChange('area', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        )}

                        {/* Capacity (for centers and logistics) */}
                        {(formData.type === 'center' || formData.type === 'logistics') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Capacidad (toneladas)
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                    step="0.01"
                                />
                            </div>
                        )}

                        {/* Contact Information (for producers and centers) */}
                        {(formData.type === 'producer' || formData.type === 'center') && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Persona de Contacto
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contact_person}
                                        onChange={(e) => handleInputChange('contact_person', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nombre completo"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contact_phone}
                                        onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+58 XXX-XXX-XXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contact_email}
                                        onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="email@ejemplo.com"
                                    />
                                </div>
                            </>
                        )}

                        {/* Coordinates Input */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Latitud *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.lat}
                                    onChange={(e) => handleInputChange('lat', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.000000"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Longitud *
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.lng}
                                    onChange={(e) => handleInputChange('lng', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.000000"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.name}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 text-center text-red-600 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default MapElementForm; 