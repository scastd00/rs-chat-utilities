FROM node:buster-slim

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN apt-get update && apt-get install -y build-essential wget python3 make gcc curl libc6-dev

EXPOSE 4042
CMD [ "node", "forever_main.js" ]
