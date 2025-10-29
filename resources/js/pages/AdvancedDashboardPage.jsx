import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Download, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdvancedDashboard from '../components/AdvancedDashboard';

const AdvancedDashboardPage = () => {
    const { user } = useAuth();

    return (
        <>
            <Helmet>
                <title>Dashboard Avanzado - SISCIAC</title>
                <meta name="description" content="Dashboard avanzado del sistema SISCIAC con estadísticas completas y análisis detallados" />
            </Helmet>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-gray-50"
            >
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between py-4">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => window.history.back()}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Volver
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Avanzado</h1>
                                    <p className="text-sm text-gray-600">
                                        Bienvenido, {user?.name || 'Usuario'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configuración
                                </button>
                                <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar
                                </button>
                                <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Actualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <AdvancedDashboard />
                </div>

                {/* Footer */}
                <div className="bg-white border-t border-gray-200 mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white font-bold text-sm">S</span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">SISCIAC</h3>
                                        <p className="text-xs text-gray-500">Sistema de Control de Procesos Agrícolas</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                <p>&copy; 2024 SISCIAC. Todos los derechos reservados.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default AdvancedDashboardPage;
