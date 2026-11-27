# Imagem de produção do LAB40 (Node.js, sem dependências de build).
FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Instala só as dependências de produção; a camada fica em cache enquanto o lockfile não mudar.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copia apenas o código necessário para executar a aplicação.
COPY src ./src
COPY public ./public

# Executa sem privilégios de root.
USER node

EXPOSE 3000

# Verifica a disponibilidade pelo endpoint /health.
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server.js"]
