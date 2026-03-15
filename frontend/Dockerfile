# build stage
FROM node:alpine AS build

# Update package manager and dependencies to reduce vulnerabilities
RUN apk update && apk upgrade --no-cache && apk add --no-cache dumb-init
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
# 2. Copia os arquivos gerados pelo Vite (React)
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
