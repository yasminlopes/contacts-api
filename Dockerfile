FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app
COPY --from=builder /app/node_modules /app/node_modules

ENV NODE_ENV=production

EXPOSE 3333

CMD ["node", "dist/server.js"]
