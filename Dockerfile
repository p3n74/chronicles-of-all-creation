# Build the static web app (pnpm monorepo)
FROM node:22-alpine AS build
WORKDIR /repo

RUN corepack enable

# Install with the full workspace context
COPY . .
RUN pnpm install --frozen-lockfile

# Baked into the client bundle at build time (t3-env: must be a valid URL)
ARG VITE_SERVER_URL=http://localhost:3000
ENV VITE_SERVER_URL=$VITE_SERVER_URL

RUN pnpm --filter web build

# Serve the static bundle
FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html
EXPOSE 80
