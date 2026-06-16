# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build --configuration=production

# Runtime stage
FROM nginx:alpine
# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built angular files
COPY --from=build /app/dist/ccms-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
