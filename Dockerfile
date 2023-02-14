FROM node:18.14-alpine3.17


WORKDIR /app

COPY . /app
RUN npm install
