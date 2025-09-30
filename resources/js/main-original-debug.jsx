import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.jsx';
import { AuthProvider } from './contexts/AuthContextDebug';
import Toaster from './components/ui/Toaster';
import 'react-toastify/dist/ReactToastify.css';
import '../css/app.css';

console.log('=== MAIN ORIGINAL DEBUG LOADING ===');

// Renderizar la aplicación
const rootElement = document.getElementById('app');
console.log('Root element found:', rootElement);

if (rootElement) {
    console.log('Creating React root...');
    const root = ReactDOM.createRoot(rootElement);
    console.log('Rendering App...');
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                    <Toaster />
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
    console.log('App rendered successfully');
} else {
    console.error('Root element #app not found!');
} 