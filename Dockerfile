## Build stage: install dependencies and compile the Vite app
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies using the lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project and build the production bundle
COPY . .
ENV NODE_ENV=production
RUN npm run build

## Runtime stage: serve the built assets with Nginx
FROM nginx:1.27-alpine AS runner

# Copy a minimal SPA-friendly Nginx config
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
RUN sed -i 's/listen 80;/listen 5173;/' /etc/nginx/conf.d/default.conf

# Copy the compiled assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
