FROM node:lts
CMD apk add inotify-tools
RUN apt install libssl-dev
RUN wget http://nz2.archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.19_amd64.deb
RUN dpkg -i libssl1.1*.deb
RUN apt install libssl1.1

COPY package.json .
RUN npm install -g nodemon
VOLUME ["/app"]
WORKDIR /app
COPY . .
CMD nodemon index.js