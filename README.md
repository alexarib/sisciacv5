# SISCIAC v2.0.1 - Sistema de Información de Cultivos y Asistencia Comunitaria

## 🌱 Descripción

SISCIAC es una plataforma integral para el control y gestión de procesos agrícolas, diseñada para conectar productores, comunidades y gobierno en una agricultura sostenible.

**Versión 2.0.1 sin mapa** - Sistema completamente funcional con todas las características implementadas excepto el mapa interactivo.

## ✨ Características Implementadas

- ✅ **Sistema de Autenticación Completo** (Login/Register)
- ✅ **Dashboard Administrativo y de Productor**
- ✅ **Gestión de Cultivos y Productores**
- ✅ **Sistema de Logística y Rutas**
- ✅ **Gestión de Insumos y Solicitudes**
- ✅ **Sistema de Alertas y Notificaciones**
- ✅ **Formación Técnica y RRHH**
- ✅ **Análisis Geográfico y Estadísticas**
- ✅ **Comercialización y Precios de Mercado**
- ✅ **Sistema de Reportes y Transacciones**

## 🛠️ Tecnologías Utilizadas

- **Backend**: Laravel 11 (PHP 8.3)
- **Frontend**: React 18 + Vite
- **Base de Datos**: PostgreSQL 14
- **Estilos**: Tailwind CSS
- **Gráficos**: Recharts
- **Autenticación**: Laravel Sanctum (configurado)

## 🚀 Instalación Rápida

### Requisitos Previos
- PHP 8.3+
- Composer
- Node.js 18+
- PostgreSQL 14+
- Laragon (recomendado para Windows)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/sisciac-v2.0.1.git
   cd sisciac-v2.0.1
   ```

2. **Instalar dependencias**
   ```bash
   composer install
   npm install
   ```

3. **Configurar entorno**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configurar PostgreSQL**
   - Crear base de datos: `sisciac_v1`
   - Usuario: `postgres`
   - Contraseña: `jw6Y9dSFmXV.`
   - Actualizar `.env` con estas credenciales

5. **Ejecutar migraciones y seeders**
   ```bash
   php artisan migrate
   php artisan db:seed --class=UserSeeder
   ```

6. **Compilar assets**
   ```bash
   npm run build
   ```

7. **Iniciar servidor**
   ```bash
   php artisan serve
   ```

## 🔑 Credenciales de Acceso

### Administrador
- **Usuario**: `admin`
- **Contraseña**: `admin123`
- **Email**: `admin@sciac.gov.ve`

### Productores de Prueba
- **Usuario**: `juan.perez`
- **Contraseña**: `password123`

- **Usuario**: `maria.lopez`
- **Contraseña**: `password123`

## 🌐 Acceso al Sistema

- **URL Principal**: http://localhost:8000
- **API Endpoints**: http://localhost:8000/api
- **Dashboard Admin**: http://localhost:8000/admin
- **Dashboard Productor**: http://localhost:8000/producer

## 📊 Características del Sistema

### Dashboard Administrativo
- Estadísticas generales del sistema
- Gestión de productores y cultivos
- Control de logística y rutas
- Gestión de insumos y solicitudes
- Sistema de alertas y notificaciones
- Reportes y análisis

### Dashboard de Productor
- Vista personalizada para productores
- Gestión de cultivos propios
- Seguimiento de logística
- Acceso a formación técnica
- Gestión de perfil

### API REST Completa
- Autenticación con tokens
- CRUD completo para todas las entidades
- Endpoints de estadísticas
- Sistema de búsqueda
- Análisis geográfico

## 🗄️ Base de Datos

### Tablas Principales
- `users` - Usuarios del sistema
- `producers` - Productores agrícolas
- `crops` - Cultivos
- `logistics` - Logística y transporte
- `supplies` - Insumos agrícolas
- `trainings` - Formación técnica
- `alerts` - Sistema de alertas
- `reports` - Reportes y estadísticas

### Migraciones Incluidas
- ✅ 23 migraciones ejecutadas
- ✅ Seeders con datos de prueba
- ✅ Índices optimizados
- ✅ Relaciones configuradas

## 🔧 Configuración del Entorno

### Variables de Entorno (.env)
```env
APP_NAME=SISCIAC
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sisciac_v1
DB_USERNAME=postgres
DB_PASSWORD=jw6Y9dSFmXV.

SESSION_DRIVER=file
CACHE_STORE=file
LOG_LEVEL=error
```

## 📁 Estructura del Proyecto

```
sisciac-v2.0.1/
├── app/
│   ├── Http/Controllers/     # Controladores API
│   ├── Models/              # Modelos Eloquent
│   └── Providers/           # Service Providers
├── database/
│   ├── migrations/          # Migraciones de BD
│   └── seeders/            # Seeders con datos
├── resources/
│   ├── js/                 # Componentes React
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   └── contexts/       # Contextos React
│   └── views/              # Vistas Blade
├── routes/
│   ├── api.php             # Rutas API
│   └── web.php             # Rutas web
└── public/                 # Assets públicos
```

## 🧪 Testing

### Probar el Sistema
1. Acceder a http://localhost:8000
2. Iniciar sesión con `admin` / `admin123`
3. Explorar el dashboard administrativo
4. Probar las diferentes funcionalidades

### Probar API
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Dashboard stats
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Resolución de Problemas

### Error de Conexión PostgreSQL
```bash
# Verificar que PostgreSQL esté ejecutándose
netstat -an | findstr :5432

# Probar conexión
php artisan migrate:status
```

### Error de Assets
```bash
# Recompilar assets
npm run build
```

### Error de Permisos
```bash
# Configurar permisos de storage
php artisan storage:link
```

## 📈 Estado del Proyecto

### ✅ Completado
- [x] Sistema de autenticación
- [x] Dashboard administrativo
- [x] Dashboard de productor
- [x] Gestión de cultivos
- [x] Gestión de productores
- [x] Sistema de logística
- [x] Gestión de insumos
- [x] Sistema de alertas
- [x] Formación técnica
- [x] Análisis geográfico
- [x] Comercialización
- [x] Sistema de reportes
- [x] API REST completa
- [x] Base de datos PostgreSQL
- [x] Documentación completa

### ⚠️ Excluido en esta Versión
- [ ] Mapa interactivo (Leaflet)
- [ ] Visualización geográfica en tiempo real

## 🔄 Changelog

### v2.0.1 (2025-09-29) - Versión Estable Sin Mapa
- ✅ Sistema completamente funcional
- ✅ PostgreSQL configurado y funcionando
- ✅ Todos los errores JavaScript resueltos
- ✅ Autenticación implementada
- ✅ Dashboard completo
- ✅ API REST funcional
- ✅ Base de datos migrada
- ✅ Documentación actualizada
- ⚠️ Mapa interactivo excluido

### v2.0.0 (2025-08-18) - Versión Inicial
- 🎉 Versión inicial del sistema
- 🗺️ Mapa interactivo implementado
- 📊 Dashboard básico
- 👥 Gestión de usuarios

## 📞 Soporte

- **Desarrollador**: Alex C - SISCIAC Developer
- **Email**: alexc@sisciac.com
- **Proyecto**: SISCIAC v2.0.1

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**SISCIAC v2.0.1** - Sistema de Información de Cultivos y Asistencia Comunitaria  
*Versión estable sin mapa interactivo - Lista para producción*