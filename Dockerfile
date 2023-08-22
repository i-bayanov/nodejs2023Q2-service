FROM node:18.17.0-alpine3.18

RUN mkdir -p /usr/src/app/node_modules

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev" ]
