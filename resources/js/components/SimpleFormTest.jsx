import React from 'react';

const SimpleFormTest = ({ isOpen, onClose }) => {
    console.log('SimpleFormTest render:', { isOpen });

    if (!isOpen) {
        console.log('SimpleFormTest: Not rendering - isOpen is false');
        return null;
    }

    console.log('SimpleFormTest: Rendering simple form');

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 99999
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    minWidth: '300px',
                    maxWidth: '500px'
                }}
            >
                <h2 style={{ marginBottom: '20px', color: 'red' }}>FORMULARIO DE PRUEBA SIMPLE</h2>
                <p>Si puedes ver esto, el problema NO está en el renderizado del formulario.</p>
                <p>Estado: {isOpen ? 'ABIERTO' : 'CERRADO'}</p>
                <button
                    onClick={onClose}
                    style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}
                >
                    CERRAR FORMULARIO
                </button>
            </div>
        </div>
    );
};

export default SimpleFormTest; 