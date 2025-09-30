import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ArrowLeft,
  Eye,
  Printer,
  Share2,
  Users,
  Sprout,
  DollarSign,
  Package,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';

const ReportsPage = () => {
  const { user } = useAuth();
  
  const [selectedReport, setSelectedReport] = useState('production');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);

  // Mock data for reports
  const mockProductionData = {
    totalCrops: 156,
    activeCrops: 89,
    harvestedCrops: 45,
    failedCrops: 22,
    totalArea: 1250.5,
    totalYield: 2340.8,
    monthlyData: [
      { month: 'Ene', crops: 12, yield: 180 },
      { month: 'Feb', crops: 15, yield: 220 },
      { month: 'Mar', crops: 18, yield: 280 },
      { month: 'Abr', crops: 22, yield: 320 },
      { month: 'May', crops: 25, yield: 380 },
      { month: 'Jun', crops: 28, yield: 420 },
      { month: 'Jul', crops: 30, yield: 450 },
      { month: 'Ago', crops: 26, yield: 390 }
    ]
  };

  const mockFinancialData = {
    totalRevenue: 125000,
    totalExpenses: 85000,
    netProfit: 40000,
    profitMargin: 32,
    monthlyRevenue: [
      { month: 'Ene', revenue: 8500, expenses: 6200 },
      { month: 'Feb', revenue: 9200, expenses: 6800 },
      { month: 'Mar', revenue: 10800, expenses: 7200 },
      { month: 'Abr', revenue: 11500, expenses: 7800 },
      { month: 'May', revenue: 13200, expenses: 8500 },
      { month: 'Jun', revenue: 14800, expenses: 9200 },
      { month: 'Jul', revenue: 15600, expenses: 9800 },
      { month: 'Ago', revenue: 14200, expenses: 8900 }
    ]
  };

  const mockProducerData = {
    totalProducers: 35,
    activeProducers: 28,
    inactiveProducers: 7,
    newProducers: 5,
    communeDistribution: [
      { commune: 'Comuna 1', producers: 12, area: 450 },
      { commune: 'Comuna 2', producers: 10, area: 380 },
      { commune: 'Comuna 3', producers: 8, area: 320 },
      { commune: 'Comuna 4', producers: 5, area: 200 }
    ]
  };

  const mockSupplyData = {
    totalSupplies: 24,
    lowStock: 8,
    outOfStock: 3,
    totalValue: 45000,
    categoryDistribution: [
      { category: 'Semillas', count: 8, value: 12000 },
      { category: 'Fertilizantes', count: 6, value: 18000 },
      { category: 'Pesticidas', count: 5, value: 8000 },
      { category: 'Herramientas', count: 5, value: 7000 }
    ]
  };

  const reports = [
    {
      id: 'production',
      name: 'Reporte de Producción',
      icon: Sprout,
      description: 'Análisis de cultivos, rendimientos y áreas',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'financial',
      name: 'Reporte Financiero',
      icon: DollarSign,
      description: 'Ingresos, gastos y rentabilidad',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'producers',
      name: 'Reporte de Productores',
      icon: Users,
      description: 'Distribución y estadísticas de productores',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'supplies',
      name: 'Reporte de Insumos',
      icon: Package,
      description: 'Inventario y gestión de insumos',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Reporte generado",
        description: "El reporte se ha generado exitosamente.",
      });
    }, 2000);
  };

  const exportReport = (format) => {
    toast({
      title: "Reporte exportado",
      description: `El reporte se ha exportado en formato ${format.toUpperCase()}.`,
    });
  };

  const getReportData = () => {
    switch (selectedReport) {
      case 'production':
        return mockProductionData;
      case 'financial':
        return mockFinancialData;
      case 'producers':
        return mockProducerData;
      case 'supplies':
        return mockSupplyData;
      default:
        return mockProductionData;
    }
  };

  const renderProductionReport = () => {
    const data = getReportData();
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cultivos</p>
                <p className="text-2xl font-semibold text-gray-900">{data.totalCrops}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cultivos Activos</p>
                <p className="text-2xl font-semibold text-gray-900">{data.activeCrops}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Área Total (ha)</p>
                <p className="text-2xl font-semibold text-gray-900">{data.totalArea}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rendimiento (ton)</p>
                <p className="text-2xl font-semibold text-gray-900">{data.totalYield}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Mensual</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de evolución mensual</p>
              <p className="text-sm text-gray-400">Integración con Chart.js o D3.js</p>
            </div>
          </div>
        </div>

        {/* Monthly Data Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Datos Mensuales</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cultivos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rendimiento (ton)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tendencia
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.monthlyData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.crops}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.yield}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {index > 0 && item.yield > data.monthlyData[index - 1].yield ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : index > 0 ? (
                          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        ) : (
                          <BarChart3 className="w-4 h-4 text-gray-600 mr-1" />
                        )}
                        <span className="text-sm text-gray-600">
                          {index > 0 ? 
                            `${((item.yield - data.monthlyData[index - 1].yield) / data.monthlyData[index - 1].yield * 100).toFixed(1)}%` : 
                            'N/A'
                          }
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderFinancialReport = () => {
    const data = getReportData();
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-semibold text-gray-900">${data.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
                <p className="text-2xl font-semibold text-gray-900">${data.totalExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Beneficio Neto</p>
                <p className="text-2xl font-semibold text-gray-900">${data.netProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Margen de Beneficio</p>
                <p className="text-2xl font-semibold text-gray-900">{data.profitMargin}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolución Financiera</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de evolución financiera</p>
              <p className="text-sm text-gray-400">Integración con Chart.js o D3.js</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'production':
        return renderProductionReport();
      case 'financial':
        return renderFinancialReport();
      case 'producers':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporte de Productores</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de distribución de productores</p>
                <p className="text-sm text-gray-400">Integración con Chart.js o D3.js</p>
              </div>
            </div>
          </div>
        );
      case 'supplies':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reporte de Insumos</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Gráfico de gestión de insumos</p>
                <p className="text-sm text-gray-400">Integración con Chart.js o D3.js</p>
              </div>
            </div>
          </div>
        );
      default:
        return renderProductionReport();
    }
  };

  return (
    <>
      <Helmet>
        <title>Reportes Avanzados - SCIAC</title>
        <meta name="description" content="Reportes y análisis avanzados del sistema SCIAC" />
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
                  <h1 className="text-2xl font-bold text-gray-900">Reportes Avanzados</h1>
                  <p className="text-gray-600">Análisis y estadísticas del sistema</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => exportReport('pdf')}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </button>
                <button
                  onClick={() => exportReport('excel')}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Excel
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Report Selection Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Reporte</h3>
                  
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <button
                        key={report.id}
                        onClick={() => setSelectedReport(report.id)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedReport === report.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg ${report.bgColor}`}>
                            <report.icon className={`w-5 h-5 ${report.color}`} />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">{report.name}</h4>
                            <p className="text-sm text-gray-600">{report.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Filters */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Filtros</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rango de Fechas
                        </label>
                        <select
                          value={dateRange}
                          onChange={(e) => setDateRange(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="week">Última Semana</option>
                          <option value="month">Último Mes</option>
                          <option value="quarter">Último Trimestre</option>
                          <option value="year">Último Año</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={generateReport}
                      disabled={loading}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generando...
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Generar Reporte
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="lg:col-span-3">
                {renderReportContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ReportsPage; 