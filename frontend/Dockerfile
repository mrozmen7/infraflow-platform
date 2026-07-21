# syntax=docker/dockerfile:1

# Build stage: produce the Angular production bundle.
FROM node:24-alpine AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage: nginx serves the static bundle and proxies /api to the backend.
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist/infraflow-web/browser /usr/share/nginx/html
EXPOSE 80
