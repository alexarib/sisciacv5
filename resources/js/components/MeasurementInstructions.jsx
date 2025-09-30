import React from 'react';
import { Ruler, X } from 'lucide-react';

const MeasurementInstructions = ({ isVisible, onClose, measurementData }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <Ruler className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900">Modo Medición</h3>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <p>• Haz clic en el mapa para agregar puntos de medición</p>
                <p>• Doble clic para finalizar la medición</p>
                <p>• La distancia se calculará automáticamente</p>
            </div>

            {measurementData && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Resultados:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                        {measurementData.distance && (
                            <div>Distancia: {measurementData.distance.toFixed(2)} km</div>
                        )}
                        {measurementData.area && (
                            <div>Área: {measurementData.area.toFixed(2)} km²</div>
                        )}
                        {measurementData.points && (
                            <div>Puntos: {measurementData.points.length}</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeasurementInstructions; 