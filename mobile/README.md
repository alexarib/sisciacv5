# SISCIAC Mobile (Fase 3)

App móvil creada con Expo/React Native para productores y administradores.

## Requisitos

-   Node.js >= 18
-   Expo CLI (`npm i -g expo`)
-   Android Studio o Expo Go en el teléfono

## Instalación

```
cd mobile
npm install
```

## Ejecución

```
npm run start
# luego presiona "a" para Android o escanea el QR con Expo Go
```

## Funcionalidades (MVP)

-   Autenticación simulada (admin/admin123, juan.perez/password123)
-   Geolocalización (coordenadas actuales)
-   Fotoregistro simulado (descarga placeholder y guarda offline)
-   Modo offline (AsyncStorage + SQLite preparado)
-   Navegación básica (Login -> Dashboard)

## Próximos pasos

-   Reemplazar login simulado por API con Sanctum
-   Captura de cámara real con `expo-camera`
-   Sincronización de fotos y datos al reconectar
-   Push notifications con `expo-notifications`
-   Formularios de siembra/cosecha y solicitudes de insumos
