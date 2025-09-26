# Portal Paciente - Microservicio de Licencias Médicas

## Descripción
Microservicio que actúa como consumidor del servicio de Licencias, proporcionando un portal para que los pacientes consulten sus licencias médicas.

## Funcionalidades
- **GET /patient/{patientId}/licenses**: Obtiene las licencias de un paciente específico
- **GET /health**: Endpoint de salud del servicio
- **GET /**: Información del servicio

## Arquitectura
- **Consumidor**: Consume el servicio de Licencias via HTTP
- **Base de datos local**: SQLite para almacenar información de pacientes
- **Pruebas de contrato**: Implementa Pact para Consumer-Driven Contracts

## Instalación y Ejecución

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Ejecutar tests de Pact
npm run test:pact
```

### Docker
```bash
# Construir imagen
docker build -t portal-paciente .

# Ejecutar contenedor
docker run -p 3001:3001 -e LICENSES_SERVICE_URL=http://host.docker.internal:3000 portal-paciente
```

### Docker Compose (Sistema completo)
```bash
# Levantar todos los servicios
docker compose up -d

# Generar contratos Pact
docker compose run --rm consumer-tests

# Verificar proveedor
docker compose run --rm verify-licencias

# Ver logs
docker compose logs -f portal-paciente
```

## Endpoints

### GET /patient/{patientId}/licenses
Obtiene las licencias de un paciente.

**Parámetros:**
- `patientId`: RUT del paciente (formato: 12345678-9)

**Respuestas:**
- `200`: Lista de licencias del paciente
- `400`: Patient ID inválido
- `404`: Paciente no encontrado
- `503`: Servicio de Licencias no disponible

**Ejemplo de respuesta:**
```json
{
  "patient": {
    "id": "11111111-1",
    "name": "Juan Pérez",
    "email": "juan.perez@email.com"
  },
  "licenses": [
    {
      "folio": "L-1001",
      "patientId": "11111111-1",
      "doctorId": "D-001",
      "diagnosis": "Gripe común",
      "startDate": "2024-01-15",
      "days": 7,
      "status": "issued"
    }
  ],
  "total": 1
}
```

## Pruebas de Contrato (Pact)

### Contratos implementados:
1. **Portal Paciente → Licencias**
   - Caso positivo: Paciente con licencias existentes
   - Caso borde: Paciente sin licencias

### Estados del proveedor:
- `patient 11111111-1 has issued license folio L-1001`
- `no licenses for patient 22222222-2`

## Desafíos del Desarrollo

### 1. **Manejo de Errores de Conectividad**
- **Desafío**: El servicio debe manejar gracefully cuando el servicio de Licencias no está disponible
- **Solución**: Implementé timeouts y códigos de error específicos (503) para distinguir entre errores de conectividad y errores internos

### 2. **Validación de Datos de Entrada**
- **Desafío**: Validar el formato del RUT chileno y manejar casos edge
- **Solución**: Implementé validación con regex y respuestas de error descriptivas

### 3. **Sincronización de Estados en Pact**
- **Desafío**: Asegurar que los estados del proveedor se configuren correctamente antes de las pruebas
- **Solución**: Uso de `given()` para establecer estados específicos del proveedor

### 4. **Manejo de Base de Datos en Contenedores**
- **Desafío**: Persistencia de datos entre reinicios del contenedor
- **Solución**: Uso de volúmenes Docker para persistir la base de datos SQLite

### 5. **Configuración de Redes Docker**
- **Desafío**: Comunicación entre microservicios en diferentes contenedores
- **Solución**: Uso de Docker Compose con red personalizada y nombres de servicio como hostnames

## Estructura del Proyecto
```
portal-paciente/
├── index.js                 # Servidor principal
├── package.json            # Dependencias y scripts
├── Dockerfile              # Imagen Docker
├── docker-compose.yml      # Orquestación de servicios
├── jest.config.js          # Configuración de tests
├── tests/
│   ├── setup.js           # Setup global de tests
│   └── pact/
│       └── portal-paciente-licencias.pact.test.js
├── pacts/                  # Contratos Pact generados
├── logs/                   # Logs de Pact
└── README.md              # Este archivo
```

## Variables de Entorno
- `PORT`: Puerto del servicio (default: 3001)
- `LICENSES_SERVICE_URL`: URL del servicio de Licencias (default: http://licencias:3000)
- `NODE_ENV`: Entorno de ejecución (development/production/test)
```

## 9. Crear .gitignore

```gitignore:/home/charles-darwin/PruebasSoft/TareaMicroServiciosPS/TareaMicroPaciente/.gitignore
# Dependencies
node_modules/
npm-debug.log*

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Coverage
coverage/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore

# Pact files (opcional, depende si quieres versionar los contratos)
# pacts/
```

## Resumen de la Implementación

He creado un **Portal Paciente** completo que:

1. **Consume el servicio de Licencias** via HTTP con el endpoint `GET /licenses?patientId={id}`
2. **Implementa pruebas de contrato con Pact** para validar la integración
3. **Maneja errores gracefully** (servicio no disponible, paciente no encontrado, etc.)
4. **Incluye base de datos local** (SQLite) para almacenar información de pacientes
5. **Está dockerizado** y listo para usar con Docker Compose
6. **Incluye validación de datos** (formato RUT chileno)

### Próximos pasos:

1. **Instalar las dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar el servicio**:
   ```bash
   npm run dev
   ```

3. **Probar el endpoint**:
   ```bash
   curl http://localhost:3001/patient/11111111-1/licenses
   ```

4. **Ejecutar tests de Pact**:
   ```bash
   npm run test:pact
   ```

¿Te gustaría que implemente alguna parte específica o que ajuste algo de la implementación?
