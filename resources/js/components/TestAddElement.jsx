import React from 'react';
import { Plus, TestTube } from 'lucide-react';

const TestAddElement = ({ onTestAdd }) => {
    const testAddElement = () => {
        console.log('Test: Simulating add element flow');
        onTestAdd('producer');
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <button
                onClick={testAddElement}
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                title="Probar Agregar Elemento"
            >
                <TestTube className="w-5 h-5" />
            </button>
        </div>
    );
};

export default TestAddElement; 