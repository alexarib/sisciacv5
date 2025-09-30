import React, { useState } from 'react';
import { X } from 'lucide-react';

// Formulario para agregar/editar registros logísticos
export const LogisticsForm = ({ isOpen, onClose, onSubmit, initialData = null, producers = [], crops = [] }) => {
    const [formData, setFormData] = useState(initialData || {
        producer_id: '', crop_id: '', type: 'input', item_name: '', description: '',
        quantity: '', unit: 'kg', unit_price: '', total_price: '', date: new Date().toISOString().slice(0, 10),
        status: 'pending', supplier: '', destination: '', notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            quantity: parseFloat(formData.quantity),
            unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
            total_price: formData.total_price ? parseFloat(formData.total_price) : null
        };
        onSubmit(submitData);
    };

    const calculateTotal = () => {
        if (formData.quantity && formData.unit_price) {
            const total = parseFloat(formData.quantity) * parseFloat(formData.unit_price);
            setFormData({ ...formData, total_price: total.toFixed(2) });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {initialData ? 'Editar Registro Logístico' : 'Nuevo Registro Logístico'}
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
                            <label className="block text-sm text-gray-700 mb-1">Cultivo (Opcional)</label>
                            <select
                                value={formData.crop_id}
                                onChange={(e) => setFormData({ ...formData, crop_id: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Sin cultivo específico</option>
                                {crops.map(crop => (
                                    <option key={crop.id} value={crop.id}>{crop.name} - {crop.producer?.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Tipo de Operación *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="input">Entrada (Insumos)</option>
                                <option value="output">Salida (Productos)</option>
                                <option value="transport">Transporte</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Estado *</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="pending">Pendiente</option>
                                <option value="in_transit">En Tránsito</option>
                                <option value="delivered">Entregado</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Nombre del Item *</label>
                            <input
                                type="text"
                                value={formData.item_name}
                                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                placeholder="ej: Fertilizante NPK, Semillas de maíz, Cosecha de tomate"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Fecha *</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                                onChange={(e) => {
                                    setFormData({ ...formData, quantity: e.target.value });
                                    if (formData.unit_price) calculateTotal();
                                }}
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
                                <option value="kg">Kilogramos (kg)</option>
                                <option value="tons">Toneladas (tons)</option>
                                <option value="liters">Litros (L)</option>
                                <option value="units">Unidades</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Precio Unitario ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.unit_price}
                                onChange={(e) => {
                                    setFormData({ ...formData, unit_price: e.target.value });
                                    if (formData.quantity) calculateTotal();
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Precio Total ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.total_price}
                                onChange={(e) => setFormData({ ...formData, total_price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Proveedor</label>
                            <input
                                type="text"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                placeholder="ej: AgroSupply S.A., Cooperativa Local"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Destino</label>
                        <input
                            type="text"
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            placeholder="ej: Almacén Central, Mercado Local, Cliente Final"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                            placeholder="Descripción detallada del item o operación..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-700 mb-1">Notas Adicionales</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="2"
                            placeholder="Información adicional, observaciones o comentarios..."
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
                            {initialData ? 'Actualizar' : 'Crear'} Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 