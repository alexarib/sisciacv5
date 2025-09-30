import React, { useState } from 'react';
import { X } from 'lucide-react';

// Formulario para agregar/editar precios de mercado
export const PriceForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
        product: '', category: '', current_price: '', previous_price: '', unit: 'kg',
        market: '', trend: 'stable', change_percentage: '', source: 'SENIAT', quality: 'Estándar'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            current_price: parseFloat(formData.current_price),
            previous_price: parseFloat(formData.previous_price),
            change_percentage: parseFloat(formData.change_percentage)
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Editar Precio' : 'Agregar Nuevo Precio'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Producto *</label>
                            <input
                                type="text"
                                value={formData.product}
                                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Categoría *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar categoría</option>
                                <option value="granos">Granos</option>
                                <option value="vegetales">Vegetales</option>
                                <option value="frutas">Frutas</option>
                                <option value="tubérculos">Tubérculos</option>
                                <option value="legumbres">Legumbres</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Precio Actual ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.current_price}
                                onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Precio Anterior ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.previous_price}
                                onChange={(e) => setFormData({ ...formData, previous_price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Unidad *</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="kg">Kilogramo (kg)</option>
                                <option value="lb">Libra (lb)</option>
                                <option value="ton">Tonelada (ton)</option>
                                <option value="unidad">Unidad</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Mercado *</label>
                            <input
                                type="text"
                                value={formData.market}
                                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                                placeholder="ej: Mercado Central de Caracas"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Tendencia *</label>
                            <select
                                value={formData.trend}
                                onChange={(e) => setFormData({ ...formData, trend: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="up">Subiendo</option>
                                <option value="down">Bajando</option>
                                <option value="stable">Estable</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Cambio (%) *</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.change_percentage}
                                onChange={(e) => setFormData({ ...formData, change_percentage: e.target.value })}
                                placeholder="ej: 8.7"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Fuente *</label>
                            <select
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="SENIAT">SENIAT</option>
                                <option value="Mercado Local">Mercado Local</option>
                                <option value="Cooperativa">Cooperativa</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Calidad *</label>
                            <select
                                value={formData.quality}
                                onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Premium">Premium</option>
                                <option value="Estándar">Estándar</option>
                                <option value="Básica">Básica</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            {initialData ? 'Actualizar' : 'Crear'} Precio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Formulario para agregar/editar transacciones
export const TransactionForm = ({ isOpen, onClose, onSubmit, initialData = null, producers = [], channels = [] }) => {
    const [formData, setFormData] = useState(initialData || {
        producer_id: '', product: '', quantity: '', unit: 'kg', price_per_unit: '',
        channel: '', payment_method: 'Efectivo', buyer: '', notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            quantity: parseFloat(formData.quantity),
            price_per_unit: parseFloat(formData.price_per_unit),
            total_amount: parseFloat(formData.quantity) * parseFloat(formData.price_per_unit)
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Editar Transacción' : 'Nueva Transacción'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Productor *</label>
                            <select
                                value={formData.producer_id}
                                onChange={(e) => setFormData({ ...formData, producer_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar productor</option>
                                {producers.map(producer => (
                                    <option key={producer.id} value={producer.id}>{producer.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Producto *</label>
                            <input
                                type="text"
                                value={formData.product}
                                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                                placeholder="ej: Maíz, Tomate, Papa"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Cantidad *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Unidad *</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="kg">Kilogramo (kg)</option>
                                <option value="lb">Libra (lb)</option>
                                <option value="ton">Tonelada (ton)</option>
                                <option value="unidad">Unidad</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Precio por Unidad ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.price_per_unit}
                                onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Canal de Venta *</label>
                            <select
                                value={formData.channel}
                                onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar canal</option>
                                {channels.map(channel => (
                                    <option key={channel.id} value={channel.name}>{channel.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Método de Pago *</label>
                            <select
                                value={formData.payment_method}
                                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Cheque">Cheque</option>
                                <option value="Tarjeta">Tarjeta</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Comprador *</label>
                        <input
                            type="text"
                            value={formData.buyer}
                            onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                            placeholder="ej: Distribuidora Miranda, Restaurante El Buen Sabor"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Notas</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="3"
                            placeholder="Información adicional sobre la transacción..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            {initialData ? 'Actualizar' : 'Crear'} Transacción
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Formulario para agregar/editar canales de venta
export const ChannelForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
        name: '', type: 'mercado', location: '', contact: '', capacity: '',
        commission: '', payment_terms: '', products: '', status: 'active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            commission: parseFloat(formData.commission),
            products: formData.products.split(',').map(p => p.trim())
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Editar Canal' : 'Agregar Nuevo Canal'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Nombre del Canal *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="ej: Mercado Central de Caracas"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Tipo *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="mercado">Mercado</option>
                                <option value="directa">Venta Directa</option>
                                <option value="cooperativa">Cooperativa</option>
                                <option value="distribuidor">Distribuidor</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Ubicación *</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="ej: Caracas, Distrito Capital"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Contacto</label>
                            <input
                                type="text"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                placeholder="ej: +58 212-555-1234"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Capacidad *</label>
                            <input
                                type="text"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                placeholder="ej: 1000 ton/mes"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Comisión (%) *</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="100"
                                value={formData.commission}
                                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Estado *</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Términos de Pago *</label>
                            <select
                                value={formData.payment_terms}
                                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Seleccionar términos</option>
                                <option value="Inmediato">Inmediato</option>
                                <option value="7 días">7 días</option>
                                <option value="15 días">15 días</option>
                                <option value="30 días">30 días</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Productos (separados por comas)</label>
                            <input
                                type="text"
                                value={formData.products}
                                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                                placeholder="ej: Maíz, Tomate, Papa, Plátano"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                        >
                            {initialData ? 'Actualizar' : 'Crear'} Canal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 