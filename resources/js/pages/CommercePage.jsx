import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Plus,
  Search,
  Edit,
  Trash2,
  DollarSign,
  ShoppingCart,
  Package,
  ArrowLeft,
  Filter,
  Download,
  Eye,
  TrendingDown,
  BarChart3,
  Calendar,
  MapPin,
  Users,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showMapNotification } from '../components/ui/Toaster';
import { PriceForm, TransactionForm, ChannelForm } from '../components/CommerceForms';

const CommercePage = () => {
  const { user } = useAuth();
  
  const [prices, setPrices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [channels, setChannels] = useState([]);
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [activeTab, setActiveTab] = useState('prices');

  // Estados para formularios
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editingChannel, setEditingChannel] = useState(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('sisciac_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  };

  const refreshData = async () => {
    try {
      const [pricesRes, transactionsRes, channelsRes, producersRes] = await Promise.all([
        fetch('/api/market-prices', { headers: getAuthHeaders() }),
        fetch('/api/transactions', { headers: getAuthHeaders() }),
        fetch('/api/sales-channels', { headers: getAuthHeaders() }),
        fetch('/api/producers', { headers: getAuthHeaders() })
      ]);

      const pricesData = await pricesRes.json();
      const transactionsData = await transactionsRes.json();
      const channelsData = await channelsRes.json();
      const producersData = await producersRes.json();

      setPrices(pricesData.data || pricesData || mockPrices);
      setTransactions(transactionsData.data || transactionsData || mockTransactions);
      setChannels(channelsData.data || channelsData || mockChannels);
      setProducers(producersData.data || producersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback a datos simulados
      setPrices(mockPrices);
      setTransactions(mockTransactions);
      setChannels(mockChannels);
      setProducers([]);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, []);

  // Mock data (fallback)
  const mockPrices = [
    {
      id: 1,
      product: 'Maíz',
      category: 'granos',
      current_price: 2.50,
      previous_price: 2.30,
      unit: 'kg',
      market: 'Mercado Central de Caracas',
      trend: 'up',
      change_percentage: 8.7,
      last_updated: '2024-08-07',
      source: 'SENIAT',
      quality: 'Premium'
    },
    {
      id: 2,
      product: 'Tomate',
      category: 'vegetales',
      current_price: 1.80,
      previous_price: 2.10,
      unit: 'kg',
      market: 'Mercado de Quinta Crespo',
      trend: 'down',
      change_percentage: -14.3,
      last_updated: '2024-08-07',
      source: 'SENIAT',
      quality: 'Estándar'
    }
  ];

  const mockTransactions = [
    {
      id: 1,
      producer_name: 'Juan Pérez',
      product: 'Maíz',
      quantity: 500,
      unit: 'kg',
      price_per_unit: 2.50,
      total_amount: 1250.00,
      channel: 'Mercado Central',
      date: '2024-08-06',
      status: 'completed',
      payment_method: 'Transferencia',
      buyer: 'Distribuidora Miranda'
    },
    {
      id: 2,
      producer_name: 'María González',
      product: 'Tomate',
      quantity: 200,
      unit: 'kg',
      price_per_unit: 1.80,
      total_amount: 360.00,
      channel: 'Venta Directa',
      date: '2024-08-05',
      status: 'completed',
      payment_method: 'Efectivo',
      buyer: 'Restaurante El Buen Sabor'
    }
  ];

  const mockChannels = [
    {
      id: 1,
      name: 'Mercado Central de Caracas',
      type: 'mercado',
      location: 'Caracas, Distrito Capital',
      contact: '+58 212-555-1234',
      capacity: '1000 ton/mes',
      status: 'active',
      commission: 5.0,
      payment_terms: '7 días',
      products: ['Maíz', 'Tomate', 'Papa', 'Plátano']
    },
    {
      id: 2,
      name: 'Venta Directa',
      type: 'directa',
      location: 'Municipio Simón Bolívar',
      contact: 'N/A',
      capacity: '500 ton/mes',
      status: 'active',
      commission: 0.0,
      payment_terms: 'Inmediato',
      products: ['Todos los productos']
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

  // Funciones para precios
  const handleAddPrice = () => {
    setEditingPrice(null);
    setShowPriceForm(true);
  };

  const handleEditPrice = (price) => {
    setEditingPrice(price);
    setShowPriceForm(true);
  };

  const handleDeletePrice = async (priceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este precio?')) {
      try {
        await fetch(`/api/market-prices/${priceId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        showMapNotification('Precio eliminado: El precio ha sido eliminado exitosamente.', 'info');
        await refreshData();
      } catch (e) {
        showMapNotification('Error: No se pudo eliminar el precio', 'error');
      }
    }
  };

  const handleSubmitPrice = async (priceData) => {
    try {
      if (editingPrice) {
        await apiPut(`/api/market-prices/${editingPrice.id}`, priceData);
        showMapNotification('Precio actualizado: El precio ha sido actualizado exitosamente.', 'info');
      } else {
        await apiPost('/api/market-prices', priceData);
        showMapNotification('Precio creado: El precio ha sido creado exitosamente.', 'info');
      }
      setShowPriceForm(false);
      setEditingPrice(null);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo guardar el precio', 'error');
    }
  };

  // Funciones para transacciones
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowTransactionForm(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      try {
        await fetch(`/api/transactions/${transactionId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        showMapNotification('Transacción eliminada: La transacción ha sido eliminada exitosamente.', 'info');
        await refreshData();
      } catch (e) {
        showMapNotification('Error: No se pudo eliminar la transacción', 'error');
      }
    }
  };

  const handleSubmitTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        await apiPut(`/api/transactions/${editingTransaction.id}`, transactionData);
        showMapNotification('Transacción actualizada: La transacción ha sido actualizada exitosamente.', 'info');
      } else {
        await apiPost('/api/transactions', transactionData);
        showMapNotification('Transacción creada: La transacción ha sido creada exitosamente.', 'info');
      }
      setShowTransactionForm(false);
      setEditingTransaction(null);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo guardar la transacción', 'error');
    }
  };

  // Funciones para canales
  const handleAddChannel = () => {
    setEditingChannel(null);
    setShowChannelForm(true);
  };

  const handleEditChannel = (channel) => {
    setEditingChannel(channel);
    setShowChannelForm(true);
  };

  const handleDeleteChannel = async (channelId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este canal?')) {
      try {
        await fetch(`/api/sales-channels/${channelId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        showMapNotification('Canal eliminado: El canal ha sido eliminado exitosamente.', 'info');
        await refreshData();
      } catch (e) {
        showMapNotification('Error: No se pudo eliminar el canal', 'error');
      }
    }
  };

  const handleSubmitChannel = async (channelData) => {
    try {
      if (editingChannel) {
        await apiPut(`/api/sales-channels/${editingChannel.id}`, channelData);
        showMapNotification('Canal actualizado: El canal ha sido actualizado exitosamente.', 'info');
      } else {
        await apiPost('/api/sales-channels', channelData);
        showMapNotification('Canal creado: El canal ha sido creado exitosamente.', 'info');
      }
      setShowChannelForm(false);
      setEditingChannel(null);
      await refreshData();
    } catch (e) {
      showMapNotification('Error: No se pudo guardar el canal', 'error');
    }
  };

  const filteredPrices = prices.filter(price => {
    const matchesSearch = price.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      price.market.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || price.trend === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.producer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.channel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || channel.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      case 'stable':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  const getChannelTypeColor = (type) => {
    switch (type) {
      case 'mercado':
        return 'bg-blue-100 text-blue-800';
      case 'directa':
        return 'bg-green-100 text-green-800';
      case 'cooperativa':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <title>Comercialización y Precios - SISCIAC</title>
        <meta name="description" content="Gestión de precios de mercado y comercialización del sistema SISCIAC" />
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
                  <h1 className="text-2xl font-bold text-gray-900">Comercialización y Precios</h1>
                  <p className="text-gray-600">Gestión de precios de mercado y transacciones</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleAddTransaction}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Transacción
                </button>
                <button
                  onClick={handleAddPrice}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Actualizar Precios
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
                    onClick={() => setActiveTab('prices')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'prices'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Precios de Mercado
                  </button>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'transactions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Transacciones
                  </button>
                  <button
                    onClick={() => setActiveTab('channels')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'channels'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <Package className="w-4 h-4 inline mr-2" />
                    Canales de Venta
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
                        placeholder={`Buscar ${activeTab === 'prices' ? 'productos' : activeTab === 'transactions' ? 'transacciones' : 'canales'}...`}
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
                      {activeTab === 'prices' && (
                        <>
                          <option value="up">Subiendo</option>
                          <option value="down">Bajando</option>
                          <option value="stable">Estable</option>
                        </>
                      )}
                      {activeTab === 'transactions' && (
                        <>
                          <option value="completed">Completado</option>
                          <option value="pending">Pendiente</option>
                          <option value="cancelled">Cancelado</option>
                        </>
                      )}
                      {activeTab === 'channels' && (
                        <>
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </>
                      )}
                    </select>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </button>
                  </div>
                </div>
              </div>

              {/* Content based on active tab */}
              <div className="p-6">
                {activeTab === 'prices' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Actual
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tendencia
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mercado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Calidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Última Actualización
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPrices.map((price) => (
                          <tr key={price.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Package className="w-5 h-5 text-green-600" />
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{price.product}</div>
                                  <div className="text-sm text-gray-500 capitalize">{price.category}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ${price.current_price.toFixed(2)} / {price.unit}
                              </div>
                              <div className="text-sm text-gray-500">
                                Anterior: ${price.previous_price.toFixed(2)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`mr-2 ${getTrendColor(price.trend)}`}>
                                  {getTrendIcon(price.trend)}
                                </div>
                                <span className={`text-sm font-medium ${getTrendColor(price.trend)}`}>
                                  {price.change_percentage > 0 ? '+' : ''}{price.change_percentage.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {price.market}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${price.quality === 'Premium' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                {price.quality}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(price.last_updated).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEditPrice(price)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeletePrice(price.id)}
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

                {activeTab === 'transactions' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Productor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Total
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Canal
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {transaction.producer_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.product}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.quantity} {transaction.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${transaction.total_amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.channel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                {getStatusText(transaction.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleEditTransaction(transaction)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTransaction(transaction.id)}
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

                {activeTab === 'channels' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChannels.map((channel) => (
                      <motion.div
                        key={channel.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getChannelTypeColor(channel.type)}`}>
                              {channel.type}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(channel.status)}`}>
                              {getStatusText(channel.status)}
                            </span>
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.name}</h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {channel.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Package className="w-4 h-4 mr-2" />
                              Capacidad: {channel.capacity}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="w-4 h-4 mr-2" />
                              Comisión: {channel.commission}%
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              Pago: {channel.payment_terms}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Productos:</h4>
                            <div className="flex flex-wrap gap-1">
                              {channel.products.map((product, index) => (
                                <span key={index} className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {product}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 text-sm">
                              Ver Detalles
                            </button>
                            <button
                              onClick={() => handleEditChannel(channel)}
                              className="bg-gray-100 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-200 text-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteChannel(channel.id)}
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
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Productos Monitoreados</p>
                    <p className="text-2xl font-semibold text-gray-900">{prices.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Transacciones</p>
                    <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Canales Activos</p>
                    <p className="text-2xl font-semibold text-gray-900">{channels.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Volumen Total</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${transactions.reduce((sum, t) => sum + t.total_amount, 0).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Formularios */}
      <PriceForm
        isOpen={showPriceForm}
        onClose={() => {
          setShowPriceForm(false);
          setEditingPrice(null);
        }}
        onSubmit={handleSubmitPrice}
        initialData={editingPrice}
      />

      <TransactionForm
        isOpen={showTransactionForm}
        onClose={() => {
          setShowTransactionForm(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmitTransaction}
        initialData={editingTransaction}
        producers={producers}
        channels={channels}
      />

      <ChannelForm
        isOpen={showChannelForm}
        onClose={() => {
          setShowChannelForm(false);
          setEditingChannel(null);
        }}
        onSubmit={handleSubmitChannel}
        initialData={editingChannel}
      />
    </>
  );
};

export default CommercePage; 