FROM node:20-alpine

WORKDIR /app
RUN corepack enable

COPY package.json ./

# Install dependencies inside the image. When running via docker-compose,
# source code is bind-mounted for hot reload, while node_modules stay in the image.
RUN pnpm install

COPY tsconfig*.json ./
COPY .eslintrc.cjs ./
COPY src ./src
COPY scripts ./scripts

EXPOSE 3001
CMD ["pnpm", "start:dev"]
