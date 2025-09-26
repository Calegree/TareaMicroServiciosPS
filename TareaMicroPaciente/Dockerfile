FROM node:18-alpine

# Instalar dependencias para compilación nativa
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear directorio para base de datos
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]