# Builder
FROM node:12-alpine AS build

RUN apk add --no-cache --update --virtual builds-deps build-base python

WORKDIR /src

COPY package*.json /src/
RUN npm install

COPY . /src
RUN npm run build

FROM node:12-alpine
RUN apk add --no-cache --update --virtual builds-deps build-base python

WORKDIR /app

COPY package*.json /app/
RUN npm install --only=production

COPY --from=build /src/dist/ /app/dist/

CMD [ "node", "dist/main.js" ]