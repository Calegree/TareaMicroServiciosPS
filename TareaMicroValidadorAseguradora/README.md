# Validador Aseguradora - Microservicio

Este microservicio se encarga de validar licencias médicas electrónicas para aseguradoras.

## Endpoints

### GET /insurer/licenses/{folio}/verify
Verifica si una licencia es válida.

**Respuesta exitosa (200):**
```json
{
  "valid": true
}
```

**Respuesta de licencia no encontrada (200):**
```json
{
  "valid": false
}
```

### GET /insurer/patients/{patientId}/licenses
Obtiene todas las licencias de un paciente.

**Respuesta exitosa (200):**
```json
[
  {
    "folio": "L-1001",
    "patientId": "11111111-1",
    "doctorId": "D-001",
    "diagnosis": "Gripe",
    "startDate": "2024-01-01",
    "days": 7,
    "status": "issued"
  }
]
```

## Instalación y ejecución

### Desarrollo local
```bash
npm install
npm run dev
```

### Con Docker
```bash
docker-compose up validador-aseguradora
```

### Ejecutar pruebas de contrato
```bash
docker-compose run --rm consumer-tests
```

## Variables de entorno

- `PORT`: Puerto del servicio (default: 3003)
- `LICENSES_SERVICE_URL`: URL del servicio de licencias (default: http://localhost:3001)

## Desafíos del desarrollo

1. **Manejo de errores de red**: Implementé un sistema robusto de manejo de errores para cuando el servicio de licencias no esté disponible.

2. **Timeouts**: Configuré timeouts apropiados para evitar que el servicio se cuelgue esperando respuestas.

3. **Validación de parámetros**: Agregué validación de entrada para asegurar que los parámetros requeridos estén presentes.

4. **Pruebas de contrato**: Implementé pruebas de contrato con Pact para asegurar la compatibilidad con el servicio de licencias.

5. **Manejo de estados de error**: El servicio maneja correctamente los casos donde una licencia no existe (404) y los convierte en respuestas válidas con `valid: false`.
