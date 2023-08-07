FROM node:lts
CMD apk add inotify-tools
COPY package.json .
RUN npm install -g nodemon
VOLUME ["/app"]
WORKDIR /app
RUN npm install
COPY . .
CMD nodemon index.js