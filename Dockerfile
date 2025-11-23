FROM node:25-alpine3.21

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY app.js .env /app/


CMD [ "node", "app.js" ]