import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Users,
  TrendingUp,
  Shield,
  Leaf,
  Calendar,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        showMapNotification(`¡Bienvenido! Hola ${result.user.name}, has iniciado sesión exitosamente.`, 'success');
        // Navigate based on user role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/producer');
        }
      } else {
        showMapNotification(`Error de autenticación: ${result.message}`, 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showMapNotification('Error al conectar con el servidor. Verifica tu conexión a internet.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - SCIAC</title>
        <meta name="description" content="Accede al Sistema de Control de Procesos Agrícolas del Municipio Simón Bolívar" />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-md w-full space-y-8">
            <div>
              <div className="mx-auto h-16 w-16 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                SCIAC
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Sistema de Control de Procesos Agrícolas
              </p>
              <p className="mt-1 text-center text-xs text-gray-500">
                Municipio Simón Bolívar - Miranda
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Iniciar Sesión</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Accede a tu cuenta para gestionar los procesos agrícolas
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Usuario o Email
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario o email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ¿Eres productor?{' '}
                  <Link
                    to="/register"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              {/* Credenciales por defecto */}
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-xs text-gray-600 text-center">
                  <strong>Credenciales por defecto:</strong><br />
                  Usuario: admin | Clave: admin123
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Agricultural Background & Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-green-700 to-green-800 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="relative z-10 flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-white max-w-lg"
            >
              <div className="mb-8">
                <Leaf className="w-16 h-16 mx-auto mb-4 text-green-200" />
                <h2 className="text-4xl font-bold mb-4">
                  Agricultura Inteligente
                </h2>
                <p className="text-xl mb-6 text-green-100">
                  Para el Municipio Simón Bolívar
                </p>
              </div>

              {/* Misión y Visión */}
              <div className="space-y-6 text-left">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Misión
                  </h3>
                  <p className="text-sm text-green-100">
                    Desarrollar una aplicación integral para el control de procesos agrícolas,
                    integrando las mejores funcionalidades de gestión de cultivos, trazabilidad
                    y participación comunal en el Municipio Simón Bolívar.
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Visión
                  </h3>
                  <p className="text-sm text-green-100">
                    Ser el sistema líder en gestión agrícola comunal, promoviendo la
                    participación del poder popular y el desarrollo sostenible del sector
                    agrícola en Miranda.
                  </p>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Objetivos
                  </h3>
                  <ul className="text-sm text-green-100 space-y-1">
                    <li>• Control de procesos agrícolas en tiempo real</li>
                    <li>• Trazabilidad comunal y georreferenciación</li>
                    <li>• Participación activa del poder popular</li>
                    <li>• Gestión integral de cultivos e insumos</li>
                    <li>• Formación técnica para productores</li>
                  </ul>
                </div>
              </div>

              {/* Características principales */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-green-200" />
                  <p className="text-sm font-medium">Productores</p>
                  <p className="text-xs text-green-200">Registro ilimitado</p>
                </div>
                <div className="text-center">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-green-200" />
                  <p className="text-sm font-medium">Georreferenciación</p>
                  <p className="text-xs text-green-200">Ubicación precisa</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-green-200" />
                  <p className="text-sm font-medium">Trazabilidad</p>
                  <p className="text-xs text-green-200">Control completo</p>
                </div>
                <div className="text-center">
                  <Sprout className="w-8 h-8 mx-auto mb-2 text-green-200" />
                  <p className="text-sm font-medium">Cultivos</p>
                  <p className="text-xs text-green-200">Gestión inteligente</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage; 