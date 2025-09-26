FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear directorio para pacts
RUN mkdir -p pacts

# Exponer puerto
EXPOSE 3003

# Comando por defecto
CMD ["npm", "start"]
