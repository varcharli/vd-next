# Stage 1: Build the application
FROM node:20.17.0-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
