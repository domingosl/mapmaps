FROM node:16-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN npm install pm2 -g

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3214

EXPOSE 3215

EXPOSE 3216

CMD pm2-runtime index.js