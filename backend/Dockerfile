FROM node:18-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/backend

COPY package*.json ./
RUN npm ci

COPY . .


RUN npm install -g wait-port

EXPOSE 8080

#
CMD sh -c "wait-port mysql:3306 && npx sequelize-cli db:migrate && node app.js"
