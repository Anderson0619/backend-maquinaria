FROM node:12-alpine

WORKDIR /usr/src/app

LABEL name="nest-generic-backend" version="node:12-alpine"

COPY package*.json ./
COPY yarn.lock ./

RUN apk add --no-cache \
        sudo \
        curl \
        build-base \
        g++ \
        libpng \
        libpng-dev \
        jpeg-dev \
        pango-dev \
        cairo-dev \
        giflib-dev \
        python3 \
        openssl \
        tzdata

RUN yarn install

COPY . ./

RUN yarn build

EXPOSE 3001

ENTRYPOINT [ "yarn", "start:prod" ]