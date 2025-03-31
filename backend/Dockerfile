
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install -g tsx
COPY . .
RUN npm install tsc

EXPOSE 8081

CMD ["node", "dist/server.js"]