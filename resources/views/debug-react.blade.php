<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Debug React - SISCIAC</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .debug { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .error { background: #ffebee; color: #c62828; }
        .success { background: #e8f5e8; color: #2e7d32; }
        .info { background: #e3f2fd; color: #1565c0; }
    </style>
</head>
<body>
    <h1>🔍 Debug React - SISCIAC</h1>
    
    <div class="debug info">
        <h3>Información del Sistema</h3>
        <p><strong>Host:</strong> {{ request()->getHost() }}</p>
        <p><strong>URL:</strong> {{ request()->url() }}</p>
        <p><strong>Vista:</strong> {{ request()->getHost() === 'sisciac-laravel.test' ? 'welcome-laragon' : 'welcome' }}</p>
    </div>

    <div class="debug info">
        <h3>Verificación de Assets</h3>
        <div id="assets-status">Verificando assets...</div>
    </div>

    <div class="debug info">
        <h3>Verificación de React</h3>
        <div id="react-status">Verificando React...</div>
    </div>

    <div class="debug info">
        <h3>Consola del Navegador</h3>
        <p>Presiona F12 y revisa la consola para ver errores JavaScript</p>
    </div>

    <div id="app">
        <div class="debug error">
            <h3>⚠️ React no se ha inicializado</h3>
            <p>Si ves este mensaje, React no se está cargando correctamente.</p>
        </div>
    </div>

    <!-- Scripts de Vite -->
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/main.jsx'])

    <script>
        // Debug script
        console.log('🔍 Debug React - SISCIAC iniciado');
        
        // Verificar si Vite está cargando
        setTimeout(() => {
            const assetsStatus = document.getElementById('assets-status');
            const reactStatus = document.getElementById('react-status');
            
            // Verificar si los scripts se cargaron
            const scripts = document.querySelectorAll('script[src*="vite"]');
            if (scripts.length > 0) {
                assetsStatus.innerHTML = '<span style="color: green;">✅ Scripts de Vite detectados</span>';
            } else {
                assetsStatus.innerHTML = '<span style="color: red;">❌ Scripts de Vite no encontrados</span>';
            }
            
            // Verificar si React se inicializó
            setTimeout(() => {
                const appDiv = document.getElementById('app');
                if (appDiv.innerHTML.includes('React no se ha inicializado')) {
                    reactStatus.innerHTML = '<span style="color: red;">❌ React no se inicializó</span>';
                } else {
                    reactStatus.innerHTML = '<span style="color: green;">✅ React se inicializó correctamente</span>';
                }
            }, 2000);
        }, 1000);
        
        // Capturar errores
        window.addEventListener('error', function(e) {
            console.error('🚨 Error detectado:', e.error);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'debug error';
            errorDiv.innerHTML = `<h3>Error JavaScript:</h3><p>${e.message}</p>`;
            document.body.appendChild(errorDiv);
        });
    </script>
</body>
</html>
