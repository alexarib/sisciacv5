<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - SISCIAC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
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
                    <a href="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        <i class="fas fa-home mr-2"></i>Inicio
                    </a>
                    <a href="/login" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        <i class="fas fa-sign-in-alt mr-2"></i>Iniciar Sesión
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
                    <i class="fas fa-user-plus text-green-600 text-xl"></i>
                </div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Crear cuenta en SISCIAC
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Únete a la plataforma de gestión agrícola más avanzada
                </p>
            </div>

            <!-- Registration Form -->
            <form class="mt-8 space-y-6" id="registerForm">
                <div class="rounded-md shadow-sm -space-y-px">
                    <!-- Nombre completo -->
                    <div>
                        <label for="name" class="sr-only">Nombre completo</label>
                        <input id="name" name="name" type="text" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Nombre completo">
                    </div>

                    <!-- Email -->
                    <div>
                        <label for="email" class="sr-only">Correo electrónico</label>
                        <input id="email" name="email" type="email" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Correo electrónico">
                    </div>

                    <!-- Teléfono -->
                    <div>
                        <label for="phone" class="sr-only">Teléfono</label>
                        <input id="phone" name="phone" type="tel" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Teléfono">
                    </div>

                    <!-- Tipo de documento -->
                    <div>
                        <label for="document_type" class="sr-only">Tipo de documento</label>
                        <select id="document_type" name="document_type" required 
                                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm">
                            <option value="">Seleccionar tipo de documento</option>
                            <option value="dni">DNI</option>
                            <option value="ruc">RUC</option>
                            <option value="passport">Pasaporte</option>
                        </select>
                    </div>

                    <!-- Número de documento -->
                    <div>
                        <label for="document_number" class="sr-only">Número de documento</label>
                        <input id="document_number" name="document_number" type="text" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Número de documento">
                    </div>

                    <!-- Dirección -->
                    <div>
                        <label for="address" class="sr-only">Dirección</label>
                        <input id="address" name="address" type="text" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Dirección">
                    </div>

                    <!-- Username -->
                    <div>
                        <label for="username" class="sr-only">Nombre de usuario</label>
                        <input id="username" name="username" type="text" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Nombre de usuario">
                    </div>

                    <!-- Password -->
                    <div>
                        <label for="password" class="sr-only">Contraseña</label>
                        <input id="password" name="password" type="password" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Contraseña">
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label for="password_confirmation" class="sr-only">Confirmar contraseña</label>
                        <input id="password_confirmation" name="password_confirmation" type="password" required 
                               class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" 
                               placeholder="Confirmar contraseña">
                    </div>
                </div>

                <!-- Terms and Conditions -->
                <div class="flex items-center">
                    <input id="terms" name="terms" type="checkbox" required 
                           class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
                    <label for="terms" class="ml-2 block text-sm text-gray-900">
                        Acepto los <a href="#" class="text-green-600 hover:text-green-500">términos y condiciones</a> y la <a href="#" class="text-green-600 hover:text-green-500">política de privacidad</a>
                    </label>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit" 
                            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            <i class="fas fa-user-plus text-green-500 group-hover:text-green-400"></i>
                        </span>
                        Crear cuenta
                    </button>
                </div>

                <!-- Login Link -->
                <div class="text-center">
                    <p class="text-sm text-gray-600">
                        ¿Ya tienes una cuenta? 
                        <a href="/login" class="font-medium text-green-600 hover:text-green-500">
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </form>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex items-center justify-center mb-4">
                <i class="fas fa-seedling text-2xl text-green-600 mr-3"></i>
                <h3 class="text-xl font-bold">SISCIAC</h3>
            </div>
            <p class="text-gray-400 text-sm">
                Sistema de Control de Procesos Agrícolas del Municipio Simón Bolívar, Miranda, Venezuela.
            </p>
            <div class="border-t border-gray-800 mt-4 pt-4 text-center text-gray-400">
                <p>&copy; 2024 SISCIAC. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>

    <script>
        // Form validation and submission
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (data.password !== data.password_confirmation) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            if (!data.terms) {
                alert('Debes aceptar los términos y condiciones');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creando cuenta...';
            submitBtn.disabled = true;
            
            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                alert('Registro exitoso! Redirigiendo al login...');
                window.location.href = '/login';
            }, 2000);
        });

        // Real-time validation
        document.getElementById('password_confirmation').addEventListener('input', function() {
            const password = document.getElementById('password').value;
            const confirmation = this.value;
            
            if (password !== confirmation) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#10b981';
            }
        });
    </script>
</body>
</html>
