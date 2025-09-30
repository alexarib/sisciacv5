import React from 'react';
import { FileText } from 'lucide-react';

const DirectFormTest = ({ onOpenForm }) => {
    const openFormDirectly = () => {
        console.log('DirectFormTest: Opening form directly');
        onOpenForm({
            coordinates: { lat: 10.4806, lng: -66.9036 },
            elementType: 'marker',
            elementData: null
        });
    };

    return (
        <div className="fixed bottom-4 left-28 z-50">
            <button
                onClick={openFormDirectly}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
                title="Abrir Formulario Directamente"
            >
                <FileText className="w-5 h-5" />
            </button>
        </div>
    );
};

export default DirectFormTest; 