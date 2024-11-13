# Etapa de compilación
FROM node:22 AS builder

WORKDIR /app

# Copiamos primero los archivos de dependencias
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código fuente y construimos la aplicación
COPY . .
RUN pnpm build

# Etapa de producción
FROM node:22 AS production

WORKDIR /app

# Copiamos solo los archivos necesarios para la producción
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile --prod

# Copiamos el código compilado desde la etapa de compilación
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["pnpm", "start"]