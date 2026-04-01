# Stage 1: Build the React application
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We need to build the app. You can pass REACT_APP_API_URL via args if needed.
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
# Copy the built assets from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Add a custom Nginx configuration to support React Router (SPA)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
