<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>SISCIAC - Sistema de Información de Cultivos y Asistencia Comunitaria</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Compiled Assets for Production -->
    <link rel="stylesheet" href="{{ asset('build/assets/app--ypcBbvM.css') }}">
    <link rel="stylesheet" href="{{ asset('build/assets/main-AAOzvmV9.css') }}">
</head>
<body class="font-sans antialiased">
    <div id="app">
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif;">
            <div style="text-align: center; padding: 2rem;">
                <div style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top: 4px solid #4299e1; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                <h2 style="color: #2d3748; margin-bottom: 1rem;">Cargando SISCIAC...</h2>
                <p style="color: #718096;">Iniciando aplicación React...</p>
                <div id="loading-status" style="margin-top: 1rem;"></div>
            </div>
        </div>
    </div>
    
    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .status {
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            font-weight: 500;
        }
        .status.success {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            color: #22543d;
        }
        .status.error {
            background: #fed7d7;
            border: 1px solid #feb2b2;
            color: #c53030;
        }
        .status.warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
    </style>
    
    <!-- Compiled JavaScript for Production -->
    <script type="module" src="{{ asset('build/assets/main-BRnjMivF.js') }}"></script>
    
    <script>
        console.log('🌱 SISCIAC - Iniciando aplicación...');
        
        const statusDiv = document.getElementById('loading-status');
        
        function updateStatus(message, type = 'info') {
            const className = type === 'error' ? 'error' : type === 'success' ? 'success' : 'warning';
            statusDiv.innerHTML = `<div class="status ${className}">${message}</div>`;
        }
        
        // Verificar si React se carga correctamente
        setTimeout(() => {
            const appDiv = document.getElementById('app');
            const loadingDiv = appDiv.querySelector('div[style*="display: flex"]');
            
            if (loadingDiv && loadingDiv.style.display !== 'none') {
                updateStatus('⚠️ React no se cargó correctamente', 'warning');
                
                // Mostrar página de fallback
                setTimeout(() => {
                    appDiv.innerHTML = `
                        <div style="min-height: 100vh; background: #f8fafc; font-family: 'Inter', sans-serif;">
                            <div style="max-width: 1200px; margin: 0 auto; padding: 2rem;">
                                <div style="background: white; border-radius: 12px; padding: 3rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                                    <h1 style="color: #2d3748; margin-bottom: 1rem;">🌱 SISCIAC</h1>
                                    <h2 style="color: #4a5568; margin-bottom: 2rem;">Sistema de Información de Cultivos y Asistencia Comunitaria</h2>
                                    
                                    <div class="status error" style="margin: 2rem 0;">
                                        <h3>⚠️ Error cargando la aplicación React</h3>
                                        <p>El sistema está funcionando, pero hay un problema con la aplicación React.</p>
                                    </div>
                                    
                                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin: 2rem 0;">
                                        <a href="/sistema-real" style="background: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                                            🔧 Sistema Real
                                        </a>
                                        <a href="/debug-react" style="background: #ed8936; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                                            🔍 Diagnosticar
                                        </a>
                                        <a href="/sisciac" style="background: #48bb78; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                                            ✅ Sistema Funcional
                                        </a>
                                    </div>
                                    
                                    <div class="status warning" style="margin: 2rem 0;">
                                        <h3>💡 Soluciones</h3>
                                        <ol style="text-align: left; max-width: 500px; margin: 0 auto;">
                                            <li>Usa el <a href="/sistema-real" style="color: #4299e1;">sistema real</a> para acceder a React</li>
                                            <li>Usa el <a href="/sisciac" style="color: #48bb78;">sistema funcional</a> como alternativa</li>
                                            <li>Ejecuta <code>npm run build</code> para recompilar</li>
                                            <li>Verifica la consola del navegador (F12)</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }, 2000);
            } else {
                updateStatus('✅ React cargado correctamente', 'success');
            }
        }, 5000);
        
        // Verificar conectividad
        setTimeout(() => {
            fetch('/api/dashboard/stats')
                .then(response => {
                    if (response.ok) {
                        updateStatus('✅ Servidor y API funcionando', 'success');
                    } else {
                        updateStatus('⚠️ API no disponible', 'warning');
                    }
                })
                .catch(error => {
                    updateStatus('❌ Error de conectividad', 'error');
                });
        }, 2000);
    </script>
</body>
</html>
