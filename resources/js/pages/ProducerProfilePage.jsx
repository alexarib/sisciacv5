import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    User,
    Edit,
    Save,
    X,
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    Calendar,
    FileText,
    Shield,
    CheckCircle,
    AlertCircle,
    Camera,
    Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const ProducerProfilePage = () => {
    const { user, logout } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        document_number: '',
        document_type: '',
        total_area: '',
        status: '',
        notes: ''
    });

    const getAuthHeaders = () => {
        const token = localStorage.getItem('sisciac_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const fetchProfileData = async () => {
        try {
            const response = await fetch(`/api/producers/${user.producer_id}`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();

            if (data.producer) {
                setProfileData({
                    name: data.producer.name || user.name,
                    email: data.producer.email || user.email,
                    phone: data.producer.phone || user.phone || '',
                    address: data.producer.address || user.address || '',
                    document_number: data.producer.document_number || user.document_number || '',
                    document_type: data.producer.document_type || user.document_type || '',
                    total_area: data.producer.total_area || '',
                    status: data.producer.status || user.status || '',
                    notes: data.producer.notes || ''
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            // Fallback a datos del usuario
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                document_number: user.document_number || '',
                document_type: user.document_type || '',
                total_area: '',
                status: user.status || '',
                notes: ''
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const apiPut = async (url, body = {}) => {
        const res = await fetch(url, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Error en la solicitud');
        return res.json();
    };

    const handleSave = async () => {
        try {
            await apiPut(`/api/producers/${user.producer_id}`, profileData);
            showMapNotification('Perfil actualizado: Tu perfil ha sido actualizado exitosamente.', 'info');
            setEditing(false);
            await fetchProfileData();
        } catch (e) {
            showMapNotification('Error: No se pudo actualizar el perfil', 'error');
        }
    };

    const handleCancel = () => {
        setEditing(false);
        fetchProfileData(); // Recargar datos originales
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: "Sesión cerrada",
                description: "Has cerrado sesión exitosamente",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Error al cerrar sesión",
                variant: "destructive",
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            case 'pending':
                return 'Pendiente';
            default:
                return 'Desconocido';
        }
    };

    const getDocumentTypeText = (type) => {
        switch (type) {
            case 'dni':
                return 'DNI';
            case 'ruc':
                return 'RUC';
            case 'passport':
                return 'Pasaporte';
            default:
                return type;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Mi Perfil - SISCIAC</title>
                <meta name="description" content="Perfil del productor" />
            </Helmet>

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <button
                                    onClick={() => window.history.back()}
                                    className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                                    <p className="text-gray-600">Gestiona tu información personal y de productor</p>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                {editing ? (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Guardar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar Perfil
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Profile Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow">
                                    <div className="p-6">
                                        <div className="flex items-center justify-center mb-6">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-12 h-12 text-blue-600" />
                                                </div>
                                                {editing && (
                                                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                                                        <Camera className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-center mb-6">
                                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                                {editing ? (
                                                    <input
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    profileData.name
                                                )}
                                            </h2>
                                            <p className="text-gray-600">Productor</p>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(profileData.status)}`}>
                                                {getStatusText(profileData.status)}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    {editing ? (
                                                        <input
                                                            type="email"
                                                            value={profileData.email}
                                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-600">{profileData.email}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <Phone className="w-4 h-4 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    {editing ? (
                                                        <input
                                                            type="tel"
                                                            value={profileData.phone}
                                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-600">{profileData.phone || 'No especificado'}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                                                <div className="flex-1">
                                                    {editing ? (
                                                        <textarea
                                                            value={profileData.address}
                                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                                            rows="2"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-gray-600">{profileData.address || 'No especificada'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-lg shadow">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Información del Productor</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <FileText className="w-4 h-4 inline mr-2" />
                                                    Documento de Identidad
                                                </label>
                                                <div className="flex space-x-2">
                                                    {editing ? (
                                                        <>
                                                            <select
                                                                value={profileData.document_type}
                                                                onChange={(e) => setProfileData({ ...profileData, document_type: e.target.value })}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="dni">DNI</option>
                                                                <option value="ruc">RUC</option>
                                                                <option value="passport">Pasaporte</option>
                                                            </select>
                                                            <input
                                                                type="text"
                                                                value={profileData.document_number}
                                                                onChange={(e) => setProfileData({ ...profileData, document_number: e.target.value })}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                placeholder="Número"
                                                            />
                                                        </>
                                                    ) : (
                                                        <span className="text-sm text-gray-600">
                                                            {getDocumentTypeText(profileData.document_type)}: {profileData.document_number || 'No especificado'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <MapPin className="w-4 h-4 inline mr-2" />
                                                    Área Total (hectáreas)
                                                </label>
                                                {editing ? (
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={profileData.total_area}
                                                        onChange={(e) => setProfileData({ ...profileData, total_area: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-600">{profileData.total_area || 'No especificada'}</span>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Settings className="w-4 h-4 inline mr-2" />
                                                    Notas Adicionales
                                                </label>
                                                {editing ? (
                                                    <textarea
                                                        value={profileData.notes}
                                                        onChange={(e) => setProfileData({ ...profileData, notes: e.target.value })}
                                                        rows="4"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Información adicional sobre el productor..."
                                                    />
                                                ) : (
                                                    <span className="text-sm text-gray-600">{profileData.notes || 'No hay notas adicionales'}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Actions */}
                                <div className="bg-white rounded-lg shadow mt-6">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">Acciones de Cuenta</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center">
                                                    <Shield className="w-5 h-5 text-gray-400 mr-3" />
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-gray-900">Cambiar Contraseña</p>
                                                        <p className="text-sm text-gray-500">Actualiza tu contraseña de seguridad</p>
                                                    </div>
                                                </div>
                                                <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                                            </button>

                                            <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center">
                                                    <Settings className="w-5 h-5 text-gray-400 mr-3" />
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-gray-900">Configuración de Notificaciones</p>
                                                        <p className="text-sm text-gray-500">Gestiona tus preferencias de notificaciones</p>
                                                    </div>
                                                </div>
                                                <ArrowLeft className="w-4 h-4 text-gray-400 transform rotate-180" />
                                            </button>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium text-red-900">Cerrar Sesión</p>
                                                        <p className="text-sm text-red-500">Salir del sistema</p>
                                                    </div>
                                                </div>
                                                <ArrowLeft className="w-4 h-4 text-red-400 transform rotate-180" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default ProducerProfilePage; 