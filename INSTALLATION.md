# SISCIAC - Instrucciones de Instalación

## Requisitos Previos

-   PHP 8.2 o superior
-   Composer 2.0 o superior
-   PostgreSQL 12+ o MySQL 8.0+
-   Node.js 16+ (para desarrollo frontend)

## Instalación Paso a Paso

### 1. Clonar el Proyecto

```bash
git clone <repository-url>
cd sisciac-laravel
```

### 2. Instalar Dependencias

```bash
composer install
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar archivo de configuración
cp .env.example .env

# Generar clave de aplicación
php artisan key:generate
```

### 4. Configurar Base de Datos

Editar el archivo `.env` con la configuración de tu base de datos:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sisciac_db
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
```

### 5. Ejecutar Migraciones

```bash
php artisan migrate
```

### 6. Ejecutar Seeders

```bash
php artisan db:seed
```

### 7. Configurar Permisos (Linux/Mac)

```bash
chmod -R 775 storage bootstrap/cache
```

### 8. Iniciar Servidor de Desarrollo

```bash
# Terminal 1: Servidor PHP
php artisan serve

# Terminal 2: Servidor de assets (opcional)
npm run dev
```

## Configuración de Base de Datos

### PostgreSQL (Recomendado)

```sql
-- Crear base de datos
CREATE DATABASE sisciac_db;

-- Crear usuario (opcional)
CREATE USER sisciac_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE sisciac_db TO sisciac_user;
```

### MySQL

```sql
-- Crear base de datos
CREATE DATABASE sisciac_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (opcional)
CREATE USER 'sisciac_user'@'localhost' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON sisciac_db.* TO 'sisciac_user'@'localhost';
FLUSH PRIVILEGES;
```

## Verificación de Instalación

### 1. Verificar API

```bash
# Probar endpoint de estadísticas
curl http://localhost:8000/api/dashboard/stats

# Probar endpoint de productores
curl http://localhost:8000/api/producers
```

### 2. Verificar Base de Datos

```bash
# Verificar tablas creadas
php artisan migrate:status

# Verificar datos de prueba
php artisan tinker
>>> App\Models\Producer::count()
>>> App\Models\Crop::count()
```

## Configuración de Producción

### 1. Optimizar para Producción

```bash
# Optimizar autoloader
composer install --optimize-autoloader --no-dev

# Cachear configuración
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Compilar assets
npm run build
```

### 2. Configurar Servidor Web

#### Apache (.htaccess ya incluido)

```apache
<VirtualHost *:80>
    ServerName sisciac.local
    DocumentRoot /path/to/sisciac-laravel/public

    <Directory /path/to/sisciac-laravel/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name sisciac.local;
    root /path/to/sisciac-laravel/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Solución de Problemas

### Error de Permisos

```bash
# En Linux/Mac
sudo chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
```

### Error de Base de Datos

```bash
# Verificar conexión
php artisan tinker
>>> DB::connection()->getPdo()

# Recrear base de datos
php artisan migrate:fresh --seed
```

### Error de Composer

```bash
# Limpiar cache de Composer
composer clear-cache
composer install --no-cache
```

### Error de NPM

```bash
# Limpiar cache de NPM
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Comandos Útiles

```bash
# Ver estado de migraciones
php artisan migrate:status

# Revertir última migración
php artisan migrate:rollback

# Recrear base de datos con datos de prueba
php artisan migrate:fresh --seed

# Limpiar cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Ver rutas disponibles
php artisan route:list

# Generar documentación de API
php artisan route:list --path=api
```

## Estructura de Datos de Prueba

El sistema incluye los siguientes datos de prueba:

-   **5 Productores** con información completa
-   **8 Cultivos** variados (maíz, papa, quinua, etc.)
-   **5 Capacitaciones** con asignaciones de productores
-   **8 Registros de Logística** (insumos, salidas, transporte)

## Soporte

Para soporte técnico o reportar problemas:

1. Revisar la documentación de la API en `API_DOCUMENTATION.md`
2. Verificar los logs en `storage/logs/laravel.log`
3. Consultar la documentación oficial de Laravel
