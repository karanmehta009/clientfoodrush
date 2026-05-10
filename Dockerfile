# Client Dockerfile (Multi-stage build)
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Vite app
RUN npm run build

# Production server stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx config to support React Router (SPA)
RUN rm /etc/nginx/conf.d/default.conf
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
    location /api/ { \
        proxy_pass http://server:5000/; \
        proxy_set_header Host \$host; \
        proxy_set_header X-Real-IP \$remote_addr; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
