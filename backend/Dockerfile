FROM node:18-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/backend

COPY package*.json ./
RUN npm ci

COPY . .

# małe narzędzie do czekania na DB
RUN npm install -g wait-port

EXPOSE 8080

# Czekamy na DB → migracje → seedy → wypisz linki → start serwera
CMD sh -c '\
  wait-port db:3306 && \
  npx sequelize-cli db:migrate && \
  npx sequelize-cli db:seed:all && \
  echo "----------------------------------------" && \
  echo "Frontend:     http://localhost:3000" && \
  echo "phpMyAdmin:   http://localhost:8081" && \
  echo "----------------------------------------" && \
  node app.js \
'
