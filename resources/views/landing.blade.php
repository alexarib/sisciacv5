<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SISCIAC - Sistema de Control de Procesos Agrícolas</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                <div class="flex items-center">
                    <div class="flex-shrink-0">
                        <i class="fas fa-seedling text-3xl text-green-600"></i>
                    </div>
                    <div class="ml-3">
                        <h1 class="text-2xl font-bold text-gray-900">SISCIAC</h1>
                        <p class="text-sm text-gray-600">Sistema de Control de Procesos Agrícolas</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/login" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                        <i class="fas fa-sign-in-alt mr-2"></i>Iniciar Sesión
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-gradient text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-6">
                Transformando la Agricultura
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-blue-100">
                Sistema integral para la gestión y control de procesos agrícolas en el Municipio Simón Bolívar
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/login" class="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    <i class="fas fa-rocket mr-2"></i>Acceder al Sistema
                </a>
                <a href="#features" class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                    <i class="fas fa-info-circle mr-2"></i>Conocer Más
                </a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Funcionalidades Principales
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Herramientas especializadas para la gestión integral de procesos agrícolas
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Gestión de Productores -->
                <div class="feature-card bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div class="text-center">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-users text-2xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Gestión de Productores</h3>
                        <p class="text-gray-600 mb-4">
                            Administración completa de productores, cultivos y actividades agrícolas con seguimiento detallado.
                        </p>
                        <ul class="text-sm text-gray-500 text-left space-y-1">
                            <li>• Registro y perfil de productores</li>
                            <li>• Seguimiento de cultivos</li>
                            <li>• Análisis de rendimientos</li>
                        </ul>
                    </div>
                </div>

                <!-- Mapas Interactivos -->
                <div class="feature-card bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div class="text-center">
                        <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-map-marked-alt text-2xl text-green-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Mapas Interactivos</h3>
                        <p class="text-gray-600 mb-4">
                            Georreferenciación avanzada con herramientas de dibujo y análisis espacial en tiempo real.
                        </p>
                        <ul class="text-sm text-gray-500 text-left space-y-1">
                            <li>• Visualización geográfica</li>
                            <li>• Herramientas de dibujo</li>
                            <li>• Análisis espacial</li>
                        </ul>
                    </div>
                </div>

                <!-- Logística y Suministros -->
                <div class="feature-card bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div class="text-center">
                        <div class="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-truck text-2xl text-yellow-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Logística y Suministros</h3>
                        <p class="text-gray-600 mb-4">
                            Control de inventario, rutas logísticas y gestión de suministros agrícolas.
                        </p>
                        <ul class="text-sm text-gray-500 text-left space-y-1">
                            <li>• Control de inventario</li>
                            <li>• Rutas logísticas</li>
                            <li>• Gestión de suministros</li>
                        </ul>
                    </div>
                </div>

                <!-- Capacitación -->
                <div class="feature-card bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div class="text-center">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-graduation-cap text-2xl text-purple-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Formación Técnica</h3>
                        <p class="text-gray-600 mb-4">
                            Sistema de capacitación y formación técnica para productores y trabajadores agrícolas.
                        </p>
                        <ul class="text-sm text-gray-500 text-left space-y-1">
                            <li>• Cursos especializados</li>
                            <li>• Certificaciones</li>
                            <li>• Seguimiento de progreso</li>
                        </ul>
                    </div>
                </div>

                <!-- Comercialización -->
                <div class="feature-card bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div class="text-center">
                        <div class="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-line text-2xl text-red-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Comercialización</h3>
                        <p class="text-gray-600 mb-4">
                            Análisis de precios de mercado y estrategias de comercialización para productos agrícolas.
                        </p>
                        <ul class="text-sm text-gray-500 text-left space-y-1">
                            <li>• Precios de mercado</li>
                            <li>• Análisis de tendencias</li>
                            <li>• Estrategias de venta</li>
                        </ul>
                    </div>
                </div>

                <!-- Reportes -->
                <div class="feature-card bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                    <div class="text-center">
                        <div class="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-chart-bar text-2xl text-indigo-600"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900 mb-3">Reportes y Análisis</h3>
                        <p class="text-gray-600 mb-4">
                            Generación de reportes detallados y análisis estadísticos para la toma de decisiones.
                        </p>
                        <ul class="text-sm text-gray-500 text-left space-y-1">
                            <li>• Reportes personalizados</li>
                            <li>• Análisis estadísticos</li>
                            <li>• Dashboards interactivos</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-20 bg-gray-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div class="text-center lg:text-left">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
                    <p class="text-lg text-gray-600 mb-6">
                        Desarrollar y mantener un sistema integral de control de procesos agrícolas que optimice la producción, 
                        mejore la calidad de vida de los productores y contribuya al desarrollo sostenible del sector agrícola 
                        en el Municipio Simón Bolívar.
                    </p>
                </div>
                <div class="text-center lg:text-left">
                    <h2 class="text-3xl font-bold text-gray-900 mb-6">Nuestra Visión</h2>
                    <p class="text-lg text-gray-600 mb-6">
                        Ser el sistema de referencia en la gestión de procesos agrícolas, reconocido por su innovación, 
                        eficiencia y contribución al desarrollo del sector agrícola venezolano, promoviendo la modernización 
                        y tecnificación del campo.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-green-600">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">
                ¿Listo para Transformar tu Agricultura?
            </h2>
            <p class="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Únete a la revolución agrícola digital y comienza a gestionar tus procesos de manera eficiente y moderna.
            </p>
            <a href="/login" class="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center">
                <i class="fas fa-arrow-right mr-2"></i>Comenzar Ahora
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <i class="fas fa-seedling text-2xl text-green-600 mr-3"></i>
                        <h3 class="text-xl font-bold">SISCIAC</h3>
                    </div>
                    <p class="text-gray-400">
                        Sistema de Control de Procesos Agrícolas del Municipio Simón Bolívar, Miranda, Venezuela.
                    </p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
                    <ul class="space-y-2">
                        <li><a href="/login" class="text-gray-400 hover:text-white transition-colors">Iniciar Sesión</a></li>
                        <li><a href="#features" class="text-gray-400 hover:text-white transition-colors">Funcionalidades</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Soporte</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contacto</h4>
                    <div class="space-y-2 text-gray-400">
                        <p><i class="fas fa-map-marker-alt mr-2"></i>Municipio Simón Bolívar, Miranda</p>
                        <p><i class="fas fa-envelope mr-2"></i>info@sisciac.gob.ve</p>
                        <p><i class="fas fa-phone mr-2"></i>+58 (212) 000-0000</p>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 SISCIAC. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    </script>
</body>
</html>
