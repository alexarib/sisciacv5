import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Eye, EyeOff, Sprout, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    address: '',
    document_number: '',
    document_type: 'dni'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        toast({
          title: "¡Registro exitoso!",
          description: result.message,
        });
        navigate('/login');
      } else {
        toast({
          title: "Error en el registro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Registro - SISCIAC</title>
        <meta name="description" content="Regístrate en el Sistema de Información de Cultivos y Asistencia Comunitaria." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Volver al login
              </Link>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
              >
                <Sprout className="w-8 h-8 text-green-600" />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">SISCIAC</h1>
              <p className="text-gray-600">Sistema de Información de Cultivos y Asistencia Comunitaria</p>
            </div>

            {/* Registration Form */}
            <div className="card shadow-lg">
              <div className="card-header text-center pb-4">
                <h2 className="card-title text-xl text-gray-800">Crear Cuenta</h2>
                <p className="card-description">
                  Regístrate como productor para acceder al sistema
                </p>
              </div>
              
              <div className="card-content">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nombre Completo *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ingresa tu nombre completo"
                      className="input"
                    />
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Nombre de Usuario *
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Ingresa un nombre de usuario"
                      className="input"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Correo Electrónico *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ingresa tu correo electrónico"
                      className="input"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ingresa tu número de teléfono"
                      className="input"
                    />
                  </div>

                  {/* Document Type and Number */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="document_type" className="text-sm font-medium text-gray-700">
                        Tipo de Documento
                      </label>
                      <select
                        id="document_type"
                        name="document_type"
                        value={formData.document_type}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="dni">DNI</option>
                        <option value="ruc">RUC</option>
                        <option value="ce">CE</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="document_number" className="text-sm font-medium text-gray-700">
                        Número de Documento
                      </label>
                      <input
                        id="document_number"
                        name="document_number"
                        type="text"
                        value={formData.document_number}
                        onChange={handleChange}
                        placeholder="Número de documento"
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Dirección
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Ingresa tu dirección"
                      className="input resize-none"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength="8"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Ingresa tu contraseña (mínimo 8 caracteres)"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <input
                        id="password_confirmation"
                        name="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        placeholder="Confirma tu contraseña"
                        className="input pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full btn-lg mt-6"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                      to="/login"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage; 