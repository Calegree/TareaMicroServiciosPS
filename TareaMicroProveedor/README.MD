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

### Docker

#Construir la imagen:

docker compose build


#Levantar el servicio:

docker compose up -d


#Ver logs en tiempo real:

docker compose logs -f licencias