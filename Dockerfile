FROM node:16

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN NODE_ENV=production npm ci
COPY . .

CMD [ "npm", "start" ]
