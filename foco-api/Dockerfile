FROM node:18-alpine

RUN apk add --no-cache git openssh

# Install pnpm
RUN npm install -g pnpm

# Configura PNPM_HOME para que funcionen los binarios globales
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

WORKDIR /app

# Copia package.json (y opcionalmente pnpm-lock.yaml si lo tienes)
COPY pnpm-lock.yaml ./
COPY package.json ./

# Fuerza instalación de TODAS las dependencias (dev incluidas)
ENV NODE_ENV=development
RUN pnpm install --frozen-lockfile

# Instala NestJS CLI
# Instala NestJS CLI y otras herramientas globales
RUN pnpm install -g @nestjs/cli

# Copia el resto del código fuente
COPY . .

# Exponer puerto (asegurándonos que sea el mismo que en el código)
EXPOSE 3002

# Inicia en modo desarrollo con hot-reload
CMD ["pnpm", "run", "start:dev"]