import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './app.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Toaster from './components/ui/Toaster';
import 'react-toastify/dist/ReactToastify.css';
import '../css/app.css';

// Configurar axios
axios.defaults.baseURL = window.location.origin;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configurar CSRF token para Laravel
const token = document.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <AuthProvider>
            <App />
            <Toaster />
        </AuthProvider>
    </React.StrictMode>
); 