FROM node:18-alpine

# Instalar dependencias para compilación nativa
RUN apk add --no-cache python3 make g++ sqlite-dev curl

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Limpiar caché y reinstalar
RUN npm cache clean --force
RUN rm -rf node_modules package-lock.json

# Forzar compilación desde código fuente de módulos nativos (better-sqlite3)
ENV npm_config_build_from_source=true

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Crear carpeta para la base de datos
RUN mkdir -p /usr/src/app/db

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "index.js"]