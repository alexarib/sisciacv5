import React from 'react';
import { MousePointer } from 'lucide-react';

const TestMapClick = ({ onTestMapClick }) => {
    const testMapClick = () => {
        console.log('Test: Simulating map click');
        // Simular un clic en el mapa con coordenadas de prueba
        onTestMapClick(10.4806, -66.9036);
    };

    return (
        <div className="fixed bottom-4 left-16 z-50">
            <button
                onClick={testMapClick}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                title="Probar Clic en Mapa"
            >
                <MousePointer className="w-5 h-5" />
            </button>
        </div>
    );
};

export default TestMapClick; 