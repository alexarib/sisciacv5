import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  Sprout,
  Calendar,
  TrendingUp,
  LogOut,
  Menu,
  X,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';
import { Link } from 'react-router-dom';

const ProducerDashboard = () => {
  const { user, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [producerData, setProducerData] = useState({
    crops: [],
    trainings: [],
    logistics: [],
    stats: {
      totalCrops: 0,
      activeCrops: 0,
      upcomingTrainings: 0,
      pendingLogistics: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducerData();
  }, []);

  const fetchProducerData = async () => {
    try {
      // Fetch producer's crops
      const cropsResponse = await fetch('/api/crops');
      const cropsData = await cropsResponse.json();

      // Fetch producer's trainings
      const trainingsResponse = await fetch('/api/trainings');
      const trainingsData = await trainingsResponse.json();

      // Fetch producer's logistics
      const logisticsResponse = await fetch('/api/logistics');
      const logisticsData = await logisticsResponse.json();

      setProducerData({
        crops: cropsData.data || [],
        trainings: trainingsData.data || [],
        logistics: logisticsData.data || [],
        stats: {
          totalCrops: cropsData.data?.length || 0,
          activeCrops: cropsData.data?.filter(crop => crop.status === 'growing').length || 0,
          upcomingTrainings: trainingsData.data?.filter(training => new Date(training.date) > new Date()).length || 0,
          pendingLogistics: logisticsData.data?.filter(log => log.status === 'pending').length || 0
        }
      });
    } catch (error) {
      console.error('Error fetching producer data:', error);
    } finally {
      setLoading(false);
    }
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

  const menuItems = [
    { icon: Sprout, label: 'Mis Cultivos', href: '/producer/crops' },
    { icon: Calendar, label: 'Capacitaciones', href: '/producer/trainings' },
    { icon: TrendingUp, label: 'Logística', href: '/producer/logistics' },
    { icon: MapPin, label: 'Mi Perfil', href: '/producer/profile' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard Productor - SISCIAC</title>
        <meta name="description" content="Panel de productor del Sistema de Información de Cultivos y Asistencia Comunitaria." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Sidebar (solo móvil) */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-lg font-semibold text-gray-900">SISCIAC</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role_display}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="">
          {/* Top Navigation */}
          <div className="sticky top-0 z-40 bg-white shadow-sm border-b">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Menú horizontal en escritorio */}
              <nav className="hidden lg:flex items-center space-x-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon className="mr-2 h-4 w-4 text-gray-400" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Bienvenido, {user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role_display}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden lg:inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <LogOut className="mr-2 h-4 w-4 text-gray-400" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <main className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
                <p className="mt-2 text-gray-600">
                  Gestiona tus cultivos y actividades agrícolas
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Sprout className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Cultivos</p>
                      <p className="text-2xl font-bold text-gray-900">{producerData.stats.totalCrops}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Cultivos Activos</p>
                      <p className="text-2xl font-bold text-gray-900">{producerData.stats.activeCrops}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Próximas Capacitaciones</p>
                      <p className="text-2xl font-bold text-gray-900">{producerData.stats.upcomingTrainings}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Logística Pendiente</p>
                      <p className="text-2xl font-bold text-gray-900">{producerData.stats.pendingLogistics}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Crops */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Mis Cultivos Recientes</h3>
                  </div>
                  <div className="p-6">
                    {producerData.crops.length > 0 ? (
                      <div className="space-y-4">
                        {producerData.crops.slice(0, 3).map((crop, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Sprout className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {crop.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {crop.area} hectáreas • {crop.status}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${crop.status === 'growing' ? 'bg-green-100 text-green-800' :
                                crop.status === 'harvested' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                {crop.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No tienes cultivos registrados
                      </p>
                    )}
                  </div>
                </div>

                {/* Upcoming Trainings */}
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Próximas Capacitaciones</h3>
                  </div>
                  <div className="p-6">
                    {producerData.trainings.length > 0 ? (
                      <div className="space-y-4">
                        {producerData.trainings
                          .filter(training => new Date(training.date) > new Date())
                          .slice(0, 3)
                          .map((training, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-purple-600" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {training.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(training.date).toLocaleDateString()} • {training.location}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No hay capacitaciones programadas
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Acciones Rápidas</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/producer/crops/new">
                      <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Sprout className="w-5 h-5 text-green-600 mr-3" />
                        <span className="text-sm font-medium text-gray-900">Registrar Nuevo Cultivo</span>
                      </button>
                    </Link>
                    <Link to="/producer/trainings">
                      <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="text-sm font-medium text-gray-900">Ver Capacitaciones</span>
                      </button>
                    </Link>
                    <Link to="/producer/logistics">
                      <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-sm font-medium text-gray-900">Gestionar Logística</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default ProducerDashboard; 