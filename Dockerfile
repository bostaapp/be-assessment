FROM node:18

WORKDIR /usr/src/app

RUN npm i -g pnpm@7.26

COPY pnpm-lock.yaml package.json ./

RUN pnpm i

COPY . .

CMD ["pnpm", "start:dev"]
