import React from 'react';

const SimpleFormButton = ({ onOpenSimpleForm }) => {
    const openSimpleForm = () => {
        console.log('SimpleFormButton: Opening simple form');
        onOpenSimpleForm();
    };

    return (
        <div className="fixed bottom-4 left-52 z-50">
            <button
                onClick={openSimpleForm}
                style={{
                    backgroundColor: 'orange',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}
                title="Probar Formulario Simple"
            >
                S
            </button>
        </div>
    );
};

export default SimpleFormButton; 