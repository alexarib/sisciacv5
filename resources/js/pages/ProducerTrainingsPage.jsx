import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
    GraduationCap,
    Plus,
    Search,
    Edit,
    Trash2,
    ArrowLeft,
    Filter,
    Download,
    Eye,
    Calendar,
    Clock,
    Users,
    CheckCircle,
    AlertCircle,
    Play,
    BookOpen,
    Award,
    Video,
    FileText,
    UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const ProducerTrainingsPage = () => {
    const { user } = useAuth();
    
    const [trainings, setTrainings] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [activeTab, setActiveTab] = useState('available');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('sisciac_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    };

    const refreshData = async () => {
        try {
            const [trainingsRes, enrollmentsRes] = await Promise.all([
                fetch('/api/trainings', { headers: getAuthHeaders() }),
                fetch('/api/trainings/enrollments', { headers: getAuthHeaders() })
            ]);

            const trainingsData = await trainingsRes.json();
            const enrollmentsData = await enrollmentsRes.json();

            setTrainings(trainingsData.data || trainingsData || []);
            setEnrollments(enrollmentsData.data || enrollmentsData || []);
        } catch (error) {
            console.error('Error loading data:', error);
            setTrainings([]);
            setEnrollments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const apiPost = async (url, body = {}) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Error en la solicitud');
        return res.json();
    };

    const handleEnroll = async (trainingId) => {
        try {
            await apiPost(`/api/trainings/${trainingId}/enroll`, { producer_id: user.producer_id });
            showMapNotification('Inscripción exitosa: Te has inscrito en la capacitación.', 'info');
            await refreshData();
        } catch (e) {
            showMapNotification('Error: No se pudo inscribir en la capacitación', 'error');
        }
    };

    const handleUnenroll = async (trainingId) => {
        if (window.confirm('¿Estás seguro de que quieres cancelar tu inscripción?')) {
            try {
                await fetch(`/api/trainings/${trainingId}/unenroll`, {
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                showMapNotification('Inscripción cancelada: Has cancelado tu inscripción.', 'info');
                await refreshData();
            } catch (e) {
                showMapNotification('Error: No se pudo cancelar la inscripción', 'error');
            }
        }
    };

    const filteredTrainings = trainings.filter(training => {
        const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            training.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || training.status === filterStatus;
        const matchesType = filterType === 'all' || training.type === filterType;
        return matchesSearch && matchesStatus && matchesType;
    });

    const myEnrollments = enrollments.filter(enrollment =>
        enrollment.producer_id === user.producer_id
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'upcoming':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'completed':
                return 'Completado';
            case 'cancelled':
                return 'Cancelado';
            case 'upcoming':
                return 'Próximo';
            default:
                return 'Desconocido';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'technical':
                return 'bg-blue-100 text-blue-800';
            case 'business':
                return 'bg-green-100 text-green-800';
            case 'safety':
                return 'bg-red-100 text-red-800';
            case 'certification':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeText = (type) => {
        switch (type) {
            case 'technical':
                return 'Técnica';
            case 'business':
                return 'Negocios';
            case 'safety':
                return 'Seguridad';
            case 'certification':
                return 'Certificación';
            default:
                return 'General';
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
                <title>Capacitaciones - SISCIAC</title>
                <meta name="description" content="Gestión de capacitaciones del productor" />
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
                                    <h1 className="text-2xl font-bold text-gray-900">Capacitaciones</h1>
                                    <p className="text-gray-600">Gestiona tu formación y desarrollo profesional</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        {/* Tabs */}
                        <div className="bg-white rounded-lg shadow mb-6">
                            <div className="border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 px-6">
                                    <button
                                        onClick={() => setActiveTab('available')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'available'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <BookOpen className="w-4 h-4 inline mr-2" />
                                        Disponibles
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('enrolled')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'enrolled'
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <CheckCircle className="w-4 h-4 inline mr-2" />
                                        Mis Inscripciones
                                    </button>
                                </nav>
                            </div>

                            {/* Filters */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Buscar capacitaciones..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">Todos los estados</option>
                                            <option value="upcoming">Próximas</option>
                                            <option value="active">Activas</option>
                                            <option value="completed">Completadas</option>
                                        </select>
                                        <select
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="all">Todos los tipos</option>
                                            <option value="technical">Técnica</option>
                                            <option value="business">Negocios</option>
                                            <option value="safety">Seguridad</option>
                                            <option value="certification">Certificación</option>
                                        </select>
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center">
                                            <Download className="w-4 h-4 mr-2" />
                                            Exportar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {activeTab === 'available' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredTrainings.map((training) => (
                                            <motion.div
                                                key={training.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(training.type)}`}>
                                                            {getTypeText(training.type)}
                                                        </span>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(training.status)}`}>
                                                            {getStatusText(training.status)}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{training.title}</h3>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {new Date(training.start_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            {training.duration} horas
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Users className="w-4 h-4 mr-2" />
                                                            {training.enrolled || 0} / {training.max_students || '∞'} inscritos
                                                        </div>
                                                    </div>

                                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                        {training.description}
                                                    </p>

                                                    <div className="flex space-x-2">
                                                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm">
                                                            Ver Detalles
                                                        </button>
                                                        <button
                                                            onClick={() => handleEnroll(training.id)}
                                                            className="bg-green-600 text-white py-2 px-3 rounded-md hover:bg-green-700 text-sm"
                                                        >
                                                            Inscribirse
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'enrolled' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {myEnrollments.map((enrollment) => (
                                            <motion.div
                                                key={enrollment.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(enrollment.training?.type)}`}>
                                                            {getTypeText(enrollment.training?.type)}
                                                        </span>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${enrollment.progress === 100 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {enrollment.progress}% completado
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{enrollment.training?.title}</h3>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {new Date(enrollment.training?.start_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            {enrollment.training?.duration} horas
                                                        </div>
                                                        {enrollment.completion_date && (
                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <Award className="w-4 h-4 mr-2" />
                                                                Completado: {new Date(enrollment.completion_date).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mb-4">
                                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                            <span>Progreso</span>
                                                            <span>{enrollment.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${enrollment.progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm">
                                                            Continuar
                                                        </button>
                                                        <button
                                                            onClick={() => handleUnenroll(enrollment.training_id)}
                                                            className="bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 text-sm"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <GraduationCap className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Capacitaciones</p>
                                        <p className="text-2xl font-semibold text-gray-900">{trainings.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Mis Inscripciones</p>
                                        <p className="text-2xl font-semibold text-gray-900">{myEnrollments.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">En Progreso</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {myEnrollments.filter(e => e.progress > 0 && e.progress < 100).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Award className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Completadas</p>
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {myEnrollments.filter(e => e.progress === 100).length}
                                        </p>
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

export default ProducerTrainingsPage; 