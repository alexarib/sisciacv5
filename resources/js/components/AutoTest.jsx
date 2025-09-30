import React from 'react';
import { Play } from 'lucide-react';

const AutoTest = ({ onTestAdd, onTestMapClick, onOpenForm }) => {
    const runAllTests = async () => {
        console.log('=== INICIANDO PRUEBAS AUTOMÁTICAS ===');

        // Test 1: Activar modo agregar
        console.log('Test 1: Activando modo agregar...');
        onTestAdd('producer');

        // Esperar un momento
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test 2: Simular clic en mapa
        console.log('Test 2: Simulando clic en mapa...');
        onTestMapClick(10.4806, -66.9036);

        // Esperar un momento
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test 3: Abrir formulario directamente
        console.log('Test 3: Abriendo formulario directamente...');
        onOpenForm({
            coordinates: { lat: 10.4806, lng: -66.9036 },
            elementType: 'marker',
            elementData: null
        });

        console.log('=== PRUEBAS COMPLETADAS ===');
    };

    return (
        <div className="fixed bottom-4 left-40 z-50">
            <button
                onClick={runAllTests}
                className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                title="Ejecutar Todas las Pruebas"
            >
                <Play className="w-5 h-5" />
            </button>
        </div>
    );
};

export default AutoTest; 