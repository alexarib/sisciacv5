# SISCIAC API Documentation

## Base URL

```
http://localhost:8000/api
```

## Autenticación

Actualmente la API no requiere autenticación, pero se recomienda implementar Laravel Sanctum para producción.

## Endpoints

### Productores (Producers)

#### GET /producers

Obtiene la lista de productores con paginación.

**Respuesta:**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Juan Pérez García",
      "email": "juan.perez@email.com",
      "phone": "+51 999 123 456",
      "address": "Av. Principal 123, Distrito de San Juan",
      "document_number": "12345678",
      "document_type": "dni",
      "total_area": "25.50",
      "status": "active",
      "notes": "Productor experimentado con 10 años en el sector",
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    }
  ],
  "links": {...},
  "meta": {...}
}
```

#### POST /producers

Crea un nuevo productor.

**Body:**

```json
{
    "name": "Nuevo Productor",
    "email": "nuevo@email.com",
    "phone": "+51 999 999 999",
    "address": "Dirección del productor",
    "document_number": "87654321",
    "document_type": "dni",
    "total_area": 30.5,
    "status": "active",
    "notes": "Notas adicionales"
}
```

#### GET /producers/{id}

Obtiene un productor específico con sus relaciones.

#### PUT /producers/{id}

Actualiza un productor existente.

#### DELETE /producers/{id}

Elimina un productor.

#### GET /producers/{id}/statistics

Obtiene estadísticas de un productor específico.

### Cultivos (Crops)

#### GET /crops

Obtiene la lista de cultivos con paginación.

#### POST /crops

Crea un nuevo cultivo.

**Body:**

```json
{
    "producer_id": 1,
    "name": "Maíz Amarillo",
    "description": "Cultivo de maíz para consumo",
    "area": 8.5,
    "status": "planted",
    "planting_date": "2024-03-15",
    "expected_harvest_date": "2024-08-15",
    "variety": "Híbrido 123",
    "notes": "Cultivo con riego por goteo"
}
```

#### GET /crops/{id}

Obtiene un cultivo específico con sus relaciones.

#### PUT /crops/{id}

Actualiza un cultivo existente.

#### DELETE /crops/{id}

Elimina un cultivo.

### Logística (Logistics)

#### GET /logistics

Obtiene la lista de registros logísticos.

#### POST /logistics

Crea un nuevo registro logístico.

**Body:**

```json
{
    "producer_id": 1,
    "crop_id": 1,
    "type": "input",
    "item_name": "Fertilizante NPK",
    "description": "Fertilizante para maíz",
    "quantity": 100.0,
    "unit": "kg",
    "unit_price": 2.5,
    "total_price": 250.0,
    "date": "2024-03-20",
    "status": "delivered",
    "supplier": "AgroFert S.A.",
    "destination": "Finca del productor",
    "notes": "Entrega programada"
}
```

#### GET /logistics/{id}

Obtiene un registro logístico específico.

#### PUT /logistics/{id}

Actualiza un registro logístico.

#### DELETE /logistics/{id}

Elimina un registro logístico.

### Capacitaciones (Training)

#### GET /trainings

Obtiene la lista de capacitaciones.

#### POST /trainings

Crea una nueva capacitación.

**Body:**

```json
{
    "title": "Técnicas de Cultivo Orgánico",
    "description": "Capacitación sobre métodos orgánicos",
    "instructor": "Dr. Carlos Mendoza",
    "date": "2024-05-15",
    "start_time": "09:00",
    "end_time": "17:00",
    "location": "Centro de Capacitación",
    "capacity": 30,
    "status": "scheduled",
    "materials": "Manual y certificados",
    "notes": "Incluye práctica en campo",
    "producer_ids": [1, 2, 3]
}
```

#### GET /trainings/{id}

Obtiene una capacitación específica.

#### PUT /trainings/{id}

Actualiza una capacitación.

#### DELETE /trainings/{id}

Elimina una capacitación.

#### PATCH /trainings/{id}/attendance

Actualiza el estado de asistencia de un productor.

**Body:**

```json
{
    "producer_id": 1,
    "status": "attended",
    "feedback": "Excelente capacitación"
}
```

### Reportes (Reports)

#### GET /reports

Obtiene la lista de reportes.

#### POST /reports

Crea un nuevo reporte.

**Body:**

```json
{
    "producer_id": 1,
    "crop_id": 1,
    "title": "Reporte de Producción Mensual",
    "content": "Contenido del reporte...",
    "type": "production",
    "status": "draft",
    "report_date": "2024-03-31",
    "data": {
        "yield": 2.4,
        "area_harvested": 8.5
    },
    "file_path": "/reports/reporte_mensual.pdf"
}
```

#### GET /reports/{id}

Obtiene un reporte específico.

#### PUT /reports/{id}

Actualiza un reporte.

#### DELETE /reports/{id}

Elimina un reporte.

#### GET /reports/type/{type}

Obtiene reportes por tipo (production, financial, logistics, training, general).

#### GET /reports/producer/{producerId}

Obtiene reportes de un productor específico.

#### GET /reports/date-range

Obtiene reportes por rango de fechas.

**Query Parameters:**

-   `start_date`: Fecha de inicio (YYYY-MM-DD)
-   `end_date`: Fecha de fin (YYYY-MM-DD)

### Dashboard

#### GET /dashboard/stats

Obtiene estadísticas generales del sistema.

#### GET /dashboard/activities

Obtiene actividades recientes.

#### GET /dashboard/crop-stats

Obtiene estadísticas de cultivos por mes.

#### GET /dashboard/producer-performance

Obtiene el rendimiento de los productores.

#### GET /dashboard/logistics-summary

Obtiene resumen de logística por tipo.

### Búsqueda

#### GET /search/producers?q={query}

Busca productores por nombre, email o número de documento.

#### GET /search/crops?q={query}

Busca cultivos por nombre.

## Códigos de Estado HTTP

-   `200` - OK
-   `201` - Created
-   `400` - Bad Request
-   `404` - Not Found
-   `422` - Validation Error
-   `500` - Internal Server Error

## Validaciones

### Productor

-   `name`: requerido, máximo 255 caracteres
-   `email`: requerido, email válido, único
-   `document_number`: requerido, único
-   `document_type`: requerido, uno de: dni, ruc, ce
-   `total_area`: requerido, numérico, mínimo 0

### Cultivo

-   `producer_id`: requerido, debe existir en la tabla producers
-   `name`: requerido, máximo 255 caracteres
-   `area`: requerido, numérico, mínimo 0
-   `status`: requerido, uno de: planted, growing, harvested, failed
-   `planting_date`: requerido, fecha válida

### Logística

-   `producer_id`: requerido, debe existir en la tabla producers
-   `type`: requerido, uno de: input, output, transport
-   `item_name`: requerido, máximo 255 caracteres
-   `quantity`: requerido, numérico, mínimo 0
-   `unit`: requerido, uno de: kg, tons, liters, units
-   `date`: requerido, fecha válida

### Capacitación

-   `title`: requerido, máximo 255 caracteres
-   `description`: requerido
-   `instructor`: requerido, máximo 255 caracteres
-   `date`: requerido, fecha válida
-   `start_time`: requerido, formato HH:mm
-   `end_time`: requerido, formato HH:mm, después de start_time
-   `capacity`: requerido, entero, mínimo 0

### Reporte

-   `title`: requerido, máximo 255 caracteres
-   `content`: requerido
-   `type`: requerido, uno de: production, financial, logistics, training, general
-   `status`: requerido, uno de: draft, published, archived
-   `report_date`: requerido, fecha válida

## Ejemplos de Uso

### Crear un Productor

```bash
curl -X POST http://localhost:8000/api/producers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "document_number": "12345678",
    "document_type": "dni",
    "total_area": 25.50,
    "status": "active"
  }'
```

### Obtener Estadísticas del Dashboard

```bash
curl http://localhost:8000/api/dashboard/stats
```

### Buscar Productores

```bash
curl "http://localhost:8000/api/search/producers?q=Juan"
```

## Notas Importantes

1. Todas las fechas deben estar en formato ISO 8601 (YYYY-MM-DD)
2. Los tiempos deben estar en formato 24 horas (HH:mm)
3. Los decimales se manejan con punto (.) como separador
4. La paginación está configurada para 15 elementos por página
5. Las respuestas incluyen metadatos de paginación cuando aplica
