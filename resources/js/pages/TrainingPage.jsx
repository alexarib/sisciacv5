import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  Play,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Award,
  ArrowLeft,
  Filter,
  Download,
  Eye,
  CheckCircle,
  AlertCircle,
  Video,
  FileText,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';
import { CourseForm, WorkerForm } from '../components/TrainingForms';

const TrainingPage = () => {
  const { user } = useAuth();
  
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('courses');

  // Estados para formularios
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingWorker, setEditingWorker] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('sisciac_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const refreshData = async () => {
    try {
      const [coursesRes, enrollmentsRes, workersRes] = await Promise.all([
        fetch('/api/trainings', { headers: getAuthHeaders() }),
        fetch('/api/trainings/enrollments', { headers: getAuthHeaders() }),
        fetch('/api/workers', { headers: getAuthHeaders() })
      ]);

      const coursesData = await coursesRes.json();
      const enrollmentsData = await enrollmentsRes.json();
      const workersData = await workersRes.json();

      setCourses(coursesData.data || coursesData || mockCourses);
      setEnrollments(enrollmentsData.data || enrollmentsData || mockEnrollments);
      setWorkers(workersData.data || workersData || mockWorkers);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback a datos simulados
      setCourses(mockCourses);
      setEnrollments(mockEnrollments);
      setWorkers(mockWorkers);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, []);

  // Mock data (fallback)
  const mockCourses = [
    {
      id: 1,
      title: 'Técnicas Avanzadas de Cultivo de Maíz',
      instructor: 'Dr. Carlos Mendoza',
      type: 'video',
      duration: '2 horas',
      level: 'intermedio',
      category: 'cultivos',
      status: 'active',
      enrolled: 45,
      max_students: 50,
      description: 'Aprende las mejores técnicas para el cultivo eficiente de maíz',
      topics: ['Preparación del suelo', 'Siembra', 'Fertilización', 'Control de plagas'],
      materials: ['Video tutorial', 'Manual PDF', 'Evaluación práctica'],
      start_date: '2024-08-15',
      end_date: '2024-09-15'
    },
    {
      id: 2,
      title: 'Manejo Integrado de Plagas',
      instructor: 'Ing. María González',
      type: 'document',
      duration: '1.5 horas',
      level: 'básico',
      category: 'sanidad',
      status: 'active',
      enrolled: 32,
      max_students: 40,
      description: 'Métodos orgánicos y químicos para el control de plagas',
      topics: ['Identificación de plagas', 'Métodos de control', 'Productos orgánicos'],
      materials: ['Documento técnico', 'Guía de campo', 'Certificado'],
      start_date: '2024-08-20',
      end_date: '2024-09-20'
    }
  ];

  const mockEnrollments = [
    {
      id: 1,
      producer_name: 'Juan Pérez',
      course_title: 'Técnicas Avanzadas de Cultivo de Maíz',
      enrollment_date: '2024-08-01',
      status: 'enrolled',
      progress: 75,
      completion_date: null,
      certificate: null
    },
    {
      id: 2,
      producer_name: 'María González',
      course_title: 'Manejo Integrado de Plagas',
      enrollment_date: '2024-07-25',
      status: 'completed',
      progress: 100,
      completion_date: '2024-08-10',
      certificate: 'CERT-2024-001'
    }
  ];

  const mockWorkers = [
    {
      id: 1,
      name: 'Luis Martínez',
      document: 'V-15.123.456',
      phone: '+58 412-555-1234',
      skills: ['Siembra', 'Cosecha', 'Riego'],
      experience: '3 años',
      status: 'active',
      commune: 'Comuna 1',
      availability: 'full_time',
      hourly_rate: 15.00
    },
    {
      id: 2,
      name: 'Ana López',
      document: 'V-18.789.012',
      phone: '+58 414-555-5678',
      skills: ['Control de plagas', 'Fertilización'],
      experience: '2 años',
      status: 'active',
      commune: 'Comuna 2',
      availability: 'part_time',
      hourly_rate: 12.00
    }
  ];

  const apiPost = async (url, body = {}) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error en la solicitud');
    return res.json();
  };

  const apiPut = async (url, body = {}) => {
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Error en la solicitud');
    return res.json();
  };

  // Funciones para cursos
  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowCourseForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      try {
        await fetch(`/api/trainings/${courseId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        showMapNotification('Curso eliminado: El curso ha sido eliminado exitosamente.', 'info');
        await refreshData();
      } catch (e) {
        showMapNotification('Error: No se pudo eliminar el curso', 'error');
      }
    }
  };

  const handleSubmitCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await apiPut(`/api/trainings/${editingCourse.id}`, courseData);
        showMapNotification('Curso actualizado: El curso ha sido actualizado exitosamente.', 'info');
      } else {
        await apiPost('/api/trainings', courseData);
        showMapNotification('Curso creado: El curso ha sido creado exitosamente.', 'info');
      }
      setShowCourseForm(false);
      setEditingCourse(null);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo guardar el curso', 'error');
    }
  };

  // Funciones para trabajadores
  const handleAddWorker = () => {
    setEditingWorker(null);
    setShowWorkerForm(true);
  };

  const handleEditWorker = (worker) => {
    setEditingWorker(worker);
    setShowWorkerForm(true);
  };

  const handleDeleteWorker = async (workerId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este trabajador?')) {
      try {
        await fetch(`/api/workers/${workerId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        showMapNotification('Trabajador eliminado: El trabajador ha sido eliminado exitosamente.', 'info');
        await refreshData();
      } catch (e) {
        showMapNotification('Error: No se pudo eliminar el trabajador', 'error');
      }
    }
  };

  const handleSubmitWorker = async (workerData) => {
    try {
      if (editingWorker) {
        await apiPut(`/api/workers/${editingWorker.id}`, workerData);
        showMapNotification('Trabajador actualizado: El trabajador ha sido actualizado exitosamente.', 'info');
      } else {
        await apiPost('/api/workers', workerData);
        showMapNotification('Trabajador creado: El trabajador ha sido creado exitosamente.', 'info');
      }
      setShowWorkerForm(false);
      setEditingWorker(null);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo guardar el trabajador', 'error');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesType = filterType === 'all' || course.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.producer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || worker.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'enrolled':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'upcoming':
        return 'Próximo';
      case 'enrolled':
        return 'Inscrito';
      case 'completed':
        return 'Completado';
      case 'waiting':
        return 'En Espera';
      case 'inactive':
        return 'Inactivo';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'básico':
        return 'bg-blue-100 text-blue-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'mixed':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
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
        <title>Formación Técnica y RRHH - SISCIAC</title>
        <meta name="description" content="Gestión de formación técnica y recursos humanos del sistema SISCIAC" />
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
                  <h1 className="text-2xl font-bold text-gray-900">Formación Técnica y RRHH</h1>
                  <p className="text-gray-600">Gestión de cursos, inscripciones y trabajadores</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddWorker}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Agregar Trabajador
                </button>
                <button
                  onClick={handleAddCourse}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Curso
                </button>
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
                    onClick={() => setActiveTab('courses')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Cursos
                  </button>
                  <button
                    onClick={() => setActiveTab('enrollments')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'enrollments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Users className="w-4 h-4 inline mr-2" />
                    Inscripciones
                  </button>
                  <button
                    onClick={() => setActiveTab('workers')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'workers'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Trabajadores
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
                        placeholder={`Buscar ${activeTab === 'courses' ? 'cursos' : activeTab === 'enrollments' ? 'inscripciones' : 'trabajadores'}...`}
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
                      {activeTab === 'courses' && (
                        <>
                          <option value="active">Activo</option>
                          <option value="upcoming">Próximo</option>
                        </>
                      )}
                      {activeTab === 'enrollments' && (
                        <>
                          <option value="enrolled">Inscrito</option>
                          <option value="completed">Completado</option>
                          <option value="waiting">En Espera</option>
                        </>
                      )}
                      {activeTab === 'workers' && (
                        <>
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </>
                      )}
                    </select>
                    {activeTab === 'courses' && (
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">Todos los tipos</option>
                        <option value="video">Video</option>
                        <option value="document">Documento</option>
                        <option value="mixed">Mixto</option>
                      </select>
                    )}
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </button>
                  </div>
                </div>
              </div>

              {/* Content based on active tab */}
              <div className="p-6">
                {activeTab === 'courses' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              {getTypeIcon(course.type)}
                              <span className="ml-2 text-sm text-gray-500 capitalize">{course.type}</span>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                              {getStatusText(course.status)}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{course.description}</p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              Instructor: {course.instructor}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              Duración: {course.duration}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(course.level)}`}>
                              {course.level}
                            </span>
                            <span className="text-sm text-gray-600">
                              {course.enrolled}/{course.max_students} estudiantes
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm">
                              Ver Detalles
                            </button>
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 text-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="bg-red-100 text-red-700 py-2 px-3 rounded-md hover:bg-red-200 text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'enrollments' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Productor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Curso
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Progreso
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Inscripción
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEnrollments.map((enrollment) => (
                          <tr key={enrollment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {enrollment.producer_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {enrollment.course_title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                                {getStatusText(enrollment.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${enrollment.progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(enrollment.enrollment_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <Eye className="w-4 h-4" />
                                </button>
                                {enrollment.status === 'completed' && (
                                  <button className="text-green-600 hover:text-green-900">
                                    <Award className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'workers' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Trabajador
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Habilidades
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Experiencia
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tarifa
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredWorkers.map((worker) => (
                          <tr key={worker.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{worker.name}</div>
                                  <div className="text-sm text-gray-500">{worker.document}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {worker.skills.map((skill, index) => (
                                  <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {worker.experience}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(worker.status)}`}>
                                {getStatusText(worker.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${worker.hourly_rate}/h
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEditWorker(worker)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteWorker(worker.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                    <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inscripciones</p>
                    <p className="text-2xl font-semibold text-gray-900">{enrollments.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <UserPlus className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Trabajadores</p>
                    <p className="text-2xl font-semibold text-gray-900">{workers.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Award className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certificados</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {enrollments.filter(e => e.certificate).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Formularios */}
      <CourseForm
        isOpen={showCourseForm}
        onClose={() => {
          setShowCourseForm(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSubmitCourse}
        initialData={editingCourse}
      />

      <WorkerForm
        isOpen={showWorkerForm}
        onClose={() => {
          setShowWorkerForm(false);
          setEditingWorker(null);
        }}
        onSubmit={handleSubmitWorker}
        initialData={editingWorker}
      />
    </>
  );
};

export default TrainingPage; 