FROM node:18

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
COPY --from=tarampampam/curl:7.78.0 /bin/curl /bin/curl

EXPOSE 4042
CMD [ "node", "forever_main.js" ]
