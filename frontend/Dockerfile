# build stage
FROM alpine:3.22

# Update package manager and dependencies to reduce vulnerabilities
RUN apk update && apk upgrade --no-cache && apk add --no-cache dumb-init
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
