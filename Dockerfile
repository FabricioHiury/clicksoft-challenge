FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production=false

COPY . .

RUN npm run build

FROM node:22-alpine AS production

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs && \
    adduser -S adonisjs -u 1001

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=adonisjs:nodejs /app/build ./build
COPY --from=builder --chown=adonisjs:nodejs /app/ace ./ace
COPY --from=builder --chown=adonisjs:nodejs /app/server.ts ./server.ts
COPY --from=builder --chown=adonisjs:nodejs /app/.adonisrc.json ./.adonisrc.json

COPY --chown=adonisjs:nodejs .env.example ./.env.example

USER adonisjs

EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "server.ts"]