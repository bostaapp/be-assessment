FROM node:18.0.0-alpine as build 
WORKDIR /src/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000 
CMD  npm run start:dev