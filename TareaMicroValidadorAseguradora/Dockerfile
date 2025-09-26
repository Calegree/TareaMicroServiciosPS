FROM node:18-alpine

# Instalar dependencias para compilación nativa
RUN apk add --no-cache python3 make g++

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

# Crear directorio para pacts
RUN mkdir -p pacts

# Exponer puerto
EXPOSE 3003

# Comando por defecto
CMD ["npm", "start"]