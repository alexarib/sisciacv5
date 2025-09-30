# 🔧 INSTRUCCIONES DE INSTALACIÓN MANUAL

## ⚠️ PASOS NECESARIOS PARA COMPLETAR LA INSTALACIÓN

### **1. Instalar Laravel Sanctum (Requerido para autenticación API)**

Debido a problemas de SSL con Composer, necesitas instalar Laravel Sanctum manualmente:

```bash
# Opción 1: Usar Composer con configuración SSL
composer require laravel/sanctum --ignore-platform-reqs

# Opción 2: Si persiste el problema SSL, editar composer.json manualmente
# Agregar en la sección "require":
"laravel/sanctum": "^4.0"

# Luego ejecutar:
composer update
```

### **2. Publicar configuración de Sanctum**

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### **3. Ejecutar migraciones de Sanctum**

```bash
php artisan migrate
```

### **4. Actualizar modelo User**

Una vez instalado Sanctum, agregar el trait en `app/Models/User.php`:

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;
    // ... resto del código
}
```

### **5. Configurar CORS (Opcional pero recomendado)**

```bash
# Publicar configuración de CORS
php artisan vendor:publish --tag="cors"
```

### **6. Verificar instalación**

```bash
# Verificar que todo funciona
php artisan serve
npm run dev
```

## 🚀 ALTERNATIVA: USAR SISTEMA SIN SANCTUM

Si no puedes instalar Sanctum, puedes usar el sistema con autenticación básica:

### **1. Modificar AuthController**

Cambiar el método `login` en `app/Http/Controllers/AuthController.php`:

```php
public function login(Request $request): JsonResponse
{
    $validated = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    $user = User::where('username', $validated['username'])
        ->orWhere('email', $validated['username'])
        ->first();

    if (!$user || !Hash::check($validated['password'], $user->password)) {
        return response()->json([
            'message' => 'Credenciales inválidas',
            'errors' => ['username' => ['Las credenciales proporcionadas son incorrectas']]
        ], 401);
    }

    // Simular token (sin Sanctum)
    $token = base64_encode($user->id . '|' . time());

    return response()->json([
        'message' => 'Login exitoso',
        'user' => $user,
        'token' => $token,
        'token_type' => 'Bearer'
    ]);
}
```

### **2. Modificar AuthContext**

Actualizar `resources/js/contexts/AuthContext.jsx` para manejar tokens simples.

## 📋 VERIFICACIÓN FINAL

### **Comandos para verificar que todo funciona:**

```bash
# 1. Verificar que Laravel funciona
php artisan --version

# 2. Verificar que las migraciones están listas
php artisan migrate:status

# 3. Verificar que los assets se compilan
npm run build

# 4. Verificar que el servidor inicia
php artisan serve

# 5. Verificar que Vite funciona
npm run dev
```

### **URLs de prueba:**

-   **Frontend**: http://localhost:8000
-   **API**: http://localhost:8000/api/auth/login

### **Usuarios de prueba:**

-   **Admin**: `admin` / `admin123`
-   **Productor**: `juan.perez` / `password123`

## 🔧 SOLUCIÓN DE PROBLEMAS COMUNES

### **Error: Vite manifest not found**

```bash
npm run build
```

### **Error: Class not found**

```bash
composer dump-autoload
```

### **Error: Migration not found**

```bash
php artisan migrate:fresh --seed
```

### **Error: SSL Certificate**

```bash
# Configurar Composer para ignorar SSL
composer config --global disable-tls true
composer config --global secure-http false
```

---

**Una vez completados estos pasos, el sistema SISCIAC estará completamente funcional.** 🎉
