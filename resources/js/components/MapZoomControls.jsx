import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const MapZoomControls = ({ onZoomIn, onZoomOut, onReset }) => {
    return (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-2 space-y-2">
            <button
                onClick={onZoomIn}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded border border-gray-300 transition-colors"
                title="Acercar"
            >
                <ZoomIn className="w-4 h-4 text-gray-600" />
            </button>
            <button
                onClick={onZoomOut}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded border border-gray-300 transition-colors"
                title="Alejar"
            >
                <ZoomOut className="w-4 h-4 text-gray-600" />
            </button>
            <button
                onClick={onReset}
                className="w-8 h-8 flex items-center justify-center bg-white hover:bg-gray-100 rounded border border-gray-300 transition-colors"
                title="Resetear vista"
            >
                <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
        </div>
    );
};

export default MapZoomControls; 