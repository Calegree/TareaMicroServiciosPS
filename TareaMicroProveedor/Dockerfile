# Imagen base de Node.js
FROM node:18-alpine

# Crear directorio de la app
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Crear carpeta para la base de datos (persistencia)
RUN mkdir -p /usr/src/app/db

# Exponer el puerto
EXPOSE 3000

# Comando por defecto
CMD ["node", "index.js"]
