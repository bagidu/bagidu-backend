# Build Image
FROM node:12-alpine AS build

# Disable mongo memory server download binary
ENV MONGOMS_DISABLE_POSTINSTALL=1

WORKDIR /src

COPY package*.json /src/
RUN npm install -s --no-progress

COPY . /src
RUN npm run build

# Runner Image
FROM node:12-alpine

WORKDIR /app

COPY package*.json /app/
RUN npm install --only=production -s --no-progress

COPY --from=build /src/dist/ /app/dist/

CMD [ "node", "dist/main.js" ]