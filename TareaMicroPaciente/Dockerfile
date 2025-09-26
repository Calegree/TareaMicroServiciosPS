FROM node:18-alpine

# Instalar dependencias para compilación nativa
RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Limpiar caché y reinstalar
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Crear directorio para base de datos
RUN mkdir -p /app/data

# Exponer puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]