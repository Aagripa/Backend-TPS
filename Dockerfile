# Dockerfile for Node.js application
FROM node:18.17.1
WORKDIR /var/www/backend/asana-magang
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "dist/main.js"]

