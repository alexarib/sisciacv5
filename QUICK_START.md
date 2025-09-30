# 🚀 INICIO RÁPIDO - SISCIAC

## ⚡ Instalación en 5 minutos

### 1. **Configurar Base de Datos**

```bash
# Crear base de datos PostgreSQL
createdb sisciac_db

# O para MySQL
mysql -u root -p
CREATE DATABASE sisciac_db;
```

### 2. **Configurar Variables de Entorno**

```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales
DB_CONNECTION=pgsql  # o mysql
DB_HOST=127.0.0.1
DB_PORT=5432        # 3306 para MySQL
DB_DATABASE=sisciac_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

### 3. **Instalar y Configurar**

```bash
# Instalar dependencias
composer install
npm install

# Generar clave de aplicación
php artisan key:generate

# Ejecutar migraciones y seeders
php artisan migrate --seed
```

### 4. **Iniciar Servidores**

```bash
# Terminal 1: Servidor Laravel
php artisan serve

# Terminal 2: Servidor de assets
npm run dev
```

### 5. **Acceder al Sistema**

-   **URL**: http://localhost:8000
-   **Admin**: `admin` / `admin123`
-   **Productor**: `juan.perez` / `password123`

## 🎯 Funcionalidades Principales

### **Para Administradores**

-   ✅ Dashboard con estadísticas completas
-   ✅ Gestión de productores
-   ✅ Seguimiento de cultivos
-   ✅ Sistema de logística
-   ✅ Capacitaciones
-   ✅ Reportes y análisis

### **Para Productores**

-   ✅ Dashboard personal
-   ✅ Gestión de cultivos propios
-   ✅ Ver capacitaciones
-   ✅ Seguimiento de logística
-   ✅ Perfil y configuración

## 🔧 Comandos Útiles

```bash
# Ver estado de migraciones
php artisan migrate:status

# Recrear base de datos
php artisan migrate:fresh --seed

# Limpiar cache
php artisan cache:clear
php artisan config:clear

# Ver rutas disponibles
php artisan route:list --path=api
```

## 📱 Características Responsive

-   ✅ **Móvil**: Navegación optimizada
-   ✅ **Tablet**: Layout adaptativo
-   ✅ **Desktop**: Interfaz completa
-   ✅ **PWA Ready**: Instalable como app

## 🚀 Listo para Producción

El sistema está completamente funcional y listo para ser desplegado en producción con:

-   ✅ Autenticación segura
-   ✅ API REST completa
-   ✅ Base de datos optimizada
-   ✅ Frontend responsive
-   ✅ Validaciones robustas

---

**¡SISCIAC está listo para usar!** 🌱
