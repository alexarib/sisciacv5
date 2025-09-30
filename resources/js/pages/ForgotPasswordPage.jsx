import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Sprout, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Instrucciones enviadas",
          description: result.message,
        });
      } else {
        toast({
          title: "Error",
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
        <title>Recuperar Contraseña - SISCIAC</title>
        <meta name="description" content="Recupera tu contraseña del Sistema de Información de Cultivos y Asistencia Comunitaria." />
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

            {/* Forgot Password Form */}
            <div className="card shadow-lg">
              <div className="card-header text-center pb-4">
                <h2 className="card-title text-xl text-gray-800">Recuperar Contraseña</h2>
                <p className="card-description">
                  Ingresa tu correo electrónico para recibir instrucciones de recuperación
                </p>
              </div>
              
              <div className="card-content">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Ingresa tu correo electrónico"
                          className="input pl-10"
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full btn-lg"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando instrucciones...
                        </>
                      ) : (
                        'Enviar Instrucciones'
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Instrucciones Enviadas
                      </h3>
                      <p className="text-gray-600">
                        Hemos enviado las instrucciones de recuperación a tu correo electrónico.
                        Revisa tu bandeja de entrada y sigue los pasos indicados.
                      </p>
                    </div>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="btn btn-outline w-full"
                    >
                      Enviar Nuevamente
                    </button>
                  </div>
                )}

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Recordaste tu contraseña?{' '}
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

export default ForgotPasswordPage; 