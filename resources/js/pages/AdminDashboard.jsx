import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  Sprout,
  Truck,
  GraduationCap,
  FileText,
  LogOut,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Package,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    producers: 0,
    crops: 0,
    logistics: 0,
    trainings: 0,
    reports: 0,
    supplies: 0,
    alerts: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('sisciac_token');
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return { headers };
  };

  const fetchDashboardData = async (showToast = false) => {
    try {
      setRefreshing(true);

      // Fetch stats
      const statsResponse = await fetch('/api/dashboard/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch recent activities
      const activitiesResponse = await fetch('/api/dashboard/activities');
      const activitiesData = await activitiesResponse.json();
      setRecentActivities(activitiesData);

      // Fetch alerts autenticado con fallback
      let loadedAlerts = [];
      try {
        const authHeaders = getAuthHeaders();
        const res = await fetch('/api/alerts', authHeaders);
        if (res.ok) {
          const json = await res.json();
          // Paginado (data) o arreglo simple
          loadedAlerts = Array.isArray(json?.data) ? json.data : (Array.isArray(json) ? json : []);
        } else {
          throw new Error('Unauthorized');
        }
      } catch (e) {
        const alertsResponse = await fetch('/api/alerts-demo');
        const alertsData = await alertsResponse.json();
        loadedAlerts = Array.isArray(alertsData?.alerts) ? alertsData.alerts : [];
      }
      setAlerts(loadedAlerts);

      if (showToast) {
        toast({
          title: "Datos actualizados",
          description: "Las estadísticas se han actualizado correctamente",
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (showToast) {
        toast({
          title: "Error",
          description: "No se pudieron actualizar los datos",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardData(true);
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
    { icon: Users, label: 'Productores', href: '/producers', count: stats.producers },
    { icon: Sprout, label: 'Cultivos', href: '/crops', count: stats.crops },
    { icon: MapPin, label: 'Mapa Interactivo', href: '/map', count: 0 },
    { icon: Package, label: 'Insumos', href: '/supplies', count: stats.supplies || 0 },
    { icon: GraduationCap, label: 'Formación', href: '/training', count: stats.trainings },
    { icon: TrendingUp, label: 'Comercialización', href: '/commerce', count: 0 },
    { icon: Truck, label: 'Logística', href: '/logistics', count: stats.logistics },
    { icon: FileText, label: 'Reportes', href: '/reports', count: stats.reports },
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
        <title>Dashboard Administrador - SISCIAC</title>
        <meta name="description" content="Panel de administración del Sistema de Información de Cultivos y Asistencia Comunitaria." />
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
                  {item.count > 0 && (
                    <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {item.count}
                    </span>
                  )}
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
                    {item.count > 0 && (
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
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
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrador</h1>
                <p className="mt-2 text-gray-600">
                  Panel de control para gestionar el sistema SISCIAC
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Productores</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.producers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Sprout className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Cultivos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.crops}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Truck className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Logística</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.logistics}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Capacitaciones</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.trainings}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FileText className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Reportes</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.reports}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Package className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Insumos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.supplies || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Alertas</p>
                      <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    Alertas
                  </h3>
                  <span className="text-sm text-gray-500">{alerts.length} alertas activas</span>
                </div>
                <div className="p-6">
                  {alerts && alerts.length > 0 ? (
                    <div className="space-y-4">
                      {alerts.slice(0, 5).map((alert, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                            }`}>
                            <AlertTriangle className={`w-4 h-4 ${alert.severity === 'high' ? 'text-red-600' : alert.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
                              }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{alert.title || alert?.type}</p>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                            {alert.date && (
                              <p className="text-xs text-gray-500 mt-1">{new Date(alert.date).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No hay alertas activas
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
                </div>
                <div className="p-6">
                  {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivities.slice(0, 5).map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No hay actividad reciente
                    </p>
                  )}
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

export default AdminDashboard; 