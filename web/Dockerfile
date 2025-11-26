FROM node:20-alpine

WORKDIR /app
RUN corepack enable

COPY package.json ./
RUN pnpm install

COPY tsconfig.json next.config.js next-env.d.ts ./
COPY app ./app
COPY public ./public

EXPOSE 3000
CMD ["pnpm", "dev"]
